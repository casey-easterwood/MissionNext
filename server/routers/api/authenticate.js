const express = require('express');
const { Users } = require('../../database/Users');
const { Token } = require('../../authentication/Token');

module.exports.Route = function (app) {
    let router = express.Router();
    let users = Users(app);

    // Post Routes
    router.post('/', function (req, res, next) {
        const credentials = {
            UserLogin : req.body.UserLogin,
            UserPassword : req.body.UserPassword
        };

        let authenticated = {
            status : false,
            token: ''
        };

        users.authenticate(credentials.UserLogin, credentials.UserPassword)
            .then((authenticated) =>{
                if(authenticated === false){
                    res.send(JSON.stringify(authenticated));
                } else {

                    let payload = {
                        User: { UserLogin : authenticated.UserLogin }
                    };

                    let jwt = new Token(app.rootPath);
                    let signedToken = jwt.sign(payload);
                    let cookie = jwt.makeCookie(signedToken);

                    const response = {
                        status : true,
                        token : signedToken,
                        User : {
                            userId: authenticated.UserId,
                            userLogin: authenticated.UserLogin
                        }
                    };

                    res.header("Content-Type", "application/json");
                    res.header("Set-Cookie", cookie);
                    res.send(JSON.stringify(response));
                }
            })

            .catch((error) => {

                next(error);
            });
    });

    return router;
};
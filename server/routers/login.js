const express = require('express');
const { Users } = require('../database/Users');
const { Token } = require('../authentication/Token');

module.exports.Route = function (app) {
    let router = express.Router();
    let users = Users(app);

    router.get('/', function (req, res, next) {
        res.render(
            'login/login.handlebars',
            {
                title: "Authentication"
            }
        );
    });

    // Post Routes

    router.post('/authenticate', function (req, res, next) {
        const user = {
            UserLogin : req.body.UserLogin,
            UserPassword : req.body.UserPassword
        };

        users.authenticate(user.UserLogin, user.UserPassword)

            .then((authenticated) =>{
                if(authenticated === false){
                    res.render('login/login.handlebars', { title: "Authentication Failed", message: "Authentication Failed" });
                } else {

                    let payload = {
                        User: { UserLogin : authenticated.UserLogin }
                    };

                    let jwt = new Token(app.rootPath);
                    let signedToken = jwt.sign(payload);
                    let cookie = jwt.makeCookie(signedToken);

                    res.setHeader("Set-Cookie", cookie);
                    res.render('users/welcome.handlebars', { title: "Users" });

                }

            })

            .catch(next);
    });

    return router;
};
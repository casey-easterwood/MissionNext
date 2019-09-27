const { Token } = require('../authentication/Token');

module.exports.Authenticate = function (req, res, next) {

    if(req.headers.authentication){
        let token = new Token(global.app.rootPath);
        let signed = req.headers.authentication;
        let decoded = token.verify(signed);

        req.User = decoded.User;

        next();
    } else {
        let data = { title: "Unauthorized", message: "You are not authorized. Please Authentication"}

        res.render('login/login.handlebars', data);
    }

};
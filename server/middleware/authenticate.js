const { Token } = require('../authentication/Token');

module.exports.Authenticate = function (req, res, next) {
    if(req.headers.authentication){
        let token = new Token(global.app.rootPath);
        let signed = req.headers.authentication;
        let decoded = token.verify(signed);
        req.User = decoded.User;

        console.info(req.User.userLogin + "@" + req.ip + " - " + req.originalUrl);

        if(decoded)
            next();
        else
            res.sendStatus(401);
    } else {
        res.sendStatus(401);
    }

};
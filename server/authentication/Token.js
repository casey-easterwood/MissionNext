const fs = require('fs');
const token = require('jsonwebtoken');

module.exports.Token = function () {
    let self = this;

    self.privateKey = fs.readFileSync(global.app.rootPath + '/server/config/private.pem');

    self.sign = function(payload){
        return token.sign(payload, self.privateKey);
    };

    self.verify = function(signed){
        let decoded = false;

        try {
            decoded = token.verify(signed, self.privateKey);
        } catch (e) {
            console.log(e);
            decoded = false;
        }

        return decoded;
    };

    self.makeCookie = function(signedToken){
        let options =[
            "Authentication=" + signedToken,
            "Domain=localhost",
            "Path=/",
            "SameSite=Strict",
            "HttpOnly"
        ];

        return options.join(";");
    };

    self.log = function () {
        console.log(self.privateKey);
    };
};
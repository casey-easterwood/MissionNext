const express = require('express');
const { Users } = require('../../database/Users');
const { Authenticate } = require('../../middleware/authenticate');

module.exports.Route = function (app) {
    let router = express.Router();
    let users = Users(app);

    router.use(Authenticate);

    // Post Routes
    router.get('/getAll', function (req, res, next) {
        users.getAll()
        .then(response => {
            res.header("Content-Type", "application/json");
            res.send(JSON.stringify(response));
        })
        .catch((error) =>{
            res.status(400);
        })
    });

    router.post('/update', function (req, res, next) {
        let fields = req.body;
        let key = null;
        let data = [];

        fields.forEach((field) => {
            if(field.name == 'UserId')
                key = field.value;
            else
                data.push(field);
        });

        users.update(key, data)
        .then(({results}) => {
            let response = { status:'success', message: ''};
            res.send(JSON.stringify(response));
        })
        .catch((error) => {
            let response = { status:'error', message: error.code };
            res.send(JSON.stringify(response));
        });
    });

    router.post('/createNew', function (req, res, next) {
        let fields = req.body;
        let data = [];

        fields.forEach((field) => {
            if(field.name != 'UserId')
                data.push(field);
        });

        users.createNew(data)
        .then(({results}) => {
            let response = { status:'success', insertId: results.insertId };
            res.send(JSON.stringify(response));
        })
        .catch((error) => {
            let response = { status:'error', message: error.code };
            res.send(JSON.stringify(response));
        });

    });

    router.post('/delete', function (req, res, next) {
        let fields = req.body;
        let userId = 0;

        fields.forEach((field) => {
            if(field.name == 'UserId')
                userId = field.value;
        });

        users.delete(userId)
            .then(({results}) => {
                let response = { status:'success', message: userId};
                res.send(JSON.stringify(response));
            })
            .catch((error) => {
                let response = { status:'error', message: error.code };
                res.send(JSON.stringify(response));
            });

    });

    // Post Routes
    router.post('/resetPassword', function (req, res, next) {
        let fields = req.body;
        let userId = 0;
        let userPassword = '';

        fields.forEach((field) => {
           if(field.name == "UserId"){
               userId = field.value;
           } else if (field.name == "UserPassword"){
               userPassword = field.value;
           }
        });

        users.resetPassword(userId, userPassword)
            .then(({results}) => {
                let response = { status:'success', message: 'Password Changed'};
                res.send(JSON.stringify(response));
            })
            .catch((error) => {
                let response = { status:'error', message: error.code };
                res.send(JSON.stringify(response));
            });

    });

    router.post('/userExists', function (req, res, next) {
        let {userName} = req.body;

        users.userExists(userName)
            .then((results) => {
                let response = { status:'success', exists:results };
                res.send(JSON.stringify(response));
            })
            .catch((error) => {
                let response = { status:'error', message: error.code };
                res.send(JSON.stringify(response));
            });

    });
    return router;
};
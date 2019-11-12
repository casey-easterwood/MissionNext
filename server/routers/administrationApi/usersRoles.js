const express = require('express');
const  UserRoles  = require('../../database/UserRoles');
const { Authenticate } = require('../../middleware/authenticate');

module.exports.Route = function (app) {
    let router = express.Router();
    let userRoles = new UserRoles(app);

    router.use(Authenticate);

    // Post Routes
    router.get('/getAll', function (req, res, next) {
        userRoles.listAll()
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
            if(field.name == 'Id')
                key = field.value;
            else
                data.push(field);
        });

        userRoles.update(key, data)
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
            if(field.name != 'Id')
                data.push(field);
        });

        userRoles.createNew(data)
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
        let roleId = 0;

        fields.forEach((field) => {
            if(field.name == 'Id')
                roleId = field.value;
        });

        userRoles.delete(roleId)
            .then(({results}) => {
                let response = { status:'success', message: roleId};
                res.send(JSON.stringify(response));
            })
            .catch((error) => {
                let response = { status:'error', message: error.code };
                res.send(JSON.stringify(response));
            });

    });

    router.post('/roleExists', function (req, res, next) {
        let {roleName} = req.body;

        userRoles.exists(roleName)
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
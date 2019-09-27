const express = require('express');
const DBContext = require('../../database/ProfileQuestionGroups');
const { Authenticate } = require('../../middleware/authenticate');

module.exports.Route = function (app) {
    let router = express.Router();

    router.use(Authenticate);

    // Post Routes
    router.get('/list', function (req, res, next) {
        let db = new DBContext(app);

        db.listAll()
            .then(response => {
                res.header("Content-Type", "application/json");
                res.send(JSON.stringify(response));
            })
    });

    router.post('/save', function (req, res, next) {
        let db = new DBContext(app);
        let fields = req.body;
        let key = null;
        let data = [];

        fields.forEach((field) => {
            if(field.name == 'Id')
                key = field.value;
            else
                data.push(field);
        });

        db.update(key, data)
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
        let db = new DBContext(app);
        let fields = req.body;
        let data = [];

        fields.forEach((field) => {
            if(field.name != 'Id')
                data.push(field);
        });

        db.create(data)
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
        let db = new DBContext(app);
        let {id} = req.body;

        db.delete(id)
            .then((results) => {
                let response = { status:'success', results:results };
                res.send(JSON.stringify(response));
            })
            .catch((error) => {
                let response = { status:'error', message: error.code };
                res.send(JSON.stringify(response));
            });

    });

    return router;
};
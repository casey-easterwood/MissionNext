const express = require('express');
const DBContext = require('../../database/CandidateProfileAnswers');
const { Authenticate } = require('../../middleware/authenticate');

module.exports.Route = function (app) {
    let router = express.Router();

    router.use(Authenticate);

    // Post Routes
    router.get('/listByCandidate', function (req, res, next) {
        let db = new DBContext(app);
        let candidateId = req.params.id;

        db.listByCandidate(candidateId)
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
                let response = { status:'success', message:id };
                res.send(JSON.stringify(response));
            })
            .catch((error) => {
                let response = { status:'error', message: error.code };
                res.send(JSON.stringify(response));
            });

    });

    return router;
};
const express = require('express');
const JobsContext = require('../../database/Jobs');
const JobCategories = require('../../database/JobCategories');
const { Authenticate } = require('../../middleware/authenticate');
const { AuthorizeAgency } = require('../../middleware/authorizeAgency');

module.exports.Route = function (app) {
    let router = express.Router();

    router.use(Authenticate);

    router.use(AuthorizeAgency);

    router.get('/list', function (req, res, next) {
        let jobs = new JobsContext(app);

        jobs.listByAgency(req.User.entityId)
            .then(response => {
                res.header("Content-Type", "application/json");
                res.send(JSON.stringify(response));
            })
    });

    router.post('/save', function (req, res, next) {
        let jobs = new JobsContext(app);
        let fields = req.body;
        let key = null;
        let data = [];

        fields.forEach((field) => {
            if(field.name == 'Id')
                key = field.value;
            else
                data.push(field);
        });

        jobs.update(key, data)
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
        let jobs = new JobsContext(app);
        let fields = req.body;
        let data = [];

        fields.forEach((field) => {
            if(field.name != 'Id')
                data.push(field);
        });

        jobs.create(data)
        .then(({results}) => {
            let response = { status:'success', insertId: results.insertId };
            res.send(JSON.stringify(response));
        })
        .catch((error) => {
            console.log(error);
            let response = { status:'error', message: error.code };
            res.send(JSON.stringify(response));
        });

    });

    router.post('/delete', function (req, res, next) {
        let jobs = new JobsContext(app);
        let {id} = req.body;

        jobs.delete(id)
            .then((results) => {
                let response = { status:'success', results:results };
                res.send(JSON.stringify(response));
            })
            .catch((error) => {

                let response = { status:'error', message: error.code };
                res.send(JSON.stringify(response));
            });

    });

    router.get('/jobDescription/:JobId', function (req, res, next) {
        debugger;
        let jobs = new JobsContext(app);
        let jobId = req.params.JobId;

        jobs.getDescription(jobId)
            .then(response => {
                res.header("Content-Type", "application/json");
                res.send(JSON.stringify(response));
            })
    });

    //List all available categories
    router.get('/listAllCategories', function (req, res, next) {
        let jobs = new JobCategories(app);

        jobs.listAll()
            .then(response => {
                res.header("Content-Type", "application/json");
                res.send(JSON.stringify(response));
            })
    });

    return router;
};
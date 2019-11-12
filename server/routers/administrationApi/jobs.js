const express = require('express');
const JobsContext = require('../../database/Jobs');
const JobCategories = require('../../database/JobCategories');
const { Authenticate } = require('../../middleware/authenticate');

module.exports.Route = function (app) {
    let router = express.Router();

    router.use(Authenticate);

    router.get('/getProfileData/:JobId', function (req, res, next) {
        debugger;
        let jobs = new JobsContext(app);
        let jobId = req.params.JobId;

        jobs.getProfileData(jobId)
            .then(response => {
                res.header("Content-Type", "application/json");
                res.send(JSON.stringify(response));
            })
    });

    router.get('/list', function (req, res, next) {
        let jobs = new JobsContext(app);

        jobs.listAll()
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

    //list categories used in jobs table
    router.get('/listCategories', function (req, res, next) {
        let jobs = new JobsContext(app);

        jobs.getJobCategories()
            .then(response => {
                res.header("Content-Type", "application/json");
                res.send(JSON.stringify(response));
            })
    });

    //list agencies used in jobs table
    router.get('/listAgencies', function (req, res, next) {
        let jobs = new JobsContext(app);

        jobs.getJobAgencies()
            .then(response => {
                res.header("Content-Type", "application/json");
                res.send(JSON.stringify(response));
            })
    });

    router.get('/listLocations', function (req, res, next) {
        let jobs = new JobsContext(app);

        jobs.getJobLocations()
            .then(response => {
                res.header("Content-Type", "application/json");
                res.send(JSON.stringify(response));
            })
    });

    router.get('/listByCategory', function (req, res, next) {
        let jobs = new JobsContext(app);
        let category = req.query.category;

        jobs.listByCategory(category)
            .then(response => {
                res.header("Content-Type", "application/json");
                res.send(JSON.stringify(response));
            })
    });

    router.get('/listByLocation', function (req, res, next) {
        let jobs = new JobsContext(app);
        let location = req.query.location;

        jobs.listByLocation(location)
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

    router.post('/saveCategory', function (req, res, next) {
        let categories = new JobCategories(app);
        let fields = req.body;
        let key = null;
        let data = [];

        fields.forEach((field) => {
            if(field.name == 'Id')
                key = field.value;
            else
                data.push(field);
        });

        categories.update(key, data)
            .then(({results}) => {
                let response = { status:'success', message: ''};
                res.send(JSON.stringify(response));
            })
            .catch((error) => {
                let response = { status:'error', message: error.code };
                res.send(JSON.stringify(response));
            });
    });

    router.post('/saveDescription', function (req, res, next) {
        let jobs = new JobsContext(app);
        let fields = req.body;
        let key = null;
        let data = [];

        fields.forEach((field) => {
            if(field.name == 'JobId')
                key = field.value;
            else
                data.push(field);
        });

        jobs.updateDescription(key, data)
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

        console.log("Create New");

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

    router.post('/createDescription', function (req, res, next) {
        let jobs = new JobsContext(app);
        let fields = req.body;
        let data = [];

        console.log("Create New");

        fields.forEach((field) => {
            if(field.name != 'Id')
                data.push(field);
        });

        jobs.createDescription(data)
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

    router.post('/createNewCategory', function (req, res, next) {
        let categories = new JobCategories(app);
        let fields = req.body;
        let data = [];

        console.log("createNewCategory");

        fields.forEach((field) => {
            if(field.name != 'Id')
                data.push(field);
        });

        categories.create(data)
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

    router.post('/deleteCategory', function (req, res, next) {
        let categories = new JobCategories(app);
        let {id} = req.body;

        categories.delete(id)
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
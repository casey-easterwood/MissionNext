const express = require('express');
const SchoolsContext = require('../../database/Schools');
const { Authenticate } = require('../../middleware/authenticate');

module.exports.Route = function (app) {
    let router = express.Router();

    router.use(Authenticate);

    // Post Routes
    router.get('/list', function (req, res, next) {
        let schools = new SchoolsContext(app);

        schools.listAll()
            .then(response => {
                res.header("Content-Type", "application/json");
                res.send(JSON.stringify(response));
            })
    });

    router.post('/save', function (req, res, next) {
        let schools = new SchoolsContext(app);
        let fields = req.body;
        let key = null;
        let data = [];

        fields.forEach((field) => {
            if(field.name == 'Id')
                key = field.value;
            else
                data.push(field);
        });

        schools.update(key, data)
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
        let schools = new SchoolsContext(app);
        let fields = req.body;
        let data = [];

        fields.forEach((field) => {
            if(field.name != 'Id')
                data.push(field);
        });

        schools.create(data)
        .then(({results}) => {
            let response = { status:'success', insertId: results.insertId };
            res.send(JSON.stringify(response));
        })
        .catch((error) => {
            let response = { status:'error', message: error.code };
            console.log(error);
            res.send(JSON.stringify(response));
        });

    });

    router.post('/exists', function (req, res, next) {
        let schools = new SchoolsContext(app);
        let {Name} = req.body;

        schools.exists(Name)
            .then((results) => {
                let response = { status:'success', exists:results };
                res.send(JSON.stringify(response));
            })
            .catch((error) => {
                let response = { status:'error', message: error.code };
                res.send(JSON.stringify(response));
            });

    });

    router.post('/delete', function (req, res, next) {
        let schools = new SchoolsContext(app);
        let {id} = req.body;

        schools.delete(id)
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
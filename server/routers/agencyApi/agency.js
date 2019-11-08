const express = require('express');
const AgenciesContext = require('../../database/Agencies');
const { Authenticate } = require('../../middleware/authenticate');
const { AuthorizeAgency } = require('../../middleware/authorizeAgency');

module.exports.Route = function (app) {
    let router = express.Router();

    router.use(Authenticate);

    router.use(AuthorizeAgency);

    // Post Routes
    router.get('/get', function (req, res, next) {
        let agencies = new AgenciesContext(app);

        agencies.get(req.User.entityId)
            .then(response => {
                res.header("Content-Type", "application/json");
                res.send(JSON.stringify(response));
            })
    });

    router.post('/save', function (req, res, next) {
        let agencies = new AgenciesContext(app);
        let fields = req.body;
        let key = req.User.entityId;
        let data = [];

        fields.forEach((field) => {
            if(field.name != 'Id')
                data.push(field);
        });

        agencies.update(key, data)
        .then(({results}) => {
            let response = { status:'success', message: ''};
            res.send(JSON.stringify(response));
        })
        .catch((error) => {
            let response = { status:'error', message: error.code };
            res.send(JSON.stringify(response));
        });
    });

    return router;
};
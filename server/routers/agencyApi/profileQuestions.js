const express = require('express');
const DBContext = require('../../database/ProfileQuestion');
const { Authenticate } = require('../../middleware/authenticate');
const { AuthorizeAgency } = require('../../middleware/authorizeAgency');

module.exports.Route = function (app) {
    let router = express.Router();

    router.use(Authenticate);

    router.use(AuthorizeAgency);

    // Post Routes
    router.get('/list', function (req, res, next) {
        let db = new DBContext(app);

        db.listAll()
            .then(response => {
                res.header("Content-Type", "application/json");
                res.send(JSON.stringify(response));
            })
    });

    return router;
};
const express = require('express');

module.exports.Route = function (app) {
    let router = express.Router();

    router.get('*', function (req, res) {
        console.log(req.path);
        res.render('index.handlebars', { title: "Mission Next"})
    });

    return router;
};
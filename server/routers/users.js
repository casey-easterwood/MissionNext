const express = require('express');
const { Users } = require('../database/Users');
const { Authenticate } = require('../middleware/authenticate');

module.exports.Route = function (app) {
    let router = express.Router();
    let users = Users(app);

    router.use(Authenticate);

    router.get('/', function (req, res, next) {
        users.getAll()

        .then((response) => {
            res.render('users/index.handlebars', { title: "Users", model: response });
        })

        .catch(next);

    });

    router.get('/createNew', function (req, res, next) {
        const data = { title: "Create User" };

        res.render('users/createNew.handlebars',data);
    });

    router.get('/view/:id', function (req, res, next) {
        const id = req.params.id;

        users.get(id)

        .then((response) => {
            res.render('users/view.handlebars',{title: "View User", model: response });
        })

        .catch(next);

    });

    router.get('/delete/:id', function (req, res, next) {
        const id = req.params.id;

        users.get(id)

            .then((response) => {
                res.render('users/delete.handlebars',{title: "View User", model: response });
            })

            .catch(next);

    });

    // Post Routes
    router.post('/createNew', function (req, res, next) {
        const user = {
            UserLogin : req.body.UserLogin,
            UserPassword : req.body.UserPassword
        };

        users.userExists(user.UserLogin)

        .then((exists) =>{
            if(exists){
                const data = {
                  title: "Create User",
                  message: "User already exists"
                };

                res.render('users/createNew.handlebars', data);
            } else {
                users.create(user.UserLogin, user.UserPassword)

                .then((response) => {
                    res.redirect('/users/');
                })
            }
        })

        .catch(next);
    });

// Post Routes
    router.post('/userPassword', function (req, res, next) {
        const user = {
            UserId : req.body.UserId,
            Password : req.body.Password
        };

        users.resetPassword(user.UserLogin, user.UserPassword)

            .then((response) =>{

            })

            .catch(next);
    });

    router.post('/delete', function (req, res, next) {
        const user = {
            UserId : req.body.UserId
        };

        users.delete(user.UserId)

        .then(() => {
            res.redirect('/users/');
        })

        .catch(next);
    });

    return router;
};
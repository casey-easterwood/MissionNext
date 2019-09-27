/**
 * @var module
 * @type {createApplication}
 */

const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


class App {
    constructor(rootPath, database, handlebarsConfig){
        this.rootPath = rootPath;
        this.express = express();
        this.database = database;
        this.initHandlebars(handlebarsConfig);

        // parse application/x-www-form-urlencoded
        this.express.use(bodyParser.urlencoded({ extended: false }))

        // parse application/json
        this.express.use(bodyParser.json());

        this.express.use(cookieParser());

        // this.express.use(Authentication);
    }

    initHandlebars(handlebarsConfig){
        this.express.engine('handlebars', handlebars.create(handlebarsConfig).engine);
        this.express.set('views', this.rootPath + '/server/views');
        this.express.set('view engine', 'handlebars');
    }



    registerRouteStatic(remoteRoute, localRoute){
        this.express.use(
            remoteRoute,
            express.static(localRoute)
        );
    }

    registerRoute(path, router) {
        this.express.use(path, router);
    }

    registerErrorHandler(handler){
        this.express.use(handler);
    }

    listen(port){
        this.express.listen(port, console.log(`listening on port ${port}`));
    }
}

module.exports = {
    App
};
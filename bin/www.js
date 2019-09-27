/**
 * Initialize Login
 * @type {module.exports.Database}
 */

//Configuration
const config   = require('../server/config/app');
const sqlConfig   = require('../server/config/mysql');
const handlebarsConfig   = require('../server/config/mysql');

//Routers
const { Route : indexRoute } = require('../server/routers/index');
const { Route : usersRoute } = require('../server/routers/users');
const { Route : loginRoute } = require('../server/routers/login');
const { Route : apiAuthenticate } = require('../server/routers/api/authenticate');
const { Route : apiUsers } = require('../server/routers/api/users');
const { Route : apiAgencies } = require('../server/routers/api/agencies');
const { Route : apiCandidates } = require('../server/routers/api/candidates');
const { Route : apiJobs } = require('../server/routers/api/jobs');
const { Route : CandidateProfile } = require("../server/routers/api/candidateProfile")
const { Route : ProfileQuestionAnswers } = require('../server/routers/api/profileQuestionAnswers');
const { Route : ProfileQuestionGroups } = require('../server/routers/api/profileQuestionGroups');
const { Route : ProfileQuestions } = require('../server/routers/api/profileQuestions');

//Error Handlers
const { DefaultErrorHandler } = require('../server/middleware/errorHandler');

//Bootstrap
const { App } = require('../server/app');
const { Database } = require('../server/database/Database');

const database    = new Database(sqlConfig);
global.app        = new App(__dirname + "/..", database, handlebarsConfig);

global.app.registerRouteStatic('/resources', app.rootPath + config.staticFilesPath);

global.app.registerRoute('/api/authenticate/', apiAuthenticate(app));
global.app.registerRoute('/api/agencies/', apiAgencies(app));
global.app.registerRoute('/api/candidates/', apiCandidates(app));
global.app.registerRoute('/api/candidate/profile', CandidateProfile(app));
global.app.registerRoute('/api/jobs/', apiJobs(app));
global.app.registerRoute('/api/users/', apiUsers(app));
global.app.registerRoute('/api/profile/questions/', ProfileQuestions(app));
global.app.registerRoute('/api/profile/groups/', ProfileQuestionGroups(app));
global.app.registerRoute('/api/profile/answers/', ProfileQuestionAnswers(app));

global.app.registerRoute('/',      indexRoute(app));
global.app.registerRoute('/users', usersRoute(app));
global.app.registerRoute('/login', loginRoute(app));


//Error handlers must be registered after all routes
global.app.registerErrorHandler(DefaultErrorHandler);

global.app.listen(config.port);


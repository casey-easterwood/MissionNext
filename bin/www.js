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
const { Route : apiAuthenticate } = require('../server/routers/administrationApi/authenticate');
const { Route : apiUsers } = require('../server/routers/administrationApi/users');
const { Route : apiUsersRoles } = require('../server/routers/administrationApi/usersRoles');
const { Route : apiAgencies } = require('../server/routers/administrationApi/agencies');
const { Route : apiSchools } = require('../server/routers/administrationApi/schools');
const { Route : apiAgency } = require('../server/routers/agencyApi/agency');
const { Route : apiAgencyProfileQuestionGroups } = require('../server/routers/agencyApi/profileQuestionGroups');
const { Route : apiAgencyProfileQuestions } = require('../server/routers/agencyApi/profileQuestions');
const { Route : apiAgencyProfileQuestionAnswers } = require('../server/routers/agencyApi/profileQuestionAnswers');
const { Route : apiAgencyJobs } = require('../server/routers/agencyApi/jobs');
const { Route : apiCandidates } = require('../server/routers/administrationApi/candidates');
const { Route : apiJobs } = require('../server/routers/administrationApi/jobs');
const { Route : CandidateProfile } = require("../server/routers/administrationApi/candidateProfile");
const { Route : ProfileQuestionAnswers } = require('../server/routers/administrationApi/profileQuestionAnswers');
const { Route : ProfileQuestionGroups } = require('../server/routers/administrationApi/profileQuestionGroups');
const { Route : ProfileQuestions } = require('../server/routers/administrationApi/profileQuestions');

//Error Handlers
const { DefaultErrorHandler } = require('../server/middleware/errorHandler');

//Bootstrap
const { App } = require('../server/app');
const { Database } = require('../server/database/Database');

const database    = new Database(sqlConfig);
global.app        = new App(__dirname + "/..", database, handlebarsConfig);

global.app.registerRouteStatic('/resources', app.rootPath + config.staticFilesPath);

global.app.registerRoute('/api/authenticate/', apiAuthenticate(app));
global.app.registerRoute('/api/agency/', apiAgency(app));
global.app.registerRoute('/api/agency/Jobs', apiAgencyJobs(app));
global.app.registerRoute('/api/agency/ProfileQuestionGroups', apiAgencyProfileQuestionGroups(app));
global.app.registerRoute('/api/agency/ProfileQuestions', apiAgencyProfileQuestions(app));
global.app.registerRoute('/api/agency/ProfileQuestionAnswers', apiAgencyProfileQuestionAnswers(app));
global.app.registerRoute('/api/agencies/', apiAgencies(app));
global.app.registerRoute('/api/schools/', apiSchools(app));
global.app.registerRoute('/api/candidates/', apiCandidates(app));
global.app.registerRoute('/api/candidate/profile', CandidateProfile(app));
global.app.registerRoute('/api/jobs/', apiJobs(app));
global.app.registerRoute('/api/users/', apiUsers(app));
global.app.registerRoute('/api/users/roles/', apiUsersRoles(app));
global.app.registerRoute('/api/profile/questions/', ProfileQuestions(app));
global.app.registerRoute('/api/profile/groups/', ProfileQuestionGroups(app));
global.app.registerRoute('/api/profile/answers/', ProfileQuestionAnswers(app));

global.app.registerRoute('/',      indexRoute(app));
global.app.registerRoute('/users', usersRoute(app));
global.app.registerRoute('/login', loginRoute(app));


//Error handlers must be registered after all routes
global.app.registerErrorHandler(DefaultErrorHandler);

global.app.listen(config.port);


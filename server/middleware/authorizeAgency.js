const { Users } = require('../../server/database/Users');

module.exports.AuthorizeAgency = function (req, res, next) {
    if(req.User.roleId == 3){
        const users = new Users(global.app);
        const userId = req.User.userId;
        const roleId = req.User.roleId;
        const entityId = req.User.entityId;

        if(userId > 0){ // Has user Id
            users.get(userId).then(results => {
               if(results.length == 0) { // User Does not exist
                   res.sendStatus(401);
               }  else { //User exists
                   const hasRole = results[0].RoleId == roleId;
                   const entityMatches = results[0].EntityId == entityId;
                   if(hasRole && entityMatches){ //User belongs to role and Agency
                       next();
                   } else { // user does not belong to role and agency
                       res.sendStatus(401);
                   }
               }
            });
        } else { //user does not have id
            res.sendStatus(401);
        }
    } else { // user does not belong to agency
        res.sendStatus(401);
    }

};
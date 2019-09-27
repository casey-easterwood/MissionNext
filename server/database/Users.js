const { Query } = require('./Query');
const bcrypt = require('bcrypt');

module.exports.Users = function (app) {
    let users = this;
    let database = app.database;

    users.getAll = function () {
        let sql = 'SELECT UserId, UserLogin, FirstName, LastName, Email, Role FROM users_main ORDER BY UserLogin';
        let values = [];
        let query = new Query(sql, values);

        console.log("DB User");

        return new Promise((resolve) => {
            database.connect()

            .then((connection) => {
                return query.execute(connection);
            })

            .then(  (response) => {
                resolve(response.results);
            })
        })
    };

    /**
     * Returns promise containing sql table rows
     *
     *
     * @param userId
     * @returns {Promise<any>}
     */
    users.get = function (userId) {
        let sql = 'SELECT UserId, UserLogin, FirstName, LastName, Email, Role FROM users_main where UserId = ?';
        let values = [userId];
        let query = new Query(sql, values);

        return new Promise((resolve) => {
            database.connect()

            .then((connection) => {
                return query.execute(connection);
            })

            .then((response) => {
                resolve(response.results);
            })

            .catch((error) => {
                console.log(error);
            })
        })
    };

    users.userExists = function (userLogin) {
        let sql = 'SELECT UserId, UserLogin FROM users_main where UserLogin = ?';
        let values = [userLogin];
        let query = new Query(sql, values);

        return new Promise((resolve) => {
            database.connect()

                .then((connection) => {
                    return query.execute(connection);
                })

                .then((response) => {
                    resolve(response.results.length > 0);
                })

                .catch((error) => {
                    console.log(error);
                })
        })
    };

    users.createNew = function (data) {
        let sql = 'INSERT INTO users_main (%fields%) VALUES (%values%)';

        let values = [];
        let fields = [];
        let valueMarkers = [];
        let hasUserLogin = true;
        let hasUserPassword = true;

        data.forEach((field) => {
            let { name, value } = field;

            if(field.name.toLocaleLowerCase() == 'userlogin'){
                hasUserLogin = true;
            } else if(field.name.toLocaleLowerCase() == 'userpassword'){
                hasUserPassword = true;
                value = bcrypt.hashSync(field.value, 10);
            }

            fields.push(name);
            values.push(value);
            valueMarkers.push("?");
        });

        if(hasUserLogin == null || hasUserPassword == null) {
            throw("Could not createNew user. Missing required fields");
        }

        let fieldString = fields.join(",");
        let valuesString = valueMarkers.join(",");

        sql = sql.replace("%fields%", fieldString).replace("%values%", valuesString);

        let query = new Query(sql, values);

        return new Promise((resolve, reject) => {
            database.connect()
            .then((connection) => {
                resolve(query.execute(connection));
            }).catch((e) =>{
                reject(e);
            })
        })
    };

    users.resetPassword = function (userId, password) {
        let sql = 'UPDATE users_main set UserPassword = ? WHERE UserId =?';

        let values = [
            bcrypt.hashSync(password, 10),
            userId
        ];

        let query = new Query(sql, values);

        return new Promise((resolve, reject) => {
            database.connect()
                .then((connection) => {
                    resolve(query.execute(connection));
                }).catch((e) =>{
                reject(e);
            })
        })
    };

    users.update = function (userId, data) {
        let sql = 'UPDATE users_main set ';

        let values = [];

        data.forEach((field) => {
           if(values.length >0)
               sql += ",";
           sql += field.name + ' = ?';

           values.push(field.value);
        });

        values.push(userId);
        sql += ' WHERE UserId = ?';

        let query = new Query(sql, values);

        return new Promise((resolve, reject) => {
            database.connect()
            .then((connection) => {
                resolve(query.execute(connection));
            }).catch((e) =>{
                reject(e);
            })
        })
    };

    users.authenticate = function (userLogin, userPassword) {
        let sql = 'SELECT UserId, UserLogin, UserPassword FROM users_main where UserLogin = ?';
        let values = [userLogin];
        let query = new Query(sql, values);

        return new Promise((resolve) => {
            database.connect()

                .then((connection) => {
                    return query.execute(connection);
                })

                .then((response) => {
                    let exists = response.results.length > 0;

                    if(exists){
                        let passwordHashed = response.results[0].UserPassword;
                        let passwordVerified = bcrypt.compareSync(userPassword, passwordHashed);

                        if(passwordVerified)
                            resolve(response.results[0]);
                        else
                            resolve(false);
                    } else {
                        resolve(false);
                    }
                })

                .catch((error) => {
                    console.log(error);
                })
        })
    };

    users.delete = function (userId) {
        let sql = 'DELETE from users_main WHERE UserId = ?';
        let values = [userId];
        let query = new Query(sql, values);

        return new Promise((resolve, reject) => {
            database.connect()

            .then((connection) => {
                return query.execute(connection);
            })

            .then((response) => {
                resolve(response.results);
            })
        })
    };

    return users;
};
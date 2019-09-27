const mysql      = require('mysql');

module.exports.Database = function(config){
    let database = this;

    database.pool = mysql.createPool(config);

    database.connect = () => {
        return new Promise(database.getConnection);
    };

    /**
     *
     * @param connection
     * @param query as Query
     * @returns {*|Promise<any>}
     */
    database.query = function (connection, query){
        return query.execute(connection);
    };

    database.getConnection = function(resolve, reject){
        database.pool.getConnection((error, connection)=> {
            if(error)
                reject(error);
            else
                resolve(connection);
        });
    };

    return database;
};










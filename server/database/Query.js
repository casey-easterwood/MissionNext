module.exports.Query = function(sql, values) {
    let query = this;

    query.sql = sql;
    query.values = values;

    query.execute = function (connection) {
        return new Promise((resolve, reject) =>{
            connection.query(
                {
                    sql: query.sql,
                    values: query.values
                },
                (error, results, fields) => {
                    if (error) {
                        reject(error);
                        connection.release();
                    } else {
                        resolve({results: results, fields: fields});
                        connection.release();
                    }
                }
            );
        });
    };
};

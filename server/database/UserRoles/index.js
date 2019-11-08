const { Query } = require('../Query');

class UsersRoles {
    constructor(app){
        this.database = app.database;

        this.listAll = this.listAll.bind(this);
        this.get = this.get.bind(this);
        this.exists = this.exists.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    listAll(){
        let sql = 'SELECT * FROM users_roles ORDER BY RoleName';
        let values = [];
        let query = new Query(sql, values);

        return new Promise((resolve) => {
            this.database.connect()

            .then((connection) => {
                return query.execute(connection);
            })

            .then(  (response) => {
                resolve(response.results);
            })
        })
    }

    get(id) {
        let sql = 'SELECT * FROM users_roles where Id = ?';
        let values = [id];
        let query = new Query(sql, values);

        return new Promise((resolve) => {
            this.database.connect()

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

    exists(name) {
        let sql = 'SELECT Name FROM users_roles where Name = ?';
        let values = [name];
        let query = new Query(sql, values);

        return new Promise((resolve) => {
            this.database.connect()

                .then((connection) => {
                    return query.execute(connection);
                })

                .then((response) => {
                    console.log("results: " + JSON.stringify(response.results.length > 0));
                    resolve(response.results.length > 0);
                })

                .catch((error) => {
                    console.log(error);
                })
        })
    };

    create(data) {
        let sql = 'INSERT INTO users_roles (%fields%) VALUES (%values%)';

        let values = [];
        let fields = [];
        let valueMarkers = [];

        data.forEach((field) => {
            let { name, value } = field;

            fields.push(name);
            values.push(value);
            valueMarkers.push("?");
        });

        let fieldString = fields.join(",");
        let valuesString = valueMarkers.join(",");

        sql = sql.replace("%fields%", fieldString).replace("%values%", valuesString);

        let query = new Query(sql, values);

        return new Promise((resolve, reject) => {
            this.database.connect()
                .then((connection) => {
                    resolve(query.execute(connection));
                }).catch((e) =>{

                reject(e);
            })
        })
    };

    update(id, data) {
        let sql = 'UPDATE users_roles set ';

        let values = [];

        data.forEach((field) => {
            if(values.length >0)
                sql += ",";
            sql += field.name + ' = ?';

            values.push(field.value);
        });

        values.push(id);
        sql += ' WHERE Id = ?';

        let query = new Query(sql, values);

        return new Promise((resolve, reject) => {
            this.database.connect()
                .then((connection) => {
                    resolve(query.execute(connection));
                }).catch((e) =>{
                reject(e);
            })
        })
    };

    delete(id) {
        let sql = 'DELETE from users_roles WHERE Id = ?';
        let values = [id];
        let query = new Query(sql, values);

        return new Promise((resolve, reject) => {
            this.database.connect()

                .then((connection) => {
                    return query.execute(connection);
                })

                .then((response) => {
                    resolve(response.results);
                })
        })
    };

}

module.exports = UsersRoles;
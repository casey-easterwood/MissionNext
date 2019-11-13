const { Query } = require('../Query');

class SchoolsContext {
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
        let sql = 'SELECT * FROM Schools ORDER BY Name';
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
        let sql = 'SELECT * FROM Schools where Id = ?';
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
        let sql = 'SELECT Name FROM Schools where Name = ?';
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
        let sql = 'INSERT INTO Schools (%fields%) VALUES (%values%)';

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
        let sql = 'UPDATE Schools set ';

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
        let sql = 'DELETE from Schools WHERE Id = ?';
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

module.exports = SchoolsContext;
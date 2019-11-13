const { Query } = require('../Query');

class JobsContext {
    constructor(app){
        this.database = app.database;

        this.listAll = this.listAll.bind(this);
        this.listByCategory = this.listByCategory.bind(this);
        this.listByLocation = this.listByLocation.bind(this);
        this.getJobCategories = this.getJobCategories.bind(this);
        this.getJobLocations = this.getJobLocations.bind(this);
        this.get = this.get.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);

    }

    listAll(){
        let sql = 'SELECT Id, AgencyId, SchoolId, Name, Created, Updated FROM Jobs ORDER BY Name';

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

    listByAgency(agencyId){
        let sql = 'SELECT ' +
            'Jobs.Id As Id, ' +
            'Jobs.AgencyId As AgencyId, ' +
            'Jobs.Title As Title, ' +
            'Jobs.CategoryId As CategoryId, ' +
            'Jobs.Location As Location, ' +
            'Jobs.Status As Status, ' +
            'Jobs.Created As Created, ' +
            'JobCategories.Name as Category ' +
            'FROM Jobs left join JobCategories ' +
            'on (Jobs.CategoryId = JobCategories.Id) ' +
            'WHERE Jobs.AgencyId = ? ' +
            'ORDER BY Title ';

        let values = [agencyId];
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

    listByCategory(categoryId){
        let sql = 'SELECT ' +
            'Jobs.Id As Id, ' +
            'Jobs.AgencyId As AgencyId, ' +
            'Jobs.Title As Title, ' +
            'Jobs.CategoryId As CategoryId, ' +
            'Jobs.Location As Location, ' +
            'Jobs.Status As Status, ' +
            'Jobs.Created As Created, ' +
            'JobCategories.Name as Category ' +
            'FROM Jobs left join JobCategories ' +
            'on (Jobs.CategoryId = JobCategories.Id) ' +
            'ORDER BY Title ' +
            'WHERE Jobs.CategoryId = ?';

        let values = [categoryId];
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

    listByLocation(location){
        let sql = 'SELECT ' +
            'Jobs.Id As Id, ' +
            'Jobs.AgencyId As AgencyId, ' +
            'Jobs.Title As Title, ' +
            'Jobs.CategoryId As CategoryId, ' +
            'Jobs.Location As Location, ' +
            'Jobs.Status As Status, ' +
            'Jobs.Created As Created, ' +
            'JobCategories.Name as Category ' +
            'FROM Jobs left join JobCategories ' +
            'on (Jobs.CategoryId = JobCategories.Id) ' +
            'ORDER BY Title ' +
            'WHERE Jobs.Location = ?';

        let values = [location];
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

    getJobCategories(){
        let sql = 'SELECT ' +
            'Jobs.CategoryId as CategoryId, ' +
            'JobCategories.Name as Category, ' +
            'Count(*) as Count ' +
            'FROM Jobs left join JobCategories ' +
            'on (Jobs.CategoryId = JobCategories.Id) ' +
            'GROUP BY Jobs.CategoryId ORDER BY JobCategories.Name ';

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

    getJobLocations(){
        let sql = 'SELECT Location, Count(*) as Count FROM Jobs GROUP BY Location ORDER BY Location ';
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

    getJobAgencies(){
        let sql = 'SELECT ' +
            'Jobs.AgencyId as AgencyId, ' +
            'Schools.Name as Name, ' +
            'Count(*) as Count ' +
            'FROM Jobs left join Schools ' +
            'on (Jobs.AgencyId = Schools.Id) ' +
            'GROUP BY Jobs.AgencyId ORDER BY Schools.Name ';

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
        let sql = 'SELECT * FROM Jobs where Id = ?';
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

    create(data) {
        let sql = 'INSERT INTO Jobs (%fields%) VALUES (%values%)';

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
        let sql = 'UPDATE Jobs set ';

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
        let sql = 'DELETE from Jobs WHERE Id = ?';
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

    getProfileData(id) {
        let sql = 'SELECT JobId, ProfileData FROM Jobs_Profile where JobId = ?';
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

}

module.exports = JobsContext;
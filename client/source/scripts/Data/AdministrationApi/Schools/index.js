import Api from "../../Api";

class Schools extends Api{
    constructor() {
        super();
    }

    getList(credentials){
        return fetch("/api/schools/list",{
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Authentication' : this.getAuthHeader()
            },
        })
        .then(response => response.json())
    }

    update(data){
        return fetch("/api/schools/save",{
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authentication' : this.getAuthHeader()
            },
        })
        .then(response => response.json())
    }

    create(data){
        return fetch("/api/schools/createNew",{
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authentication' : this.getAuthHeader()
            },
        })
        .then(response => response.json())
    }

    exists(Name){
        return fetch("/api/schools/exists",{
            method: "POST",
            credentials: "include",
            body: JSON.stringify({Name:Name}),
            headers: {
                'Content-Type': 'application/json',
                'Authentication' : this.getAuthHeader()
            },
        })
        .then(response => response.json())
    }

    delete(id){
        return fetch("/api/schools/delete",{
            method: "POST",
            credentials: "include",
            body: JSON.stringify({id:id}),
            headers: {
                'Content-Type': 'application/json',
                'Authentication' : this.getAuthHeader()
            },
        })
            .then(response => response.json())
    }

    static getInstance(){
        return new Schools();
    }
}

export default Schools
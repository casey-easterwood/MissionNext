import Api from "../Api";

class Agency extends Api{
    constructor() {
        super();
    }

    get(){
        return fetch("/api/agency/get",{
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
        return fetch("/api/agency/save",{
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

    static getInstance(){
        return new Agency();
    }
}

export default Agency
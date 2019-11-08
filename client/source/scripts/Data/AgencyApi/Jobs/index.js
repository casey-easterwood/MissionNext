import Api from "../../Api";

class Index extends Api{
    constructor() {
        super();
    }

    getList(){
        return fetch("/api/agency/Jobs/list",{
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
        return fetch("/api/agency/Jobs/save",{
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
        return fetch("/api/agency/Jobs/createNew",{
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

    delete(id){
        return fetch("/api/agency/Jobs/delete",{
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

    getDescription(jobId){
        return fetch("/api/agency/Jobs/jobDescription/" + jobId,{
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Authentication' : this.getAuthHeader()
            },
        })
            .then(response => response.json())
    }

    createDescription(data){
        return fetch("/api/jobs/createDescription",{
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

    saveDescription(data){
        return fetch("/api/jobs/saveDescription",{
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
        return new Index();
    }
}

export default Index
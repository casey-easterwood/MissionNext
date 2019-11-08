import Api from "../../Api";

class ProfileQuestions extends Api{
    basePath = "/api/profile/questions/";

    constructor() {
        super();
    }

    getList(credentials){
        return fetch(this.basePath + "list",{
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
        return fetch(this.basePath + "save",{
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
        return fetch(this.basePath + "createNew",{
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
        return fetch(this.basePath + "delete",{
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
        return new ProfileQuestions();
    }
}

export default ProfileQuestions
import Api from "../../Api";

class ProfileQuestions extends Api{

    constructor() {
        super();
    }

    getList(credentials){
        return fetch("/api/agency/ProfileQuestions/list",{
            method: "GET",
            credentials: "include",
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
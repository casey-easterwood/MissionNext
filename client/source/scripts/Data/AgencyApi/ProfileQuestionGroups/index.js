import Api from "../../Api";

class ProfileQuestionGroups extends Api{
    basePath = "/api/agency/ProfileQuestionGroups/";

    constructor() {
        super();
    }

    getList(){
        return fetch("/api/agency/ProfileQuestionGroups/list",{
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
        return new ProfileQuestionGroups();
    }
}

export default ProfileQuestionGroups
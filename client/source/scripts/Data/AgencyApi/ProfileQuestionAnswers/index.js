import Api from "../../Api";

class ProfileQuestionGroups extends Api{
    basePath = "/api/profile/answers/";

    constructor() {
        super();
    }

    getList(){
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

    static getInstance(){
        return new ProfileQuestionGroups();
    }
}

export default ProfileQuestionGroups
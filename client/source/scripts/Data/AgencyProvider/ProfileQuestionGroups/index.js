import Repository from "../../Repository";
import Api from "../../AgencyApi/ProfileQuestionGroups";
import Model from "../../Models/ProfileQuestionGroup";

class ProfileQuestionGroups extends Repository {
    constructor(){
        super();

        this.Api = new Api();

        this.getAll = this.getAll.bind(this);
    }

    getAll(){
        if(this.rows.length == 0) {
            this.Api.getList()
                .then(results => {
                    for (let record of results) {
                        let user = new Model(record);
                        this.addRow(user);
                    }

                    this.publishChanges("PROFILE_QUESTION_GROUP_LOADED", this.rows);
                });
        } else {
            this.publishChanges("PROFILE_QUESTION_GROUP_LOADED", this.rows);
        }
    }
}

export default ProfileQuestionGroups;
import Repository from "../../Repository";
import Api from "../../AgencyApi/ProfileQuestions";
import Model from "../../Models/ProfileQuestion";
import ProfileQuestionGroup from "../../Models/ProfileQuestionGroup";

class ProfileQuestions extends Repository {
    constructor(){
        super();

        this.Api = new Api();

        this.getAll = this.getAll.bind(this);
        this.getByGroup = this.getByGroup.bind(this);
    }

    getAll(){
        if(this.rows.length == 0) {
            this.Api.getList()
                .then(results => {
                    for (let record of results) {
                        let user = new Model(record);
                        this.addRow(user);
                    }

                    this.publishChanges("QUESTIONS_LOADED", this.getRows());
                });
        } else {
            this.publishChanges("QUESTIONS_LOADED", this.getRows());
        }
    }

    getByGroup(id){
        let filtered = [];

        for(let r of this.rows){
            if(r.fields["GroupId"].getValue() == id){
                filtered.push(r);
            }
        }

        return filtered;
    }
}

export default ProfileQuestions;
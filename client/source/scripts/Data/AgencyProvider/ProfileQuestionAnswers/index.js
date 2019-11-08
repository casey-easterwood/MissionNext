import Repository from "../../Repository";
import Api from "../../AdministrationApi/ProfileQuestionAnswers";
import Model from "../../Models/ProfileQuestionAnswer";
import UserDataRow from "../../Models/UserDataRow";
import ProfileQuestionAnswer from "../../Models/ProfileQuestionAnswer";

class ProfileQuestionAnswers extends Repository {
    constructor(){
        super();

        this.Api = new Api();

        this.getAll = this.getAll.bind(this);
        this.getByQuestion = this.getByQuestion.bind(this);
    }

    getAll() {
        if (this.rows.length == 0) {
            this.Api.getList()
                .then(results => {
                    for (let record of results) {
                        let user = new Model(record);
                        this.addRow(user);
                    }
                    this.publishChanges("QUESTION_ANSWERS_LOADED", this.getRows());
                });
        } else {
            this.publishChanges("QUESTION_ANSWERS_LOADED", this.getRows());

        }
    }

    getByQuestion(id){
        let filtered = [];

        for(let r of this.rows){
            if(r.fields["QuestionId"].getValue() == id){
                filtered.push(r);
            }
        }

        return filtered;
    }

}

export default ProfileQuestionAnswers;
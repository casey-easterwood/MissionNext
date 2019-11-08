import Repository from "../Repository";
import Api from "../../Api/ProfileQuestionAnswers";
import Model from "../../Models/ProfileQuestionAnswer";
import UserDataRow from "../../Models/UserDataRow";
import ProfileQuestionAnswer from "../../Models/ProfileQuestionAnswer";

class ProfileQuestionAnswers extends Repository {
    constructor(){
        super();

        this.Api = new Api();

        this.getAll = this.getAll.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.onSaved = this.onSaved.bind(this);
        this.getByQuestion = this.getByQuestion.bind(this);
        this.create = this.create.bind(this);
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

    saveChanges(){
        for(let r of this.rows){
            if(r.isDirty()){
                let fieldData = r.getChanges();

                this.Api.update(fieldData)
                    .then((response) =>{
                        r.markClean();
                        this.onSaved(response);
                    });
            } else {
                this.publishChanges("PROFILE_QUESTION_ANSWER_SAVED", r);
            }
        }
    }

    onSaved(response) {
        if(response.status == 'error'){
            console.log(JSON.stringify(response));
        }

        //order matters publish before updating repo
        this.publishChanges("PROFILE_QUESTION_ANSWER_SAVED", response);
    }

    create(fieldData){
        this.Api.create(fieldData)
        .then((response) =>{
            const insertId = response.insertId;

            const newRowData = {
                Id: insertId,
                QuestionId: fieldData[1].value,
                Answer: fieldData[0].value
            };

            let newRow = new ProfileQuestionAnswer(newRowData);

            this.addRow(newRow);
            this.publishChanges("PROFILE_QUESTION_ANSWER_CREATED", response);
        });
    }
}

export default ProfileQuestionAnswers;
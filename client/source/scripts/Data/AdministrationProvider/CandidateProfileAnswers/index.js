import Repository from "../../Repository";
import CandidateProfileAnswersApi from "../../AdministrationApi/CandidateProfileAnswers";
import CandidateProfileAnswer from "../../Models/CandidateProfileAnswer";

class Event_Types {
    static ANSWERS_LOADED  = "ANSWERS_LOADED";
    static ANSWER_SAVED    = "ANSWER_SAVED";
    static ERROR           = "ERROR";
    static ANSWER_CREATED  = "ANSWER_CREATED";
    static ANSWER_DELETED  = "ANSWER_DELETED";
}

class CandidateProfileAnswers extends Repository {
    constructor(){
        super();

        this.Api = new CandidateProfileAnswersApi();

        this.getByCandidate        = this.getByCandidate.bind(this);
        this.saveChanges        = this.saveChanges.bind(this);
        this.createNew          = this.createNew.bind(this);
        this.onSaved            = this.onSaved.bind(this);
        this.onDeleted          = this.onDeleted.bind(this);
    }

    getByCandidate(candidateId){
        if(this.rows.length == 0) {
            this.Api.getByCandidate(candidateId)
                .then(results => {
                    for (let record of results) {
                        let item = new CandidateProfileAnswer(record);
                        this.addRow(item);
                    }
                    this.publishChanges(Event_Types.ANSWERS_LOADED, this.getRows());
                });
        } else {
            this.publishChanges(Event_Types.ANSWERS_LOADED, this.getRows());
        }
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
            }
        }
    }

    createNew(candidateProfileAnswer){
        let fieldData = candidateProfileAnswer.getFieldData();

        this.Api.create(fieldData)
        .then((response) =>{
            if(response.status == "success") {
                const insertId = response.insertId;

                candidateProfileAnswer.fields["Id"].setValue(insertId);

                this.addRow(candidateProfileAnswer);
                this.publishChanges(Event_Types.ANSWER_CREATED, insertId);
            }
        });
    }

    delete(userId){
        this.Api.delete(userId)
            .then((response) =>{
                this.onDeleted(response);
            });
    }

    onSaved(response) {
        if(response.status == 'error'){
            console.log("Error");
            console.log(JSON.stringify(response));

            this.publishChanges(Event_Types.ERROR, response);
        } else {
            //order matters publish after updating repo
            this.publishChanges(Event_Types.ANSWER_SAVED, response);
        }
    }

    onDeleted(response) {
        if(response.status == 'error'){
            console.log(response.error);
            this.publishChanges(Event_Types.ERROR, response);
        } else {
            const id = response.message;

            for (let i = 0; i < this.rows.length; i++) {
                let r = this.rows[i];

                if (r.fields["Id"].getValue() == userId) {
                    this.rows.splice(i, 1);
                }
            }

            //order matters publish before updating repo
            this.publishChanges(Event_Types.ANSWER_DELETED, response.message);
        }
    }
}

export default CandidateProfileAnswers;
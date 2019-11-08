import Repository from "../../Repository";
import Api from "../../AdministrationApi/ProfileQuestions";
import Model from "../../Models/ProfileQuestion";
import ProfileQuestionGroup from "../../Models/ProfileQuestionGroup";

class ProfileQuestions extends Repository {
    constructor(){
        super();

        this.Api = new Api();

        this.getAll = this.getAll.bind(this);
        this.getByGroup = this.getByGroup.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.onSaved = this.onSaved.bind(this);
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
                this.publishChanges("PROFILE_QUESTION_SAVED", null);
            }
        }
    }

    onSaved(response) {
        if(response.status == 'error'){
            console.log(JSON.stringify(response));
        }

        //order matters publish before updating repo
        this.publishChanges("PROFILE_QUESTION_SAVED", response);
    }


    create(fieldData){

        this.Api.create(fieldData)
        .then((response) =>{
            if(response.status == "success"){
                const insertId = response.insertId;

                const newItemData = {
                    Id: insertId,
                    GroupId:fieldData[1].value,
                    Question:fieldData[0].value,
                };

                let newRow = new Model(newItemData);

                window.dataProvider.ProfileQuestions.addRow(newRow);
            }

            this.publishChanges("PROFILE_QUESTION_CREATED", response);
        });
    }
}

export default ProfileQuestions;
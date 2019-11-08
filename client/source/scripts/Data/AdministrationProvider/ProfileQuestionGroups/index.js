import Repository from "../Repository";
import Api from "../../Api/ProfileQuestionGroups";
import Model from "../../Models/ProfileQuestionGroup";

class ProfileQuestionGroups extends Repository {
    constructor(){
        super();

        this.Api = new Api();

        this.getAll = this.getAll.bind(this);
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

                    this.publishChanges("PROFILE_QUESTION_GROUP_LOADED", this.rows);
                });
        } else {
            this.publishChanges("PROFILE_QUESTION_GROUP_LOADED", this.rows);
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

    onSaved(response) {
        if(response.status == 'error'){
            console.log(JSON.stringify(response));
        }

        //order matters publish before updating repo
        this.publishChanges("PROFILE_QUESTION_GROUP_SAVED", response);
    }


    create(fieldData){
        this.Api.create(fieldData)
        .then((response) =>{
            if(response.status == "success"){
                const insertId = response.insertId;

                const newItemData = {
                    Id: insertId,
                    Name:fieldData[0].value,
                };

                let newRow = new Model(newItemData);

                window.dataProvider.ProfileQuestionGroups.addRow(newRow);
            }

            this.publishChanges("PROFILE_QUESTION_GROUP_CREATED", response);
        });
    }
}

export default ProfileQuestionGroups;
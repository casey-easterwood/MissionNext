import Repository from "../../Repository";
import SchoolsApi from "../../AdministrationApi/Schools";
import SchoolDataRow from "../../Models/SchoolDataRow";

class Schools extends Repository {
    constructor(){
        super();

        this.Api = new SchoolsApi();

        this.getAll = this.getAll.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.onSaved = this.onSaved.bind(this);
    }

    getAll(){
        if(this.rows.length == 0) {
            this.Api.getList()
                .then(results => {
                    for (let record of results) {
                        let user = new SchoolDataRow(record);
                        this.addRow(user);
                    }

                    this.publishChanges("SCHOOLS_LOADED", this.rows);
                });

        } else {
            this.publishChanges("SCHOOLS_LOADED", this.rows);
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
            if(response.message =='ER_DUP_ENTRY') {
                let field = user.getField("Name");
                field.isValid = false;
                field.message = 'School already exists';
            } else {
                console.log(JSON.stringify(response));
            }
        }

        //order matters publish before updating repo
        this.publishChanges("SCHOOL_SAVED", response);
    }

    checkAgencyExists(agencyName){
        this.Api.exists(agencyName)

        .then((response) =>{
            this.publishChanges("SCHOOL_EXISTS", response);
        });
    }

    create(fieldData){
        this.Api.create(fieldData)
        .then((response) =>{
            this.publishChanges("SCHOOL_CREATED", response);
        });
    }
}

export default Schools;
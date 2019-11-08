import Repository from "../Repository";
import AgencyApi from "../../Api/Agency";
import AgencyDataRow from "../../Models/AgencyDataRow";

class Agency extends Repository {
    constructor(){
        super();

        this.Api = new AgencyApi();

        this.get = this.get.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.onSaved = this.onSaved.bind(this);
    }

    get(){
        if(this.rows.length == 0) {
            this.Api.get()
                .then(results => {
                    let agency = new AgencyDataRow(results[0]);

                    this.addRow(agency);
                    this.publishChanges("AGENCY_LOADED", agency);
                });

        } else {
            this.publishChanges("AGENCY_LOADED", this.rows[0]);
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
                field.message = 'Agency already exists';
            } else {
                console.log(JSON.stringify(response));
            }
        }

        //order matters publish before updating repo
        this.publishChanges("AGENCY_SAVED", response);
    }
}

export default Agency;
import Repository from "../../Repository";
import AgenciesApi from "../../AdministrationApi/Agencies";
import AgencyDataRow from "../../Models/AgencyDataRow";
import CandidateDataRow from "../../Models/CandidateDataRow";

class Agencies extends Repository {
    constructor(){
        super();

        this.Api = new AgenciesApi();

        this.getAll = this.getAll.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.getProfileData = this.getProfileData.bind(this);
        this.onSaved = this.onSaved.bind(this);
    }

    getAll(){
        if(this.rows.length == 0) {
            this.Api.getList()
                .then(results => {
                    for (let record of results) {
                        let user = new AgencyDataRow(record);
                        this.addRow(user);
                    }

                    this.publishChanges("AGENCIES_LOADED", this.rows);
                });

        } else {
            this.publishChanges("AGENCIES_LOADED", this.rows);
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

    checkAgencyExists(agencyName){
        this.Api.exists(agencyName)

        .then((response) =>{
            this.publishChanges("AGENCY_EXISTS", response);
        });
    }

    create(fieldData){
        this.Api.create(fieldData)
        .then((response) =>{
            this.publishChanges("AGENCY_CREATED", response);
        });
    }

    getProfileData(agencyId){
        this.Api.getProfileData(agencyId)
            .then(results => {
                let profileData = null;

                for (let record of results) {
                    profileData = JSON.parse(record["ProfileData"]);
                }

                if(profileData)
                    this.publishChanges("AGENCY_PROFILE_LOADED", profileData);
                else
                    this.publishChanges("AGENCY_PROFILE_LOADED", null);
            });
    }
}

export default Agencies;
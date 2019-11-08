import Repository from "../../Repository";
import CandidatesApi from "../../AdministrationApi/Candidates";
import CandidateDataRow from "../../Models/CandidateDataRow";

class Candidates extends Repository {


    constructor(){
        super();

        this.Api = new CandidatesApi();

        this.getAll = this.getAll.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.onSaved = this.onSaved.bind(this);
    }

    getAll(){
        if(this.rows.length == 0) {
            this.Api.getList()
                .then(results => {
                    for (let record of results) {
                        let user = new CandidateDataRow(record);
                        this.addRow(user);
                    }

                    this.publishChanges("CANDIDATES_LOADED", results);
                });
        } else {
            this.publishChanges("CANDIDATES_LOADED", null);
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
                field.message = 'Candidate already exists';
            } else {

            }
        }

        //order matters publish before updating repo
        this.publishChanges("CANDIDATE_SAVED", response);
    }

    checkCandidateExists(name){
        this.Api.exists(name)

        .then((response) =>{
            this.publishChanges("CANDIDATE_EXISTS", response);
        });
    }

    create(fieldData){
        this.Api.create(fieldData)
        .then((response) =>{
            this.publishChanges("CANDIDATE_CREATED", response);
        });
    }
}

export default Candidates;
import Repository from "../../Provider/Repository";
import AgencyJobsApi from "../../Api/AgencyJobs";
import JobsDataRow from "../../Models/JobsDataRow";
import JobDescription from "../../Models/JobDescription";
// import JobDescription from "../../Models/JobDescription";

class Jobs extends Repository {
    locations = [];
    categories = [];
    agencies = [];
    
    constructor(){
        super();

        this.Api = new AgencyJobsApi();

        this.getAll = this.getAll.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.onSaved = this.onSaved.bind(this);
    }

    getAll(){
        this.rows = [];
        
        this.Api.getList()
        .then(results => {
            for (let record of results) {
                let user = new JobsDataRow(record);
                this.addRow(user);
            }
            this.publishChanges("JOBS_LOADED", results);
        });
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
                field.message = 'Job already exists';
            } else {

            }
        }

        //order matters publishChanges before updating repo
        this.publishChanges("JOB_SAVED", response);
    }

    create(jobRow){
        let fieldData = jobRow.getFieldData();

        this.Api.create(fieldData)
        .then((response) =>{
            const insertId = response.insertId;

            jobRow.fields["Id"].setValue(insertId);
            jobRow.markClean();

            window.dataProvider.jobs.addRow(jobRow);

            this.publishChanges("JOB_CREATED", insertId);
        });
    }

    getDescription(JobId){
        this.Api.getDescription(JobId)
            .then(results => {
                let records = [];

                for (let record of results) {
                    let jobDescription = new JobDescription(record);
                    records.push(jobDescription);
                }

                if(records[0])
                    this.publishChanges("JOB_DESCRIPTION_LOADED", records[0]);
                else
                    this.publishChanges("JOB_DESCRIPTION_LOADED", null);
            });
    }

}

export default Jobs;
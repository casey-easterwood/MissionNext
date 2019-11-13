import Repository from "../../Repository";
import JobsApi from "../../AdministrationApi/Jobs";
import JobsDataRow from "../../Models/JobsDataRow";
import JobDescription from "../../Models/JobDescription";

class Jobs extends Repository {
    locations = [];
    categories = [];
    agencies = [];
    
    constructor(){
        super();

        this.Api = new JobsApi();

        this.getAll = this.getAll.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.onSaved = this.onSaved.bind(this);
        this.getProfileData = this.getProfileData.bind(this);
    }

    getAll(){
        this.rows = [];
        
        this.Api.getList()
        .then(results => {
            for (let record of results) {
                let user = new JobsDataRow(record);
                this.addRow(user);
            }
            this.publishChanges("JOBS_LOADED", this.rows);
        });
    }

    getByAgency(agencyId){
        let jobs =[];

        for(let job of this.rows){
            if(job.fields["AgencyId"].getValue() == agencyId){
                jobs.push(job);
            }
        }

        return jobs;
    }

    getBySchool(schoolId){
        let jobs =[];

        for(let job of this.rows){
            if(job.fields["SchoolId"].getValue() == schoolId){
                jobs.push(job);
            }
        }

        return jobs;
    }

    getByCategory(category){
        this.rows = [];

        this.Api.getListByCategories(category)
            .then(results => {
                for (let record of results) {
                    let user = new JobsDataRow(record);
                    this.addRow(user);
                }
                this.publishChanges("JOBS_LOADED", results);
            });
    }

    getByLocation(location){
        this.rows = [];

        this.Api.getListByLocation(location)
            .then(results => {
                for (let record of results) {
                    let user = new JobsDataRow(record);
                    this.addRow(user);
                }

                this.publishChanges("JOBS_LOADED", results);
            });
    }

    getLocations(){
        this.Api.getLocations()
            .then(results => {
                this.locations = [];

                for (let record of results) {
                    this.locations.push({Name:record["Location"], Count:record["Count"]})
                }

                this.publishChanges("LOCATIONS_LOADED", results);
            });
    }

    getCategories(){
        this.Api.getCategories()
            .then(results => {
                this.categories = [];

                for (let record of results) {
                    this.categories.push({Name:record["Category"], Count:record["Count"]})
                }

                this.publishChanges("CATEGORIES_LOADED", results);
            });
    }

    getAgencies(){
        this.Api.getAgencies()
            .then(results => {
                this.agencies = [];

                for (let record of results) {
                    this.agencies.push({Id:record["AgencyId"], Name:record["Name"], Count:record["Count"]})
                }

                this.publishChanges("AGENCIES_LOADED", results);
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

    getProfileData(JobId){
        this.Api.getProfileData(JobId)
            .then(results => {
                let profileData = null;

                for (let record of results) {
                    profileData = JSON.parse(record["ProfileData"]);
                }

                if(profileData)
                    this.publishChanges("JOB_PROFILE_LOADED", profileData);
                else
                    this.publishChanges("JOB_PROFILE_LOADED", null);
            });
    }

    createDescription(jobId, description){
        let fieldData = [
            {name:"JobId", value:jobId},
            {name:"Description", value:description}
        ];

        this.Api.createDescription(fieldData)
            .then((response) =>{
                const insertId = response.insertId;

                this.publishChanges("JOB_DESCRIPTION_CREATED", insertId);
            });
    }

    saveDescription(jobId, description){
        let fieldData = [
            {name:"JobId", value:jobId},
            {name:"Description", value:description}
        ];

        this.Api.saveDescription(fieldData)
            .then((response) =>{
                this.publishChanges("JOB_DESCRIPTION_SAVED", response);
            });
    }
}

export default Jobs;
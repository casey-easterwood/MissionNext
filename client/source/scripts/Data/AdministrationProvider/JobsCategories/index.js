import Repository from "../../Repository";
import JobsApi from "../../AdministrationApi/Jobs";
import JobCategory from "../../Models/JobCategory";

class JobCategories extends Repository {
    constructor(){
        super();

        this.Api = new JobsApi();

        this.getAll = this.getAll.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.onSaved = this.onSaved.bind(this);
    }

    getAll(){
        this.rows = [];
        
        this.Api.getAllCategories()
        .then(results => {
            for (let record of results) {
                let item = new JobCategory(record);
                this.addRow(item);
            }
            this.publishChanges("JOB_CATEGORIES_LOADED", results);
        });
    }

    saveChanges(){
        for(let r of this.rows){
            if(r.isDirty()){
                let fieldData = r.getChanges();

                this.Api.updateCategory(fieldData)
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
                field.message = 'Job category already exists';
            } else {

            }
        }

        //order matters publishChanges before updating repo
        this.publishChanges("JOB_CATEGORY_SAVED", response);
    }

    create(fieldData){
        this.Api.createCategory(fieldData)
        .then((response) =>{
            if(response.status == "success"){
                let newItemData = {
                    Id:response.insertId,
                    Name:fieldData[0].value
                }

                let newRow = new JobCategory(newItemData);

                this.rows.push(newRow);

                this.publishChanges("JOB_CATEGORY_CREATED", response);
            }
        });
    }
}

export default JobCategories;
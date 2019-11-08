import Repository from "../../Provider/Repository";
import JobsApi from "../../Api/Jobs";
import JobCategory from "../../Models/JobCategory";

class JobCategories extends Repository {
    constructor(){
        super();

        this.Api = new JobsApi();

        this.getAll = this.getAll.bind(this);
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
}

export default JobCategories;
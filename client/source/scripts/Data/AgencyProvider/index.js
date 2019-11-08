import Agency from "../Agency";
import AgencyJobs from "../../AgencyProvider/AgencyJobs";
import JobCategories from "../AgencyJobsCategories";
import ProfileQuestionGroups from "../AgencyProfileQuestionGroups";

class AgencyProvider {
    agency = new Agency();
    jobs = new AgencyJobs();
    JobCategories = new JobCategories();
    profileQuestionGroups = new ProfileQuestionGroups();

    constructor(){

    }
}

export default AgencyProvider;
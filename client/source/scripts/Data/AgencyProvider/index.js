import Agency from "../AdministrationProvider/Agency";
import AgencyJobs from "./Jobs";
import JobCategories from "./JobsCategories";
import ProfileQuestionGroups from "./ProfileQuestionGroups";
import ProfileQuestions from "./ProfileQuestions";
import ProfileQuestionAnswers from "./ProfileQuestionAnswers";

class AgencyProvider {
    agency = new Agency();
    jobs = new AgencyJobs();
    JobCategories = new JobCategories();
    profileQuestionGroups = new ProfileQuestionGroups();
    profileQuestionAnswers = new ProfileQuestionAnswers();
    profileQuestions = new ProfileQuestions();

    constructor(){

    }
}

export default AgencyProvider;
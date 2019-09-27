import Users from "./Users";
import Agencies from "./Agencies";
import Candidates from "./Candidates";
import Jobs from "./Jobs";
import JobCategories from "./JobsCategories";
import ProfileQuestionGroups from "./ProfileQuestionGroups";
import ProfileQuestions from "./ProfileQuestions";
import ProfileQuestionAnswers from "./ProfileQuestionAnswers";


class Provider {
    users = new Users();
    agencies = new Agencies();
    candidates = new Candidates();
    jobs = new Jobs();
    ProfileQuestionGroups = new ProfileQuestionGroups();
    ProfileQuestions = new ProfileQuestions();
    ProfileQuestionsAnswers = new ProfileQuestionAnswers();
    JobCategories = new JobCategories();

    constructor(){

    }
}

export default Provider;
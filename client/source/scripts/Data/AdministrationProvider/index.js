import Users from "./Users";
import Agencies from "./Agencies";
import Schools from "./Schools";
import Candidates from "./Candidates";
import Jobs from "./Jobs";
import JobCategories from "./JobsCategories";
import ProfileQuestionGroups from "./ProfileQuestionGroups";
import ProfileQuestions from "./ProfileQuestions";
import ProfileQuestionAnswers from "./ProfileQuestionAnswers";
import UsersRoles from "./UsersRoles";

class Provider {
    users = new Users();
    agencies = new Agencies();
    schools = new Schools();
    candidates = new Candidates();
    jobs = new Jobs();
    ProfileQuestionGroups = new ProfileQuestionGroups();
    ProfileQuestions = new ProfileQuestions();
    ProfileQuestionsAnswers = new ProfileQuestionAnswers();
    JobCategories = new JobCategories();
    usersRoles = new UsersRoles();

    constructor(){

    }
}

export default Provider;
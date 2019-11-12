import React, {Component, createContext, Fragment} from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from "react-router";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

//controllers
import Home from "./components/Views/Administration/Home";
import Users from "./components/Views/Administration/Users";
import User from "./components/Views/Administration/User";
import Agencies from "./components/Views/Administration/Agencies";
import Agency from "./components/Views/Administration/Agency";
import Candidates from "./components/Views/Administration/Candidates";
import Candidate from "./components/Views/Administration/Candidate"
import Job from "./components/Views/Administration/Job";
import Jobs from "./components/Views/Administration/Jobs";
import ProfileQuestionGroups from "./components/Views/Administration/ProfileQuestionGroups";
import ProfileQuestionGroup from "./components/Views/Administration/ProfileQuestionGroup";
import GroupQuestions from "./components/Views/Administration/GroupQuestions"
import GroupQuestion from "./components/Views/Administration/GroupQuestion"
import QuestionAnswers from "./components/Views/Administration/QuestionAnswers";
import QuestionAnswer from "./components/Views/Administration/QuestionAnswer";
import JobCategories from "./components/Views/Administration/JobCategories";
import JobCategory from "./components/Views/Administration/JobCategory";
import SystemAdministration from "./components/Views/Administration/SystemAdministration"
import Layout from "./components/Views/Administration/Layout";
import Menu from "./components/Views/Administration/Menu";
import Footer from "./components/Elements/Layout/Footer";
import Provider from "./Data/AdministrationProvider";

class Administration extends Component{
    routeBase = "/administration";
    
    constructor(props){
        super(props);

        window.dataProvider = new Provider();

        this.getAuth = this.getAuth.bind(this);
    }

    getAuth() {
        let auth = {
            Authenticated:false,
            Token: '',
            User: 'anonymous'
        };

        //check to see if user is already authorized
        //If so update state with authentication
        const sessionAuthExists = sessionStorage.getItem("auth");

        if(sessionAuthExists)auth = JSON.parse(sessionAuthExists);

        return auth;
    }

    render() {
        const auth = this.getAuth();

        const PrivateRoute = ({ component: Component, auth: auth, ...rest }) => (
            <Route {...rest} render={
                (props) => (
                auth.Authenticated === true
                    ? <Component auth={auth} {...props} />
                    : <Redirect to='/' />
            )} />
        );

        return (
            <Layout auth={auth}>
                {auth.Authenticated &&
                    <Menu />
                }

                <Switch>
                    <Route exact path={`${this.routeBase}/home`}                    component={Home}/>
                    <Route exact path={`${this.routeBase}/system/users`}            component={Users}/>
                    <Route       path={`${this.routeBase}/system/user`}             component={User}/>
                    <Route exact path={`${this.routeBase}/agencies`}                component={Agencies}/>
                    <Route       path={`${this.routeBase}/agency`}                  component={Agency}/>
                    <Route exact path={`${this.routeBase}/candidates`}              component={Candidates}/>
                    <Route       path={`${this.routeBase}/candidate`}               component={Candidate}/>
                    <Route       path={`${this.routeBase}/jobs` }                   component={Jobs}/>
                    <Route       path={`${this.routeBase}/job`}                     component={Job}/>
                    <Route exact path={`${this.routeBase}/profilequestiongroups`}   component={ProfileQuestionGroups}/>
                    <Route       path={`${this.routeBase}/profilequestiongroup` }   component={ProfileQuestionGroup}/>
                    <Route exact path={`${this.routeBase}/groupquestions/:id` }     component={GroupQuestions}/>
                    <Route       path={`${this.routeBase}/groupquestion`}           component={GroupQuestion}/>
                    <Route       path={`${this.routeBase}/questionanswers/:groupId/:questionId`}    component={QuestionAnswers}/>
                    <Route       path={`${this.routeBase}/questionanswer`}          component={QuestionAnswer}/>
                    <Route exact path={`${this.routeBase}/system` }                 component={SystemAdministration}/>
                    <Route exact path={`${this.routeBase}/jobcategories`}           component={JobCategories}/>
                    <Route       path={`${this.routeBase}/jobcategory` }            component={JobCategory}/>
                </Switch>

                {auth.Authenticated &&
                    <Footer>
                        <span>Powered by MissionNext</span>
                        <a href="https://newmissionnext.wpengine.com/" target="_blank">missionnext.org</a>
                    </Footer>
                }
            </Layout>

        );
    }
}

export default Administration
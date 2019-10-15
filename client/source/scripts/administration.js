import React, {Component, createContext} from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from "react-router";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

import styles from '../styles/main.scss';
//controllers
import Login from './components/Views/Login';
import Home from "./components/Views/Home";
import Users from "./components/Views/Users";
import User from "./components/Views/User";
import Agencies from "./components/Views/Agencies";
import Agency from "./components/Views/Agency";
import Candidates from "./components/Views/Candidates";
import Candidate from "./components/Views/Candidate"
import Job from "./components/Views/Job";
import Jobs from "./components/Views/Jobs";
import Administration from "./components/Views/Administration";
import ProfileQuestionGroups from "./components/Views/ProfileQuestionGroups";
import ProfileQuestionGroup from "./components/Views/ProfileQuestionGroup";
import GroupQuestions from "./components/Views/GroupQuestions"
import GroupQuestion from "./components/Views/GroupQuestion"
import QuestionAnswers from "./components/Views/QuestionAnswers";
import QuestionAnswer from "./components/Views/QuestionAnswer";
import JobCategories from "./components/Views/JobCategories";
import JobCategory from "./components/Views/JobCategory";

import Authentication from "./Data/Api/Authentication";
import Layout from "./components/Views/Layout";
import Main from "./components/Elements/Layout/Main"

import Provider from "./Data/Provider";
import Header from "./components/Elements/Menu";
import Footer from "./components/Elements/Layout/Footer";


window.dataProvider = new Provider();

class App extends Component{
    constructor(props){
        super(props);
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
            <Router>
                <Switch>

                    <PrivateRoute exact path="/home"                    auth={auth} component={Home}  />
                    <PrivateRoute exact path="/administration/users"    auth={auth} component={Users}/>
                    <PrivateRoute       path="/user"                    auth={auth} component={User}/>
                    <PrivateRoute exact path="/agencies"                auth={auth} component={Agencies}/>
                    <PrivateRoute       path="/agency"                  auth={auth} component={Agency}/>
                    <PrivateRoute exact path="/candidates"              auth={auth} component={Candidates}/>
                    <PrivateRoute       path="/candidate"               auth={auth} component={Candidate}/>
                    <PrivateRoute       path="/jobs"                    auth={auth} component={Jobs}/>
                    <PrivateRoute       path="/job"                     auth={auth} component={Job}/>
                    <PrivateRoute exact path="/profilequestiongroups"   auth={auth} component={ProfileQuestionGroups}/>
                    <PrivateRoute       path="/profilequestiongroup"    auth={auth} component={ProfileQuestionGroup}/>
                    <PrivateRoute exact path="/groupquestions/:id"      auth={auth} component={GroupQuestions}/>
                    <PrivateRoute       path="/groupquestion"           auth={auth} component={GroupQuestion}/>
                    <PrivateRoute       path="/questionanswers/:groupId/:questionId"    auth={auth} component={QuestionAnswers}/>
                    <PrivateRoute       path="/questionanswer"          auth={auth} component={QuestionAnswer}/>
                    <PrivateRoute exact path="/administration"          auth={auth} component={Administration}/>
                    <PrivateRoute exact path="/administration/jobcategories"            auth={auth} component={JobCategories}/>
                    <PrivateRoute       path="/jobcategory"             auth={auth} component={JobCategory}/>
                </Switch>
            </Router>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
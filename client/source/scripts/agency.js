import React, {Component, createContext, Fragment} from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from "react-router";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Layout from "./components/Views/Agency/Layout";
import Home from "./components/Views/Agency/Home";
import Job from "./components/Views/Agency/Job";
import Jobs from "./components/Views/Agency/Jobs"
import Menu from "./components/Views/Agency/Menu";
import Footer from "./components/Elements/Layout/Footer";
import AgencyProvider from "./Data/AgencyProvider";

class Agency extends Component{
    routeBase = "/agency";
    
    constructor(props){
        super(props);

        window.dataProvider = new AgencyProvider();

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
                    <Route exact path={`${this.routeBase}/home`}    component={Home}  />
                    <Route exact path={`${this.routeBase}/jobs`}    component={Jobs}  />
                    <Route       path={`${this.routeBase}/job`}     component={Job}/>
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

export default Agency
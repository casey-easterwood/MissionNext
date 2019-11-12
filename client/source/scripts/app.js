import React, {Component, createContext} from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from "react-router";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Login from './components/Views/Login';
import Administration from "./administration";
import Agency from "./agency";
import Authentication from "./Data/AdministrationApi/Authentication";
import Provider from "./Data/AdministrationProvider";
import styles from '../styles/main.scss';

class App extends Component{
    constructor(props){
        super(props);

        const auth = this.getAuth();

        this.state = {
            auth : auth,
            loginMessage: ""
        };

        this.authenticate = this.authenticate.bind(this);
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

    authenticate = (credentials) => {
        Authentication.getInstance().verify(credentials)
            .then((authenticated) => {
                if (authenticated.status === true) {
                    const auth = {
                        Authenticated: authenticated.status,
                        Token: authenticated.token,
                        User: authenticated.User,
                        RoleId: authenticated.User.roleId,
                        RoleName: authenticated.User.roleName,
                        EntityId: authenticated.User.entityId,
                        EntityName: authenticated.User.entityName
                    };

                    //store authentication in session
                    sessionStorage.setItem("auth", JSON.stringify(auth));

                    //update current authentication information
                    this.setState({auth:auth});
                } else {
                    this.setState({loginMessage:"Login failed."})
                }
            })
    };

    render() {
        const auth = this.getAuth();

        const PrivateRoute = ({ component: Component, auth: auth, roleId:roleId, ...rest }) => (
            <Route {...rest} render = {
                (props) => {
                    if(auth.Authenticated === true && roleId === auth.RoleId){
                        return <Component auth={auth} {...props} />
                    } else {
                        return <Redirect to='/'/>
                    }
            }} />
        );

        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Login auth={auth} authenticate={this.authenticate}
                               loginMessage={this.state.loginMessage} />
                    </Route>
                    <PrivateRoute path="/administration" auth={auth} roleId={1} component={Administration}  />
                    <PrivateRoute path="/agency" auth={auth} roleId={3} component={Agency}  />
                </Switch>
            </Router>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
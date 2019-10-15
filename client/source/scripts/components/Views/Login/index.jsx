/**
 * @var auth
 */

import React, {Component} from 'react';
import {Redirect} from "react-router";
import ReactDOM from 'react-dom';

import LoginForm from './LoginForm';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: ''
        };
    };

    render(){
        if (this.props.auth.Authenticated) {
            if(this.props.auth.RoleId == '1')
                return <Redirect to="/administration/home" />;
            else if(this.props.auth.RoleId == '2')
                return <Redirect to="/administration/home" />;
            else if(this.props.auth.RoleId == '3')
                return <Redirect to="/administration/home" />;

        } else {
            return(<LoginForm authenticate={this.props.authenticate} message={this.props.loginMessage} />);
        }
    }
}

export default Login
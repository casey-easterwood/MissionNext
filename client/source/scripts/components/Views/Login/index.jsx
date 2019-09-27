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
            return <Redirect to="/home" />;
        } else {
            return(<LoginForm authenticate={this.props.authenticate} message={this.props.loginMessage} />);
        }
    }
}

export default Login
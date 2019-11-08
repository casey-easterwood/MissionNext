import React, {Component} from 'react';
import LinkButton from '../../../../Elements/LinkButton';
import Form from '../../../../Elements/Form';
import FormGroup from '../../../../Elements/FormGroup';
import styles  from './styles.scss';

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = { userLogin : '', userPassword : ''};

        this.submitLogin = this.submitLogin.bind(this);
        this.handleLoginChanged = this.handleLoginChanged.bind(this);
        this.handlePasswordChanged = this.handlePasswordChanged.bind(this);
    }

    submitLogin(){
        this.props.authenticate({
            userLogin: this.state.userLogin,
            userPassword: this.state.userPassword
        });
    };

    handleLoginChanged (e){
        this.setState({userLogin: e.target.value});
    };

    handlePasswordChanged(e){
        this.setState({userPassword: e.target.value});
    };

    render(){
        const message = <span className={styles.loginMessage}>{this.props.message || ''}</span>;

        return(
            <div className={styles.loginComponent}>
                <Form title="Sign In" save={this.submitLogin}>

                    <FormGroup
                        id="userLogin"
                        label="Username"
                        value={this.state.userLogin}
                        onChange={this.handleLoginChanged}
                    />

                    <FormGroup
                        id="userPassword"
                        label="Password"
                        type={"password"}
                        value={this.state.userPassword}
                        onChange={this.handlePasswordChanged}
                    />
                </Form>
                {message}
                <LinkButton href="#" onClick={this.submitLogin} caption="Sign In"/>

            </div>
        )
    }
}

export default LoginForm
/**
 * @var user
 */

import React, {Component} from 'react';
import LinkButton from '../../../Elements/LinkButton';
import Form from '../../../Elements/Form';
import FormGroup from '../../../Elements/FormGroup';
import styles  from './styles.scss';
import DataField from "../../../../Data/Models/DataField";
import ModalConfirm from "../../../Elements/ModalConfirm";

class Create extends Component {
    dataProvider = window.dataProvider.users;

    constructor(props) {
        super(props);

        this.getTitle = this.getTitle.bind(this);
        this.checkUsernameAvailability = this.checkUsernameAvailability.bind(this);
        this.renderUserLogin = this.renderUserLogin.bind(this);
        this.renderUserPassword = this.renderUserPassword.bind(this);
        this.renderUserEmail = this.renderUserEmail.bind(this);
        this.usersProviderHandler = this.usersProviderHandler.bind(this);
        this.onUserExists = this.onUserExists.bind(this);
        this.verifyPassword = this.verifyPassword.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
        this.createUser = this.createUser.bind(this);
        this.savedDialog = this.savedDialog.bind(this);

        this.state = {
            insertId:0,
            showSavedDialog: false,
            mode: "USERLOGIN",
            UserLogin: new DataField("UserLogin", "string", '', false),
            UserPassword: new DataField("UserPassword", "string", '', false),
            UserPasswordConfirm: new DataField("UserPasswordConfirm", "string", '', false),
            Email: new DataField("Email", "string", '', false),
            EmailConfirm: new DataField("EmailConfirm", "string", '', false),
        }
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.usersProviderHandler);
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.usersProviderHandler);
    }

    getTitle(){
        const { user } = this.props;

        return 'Create New User';
    }

    usersProviderHandler(event, data){
        if(event == "USER_EXISTS")
            this.onUserExists(data);
        else if(event == "USER_CREATED")
            this.setState({insertId:data, showSavedDialog: true});
    }

    onUserExists(data){
        if(data.exists){
            this.state.UserLogin.setValidationMessage("User already exists");
        } else {
            this.state.UserLogin.setValidationMessage("");
            this.state.mode = "USERPASSWORD";
        }

        this.setState({UserLogin:this.state.UserLogin, mode:this.state.mode});
    }

    createUser(){
        let userData = {
            UserLogin: this.state.UserLogin.getValue(),
            UserPassword: this.state.UserPassword.getValue(),
            Email: this.state.Email.getValue(),
        };

        this.dataProvider.createNew(userData);
    }

    fieldChange(fieldName, value){
        let field = this.state[fieldName];
        field.setValue(value);

        this.setState(this.state);
    }

    checkUsernameAvailability(){
        let userLogin = this.state["UserLogin"];


        if(userLogin.getValue().length < 5){
            userLogin.setValidationMessage("Requires minimum of 5 chars");
        } else {
            this.dataProvider.checkUserLoginExists(userLogin.getValue());
        }

        this.setState({UserLogin: userLogin});
    }

    verifyPassword(){
        let UserPassword = this.state["UserPassword"];
        let UserPasswordConfirm = this.state["UserPasswordConfirm"];

        UserPassword.setValidationMessage("");
        UserPasswordConfirm.setValidationMessage("");

        let isValid = true;

        if(UserPassword.getValue().length < 5){
            UserPassword.setValidationMessage("Minimum of 5 characters");
            isValid = false;
        }

        if(UserPassword.getValue() != UserPasswordConfirm.getValue()){
            UserPasswordConfirm.setValidationMessage("Passwords do not match");
            isValid = false;
        }

        if(isValid){
            this.setState({mode:"USEREMAIL"});
        }

        this.setState({UserPassword: UserPassword, UserPasswordConfirm:UserPasswordConfirm});
    }

    verifyEmail(){
        let Email = this.state["Email"];
        let EmailConfirm = this.state["EmailConfirm"];

        Email.setValidationMessage("");
        EmailConfirm.setValidationMessage("");

        let isValid = true;

        if(Email.getValue().length < 5){
            Email.setValidationMessage("Minimum of 5 characters");
            isValid = false;
        }

        if(Email.getValue() != EmailConfirm.getValue()){
            EmailConfirm.setValidationMessage("Emails do not match");
            isValid = false;
        }

        if(isValid)
            this.createUser();

        this.setState({Email: Email, EmailConfirm:EmailConfirm});
    }

    renderUserLogin(){
        return (
            <Form title='Choose user' save={this.checkUsernameAvailability}>
                <FormGroup
                    id="userLogin"
                    label="Username"
                    value={this.state["UserLogin"].getValue()}
                    onChange={(e) => {this.fieldChange("UserLogin",e.target.value)}}
                    validationMessage={this.state["UserLogin"].getValidationMessage()}
                />

                <div className={styles.buttonGroup}>
                    <LinkButton type='secondary' href="#" onClick={this.props.onClickBack} caption="Cancel"/>
                    <LinkButton type='primary' href="#" onClick={this.checkUsernameAvailability} caption="Next"/>
                </div>
            </Form>
        )
    }

    renderUserPassword(){
        return (
            <Form title='Create User' save={this.verifyPassword}>
                <FormGroup
                    id="userPassword"
                    label="Password"
                    value={this.state["UserPassword"].getValue()}
                    onChange={(e) => {this.fieldChange("UserPassword",e.target.value)}}
                    validationMessage={this.state["UserPassword"].getValidationMessage()}
                />

                <FormGroup
                    id="userPasswordConfirm"
                    label=" Confirm"
                    value={this.state["UserPasswordConfirm"].getValue()}
                    onChange={(e) => {this.fieldChange("UserPasswordConfirm",e.target.value)}}
                    validationMessage={this.state["UserPasswordConfirm"].getValidationMessage()}
                />

                <div className={styles.buttonGroup}>
                    <LinkButton type='secondary' href="#" onClick={()=>{this.setState({mode:"USERLOGIN"})}} caption="Back"/>
                    <LinkButton type='primary' href="#" onClick={this.verifyPassword} caption="Next"/>
                </div>
            </Form>
        )
    }

    renderUserEmail(){
        return (
            <Form title='Create User' save={this.verifyEmail}>
                <FormGroup
                    id="Email"
                    label="Email"
                    value={this.state["Email"].getValue()}
                    onChange={(e) => {this.fieldChange("Email",e.target.value)}}
                    validationMessage={this.state["Email"].getValidationMessage()}
                />

                <FormGroup
                    id="EmailConfirm"
                    label=" Confirm"
                    value={this.state["EmailConfirm"].getValue()}
                    onChange={(e) => {this.fieldChange("EmailConfirm",e.target.value)}}
                    validationMessage={this.state["EmailConfirm"].getValidationMessage()}
                />

                <div className={styles.buttonGroup}>
                    <LinkButton type='secondary' href="#" onClick={()=>{this.setState({mode:"USERPASSWORD"})}} caption="Back"/>
                    <LinkButton type='primary' href="#" onClick={this.verifyEmail} caption="Create"/>
                </div>
            </Form>
        )
    }

    savedDialog(){
        let {insertId} = this.state;

        return (
            <ModalConfirm
                title={"User Saved"}
                message={"The User was successfully saved,"}
                confirm={() => this.props.history.replace(`/user/edit/${insertId}`)}
                open={this.state.showSavedDialog}
            />
        )
    }

    render(){
        let ActiveForm = () => '';
        let SavedDialog = this.savedDialog;

        if(this.state.mode == "USERLOGIN")
            ActiveForm = this.renderUserLogin;
        else if(this.state.mode == "USERPASSWORD")
            ActiveForm = this.renderUserPassword;
        else if(this.state.mode == "USEREMAIL")
            ActiveForm = this.renderUserEmail;

        return(
            <div className={styles.userForm}>
                <SavedDialog/>
                <ActiveForm />
            </div>
        )
    }
}

export default Create
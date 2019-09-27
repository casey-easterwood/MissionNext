/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../Elements/LinkButton';
import Form from '../../../Elements/Form';
import FormGroup from '../../../Elements/FormGroup';
import styles  from './styles.scss';
import {BackButton} from "../../../Elements/BackButton";
import DataField from "../../../../Data/Models/DataField";
import ModalConfirm from "../../../Elements/ModalConfirm";

class ResetPassword extends Component {
    dataProvider = window.dataProvider.users;

    constructor(props) {
        super(props);

        this.getTitle = this.getTitle.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.savePassword = this.savePassword.bind(this);
        this.verifyPassword = this.verifyPassword.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.savedDialog = this.savedDialog.bind(this);

        this.state = {
            showSavedDialog: false,
            debounce: (new Date()).getTime(),
            UserPassword: new DataField("UserPassword", "string", '', false),
            UserPasswordConfirm: new DataField("UserPasswordConfirm", "string", '', false),
        };
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);
        this.dataProvider.getAllUsers();
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        if(event == "USERS_LOADED"){
            const id = this.props.match.params.id;
            this.state.item = this.dataProvider.getRow(id);
            this.state.loading = false;
        } else if (event == "PASSWORD_SAVED"){
            this.state.showSavedDialog = true;
        }

        this.setState(this.state);
    }

    getTitle(){
        const { user } = this.props;

        let name
            = user.getFieldValue('FirstName')
            + " "
            + user.getFieldValue('LastName');

        if(name === "")
            name = user.getFieldValue('UserLogin');

        return 'Reset Password for ' + name;
    }

    onFieldChange(fieldName, value){
        let field = this.state[fieldName];
        field.setValue(value);

        this.setState(this.state);
    }

    savePassword(){

        if((new Date()).getTime() > this.state.debounce) {
            const {item} = this.state;

            const userId = item.fields["UserId"].getValue();
            const password = this.state.UserPassword.getValue();

            this.dataProvider.resetPassword(userId, password);
        }

        this.setState({debounce: (new Date()).getTime() + 3000});
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
            this.savePassword();
        }

        this.setState({UserPassword: UserPassword, UserPasswordConfirm:UserPasswordConfirm});
    }

    savedDialog(){
        return (
            <ModalConfirm
                title={"Password changed"}
                message={"The User password was successfully saved,"}
                confirm={() => this.props.history.push('/administration/users')}
                open={this.state.showSavedDialog}
            />
        )
    }

    render(){
        const SavedDialog = this.savedDialog;

        return(
            <Fragment>
                <SavedDialog />
                <div className={styles.userForm}>
                    <Form title='Reset Password' save={this.verifyPassword}>
                        <FormGroup
                            id="userPassword"
                            label="Password"
                            value={this.state["UserPassword"].getValue()}
                            onChange={(e) => {this.onFieldChange("UserPassword",e.target.value)}}
                            validationMessage={this.state["UserPassword"].getValidationMessage()}
                        />

                        <FormGroup
                            id="userPasswordConfirm"
                            label=" Confirm"
                            value={this.state["UserPasswordConfirm"].getValue()}
                            onChange={(e) => {this.onFieldChange("UserPasswordConfirm",e.target.value)}}
                            validationMessage={this.state["UserPasswordConfirm"].getValidationMessage()}
                        />

                        <div className={styles.buttonGroup}>
                            <LinkButton type='secondary' href="#" onClick={()=>this.props.history.goBack()} caption="Back"/>
                            <LinkButton type='primary' href="#" onClick={this.verifyPassword} caption="Next"/>
                        </div>
                    </Form>
                </div>
            </Fragment>
        )
    }
}

export default ResetPassword
/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../Elements/LinkButton';
import Form from '../../../Elements/Form';
import FormGroup from '../../../Elements/FormGroup';
import FormSection from "../../../Elements/FormSection";
import styles  from './styles.scss';
import {BackButton} from "../../../Elements/BackButton";
import ModalConfirm from "../../../Elements/ModalConfirm";

class Edit extends Component {
    dataProvider = window.dataProvider.users;

    constructor(props) {
        super(props);

        this.getTitle = this.getTitle.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.savedDialog = this.savedDialog.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.state = {
            loading: true,
            showSavedDialog: false,
            item: null,
            debounce: (new Date()).getTime()
        }
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);
        this.dataProvider.getAllUsers();
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        console.log(event);
        if(event == "USERS_LOADED"){
            const id = this.props.match.params.id;
            this.state.item = this.dataProvider.getRow(id);
            this.state.loading = false;
        } else if (event == "USER_SAVED"){
            this.state.showSavedDialog = true;
        }

        this.setState(this.state);
    }

    getTitle(){
        const { item } = this.state;

        if(item == null) return "";

        let name
            = item.getFieldValue('FirstName')
            + " "
            + item.getFieldValue('LastName');

        if(name == " ")
            name = item.getFieldValue('UserLogin');

        return 'Edit ' + name;
    }

    saveUser(){
        if((new Date()).getTime() > this.state.debounce) {
            const {item} = this.state;

            if(item.validate()){
                if (!item.isDirty())
                    this.setState({showSavedDialog:true});
                else
                    this.dataProvider.saveChanges();
            }
        }

        this.setState({debounce: (new Date()).getTime() + 3000});
    }

    savedDialog(){
        return (
            <ModalConfirm
                title={"User Saved"}
                message={"The User was successfully saved,"}
                confirm={() => this.props.history.push('/administration/users')}
                open={this.state.showSavedDialog}
            />
        )
    }

    render(){
        const { item } = this.state;

        const SavedDialog = this.savedDialog;
        const title = this.getTitle();

        return(
            <Fragment>
                <SavedDialog />
                {!this.state.loading &&
                    <Form save={this.saveUser}>
                    <FormSection justify={"start"}>
                        <h3>{title}</h3>
                        <FormGroup
                            id="FirstName"
                            label="First Name"
                            value={item.fields['FirstName'].getValue()}
                            validationMessage={item.fields['FirstName'].getValidationMessage()}
                            onChange={(e) => item.fields['FirstName'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="LastName"
                            label="Last Name"
                            value={item.fields['LastName'].getValue()}
                            validationMessage={item.fields['LastName'].getValidationMessage()}
                            onChange={(e) => item.fields['LastName'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="Email"
                            label="Email Address"
                            value={item.fields['Email'].getValue()}
                            validationMessage={item.fields['Email'].getValidationMessage()}
                            onChange={(e) => item.fields['Email'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="Role"
                            label="Role"
                            value={item.fields['Role'].getValue()}
                            validationMessage={item.fields['Role'].getValidationMessage()}
                            onChange={(e) => item.fields['Role'].setValue(e.target.value)}
                        />
                    </FormSection>
                    <FormSection justify={"end"}>
                        <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.goBack()} caption="Close"/>
                        <LinkButton type={'primary'} href="#" onClick={this.saveUser} caption="Save"/>
                    </FormSection>
                </Form>
                }
                {this.state.loading &&
                    <h2>Loading....</h2>
                }

            </Fragment>
        )
    }
}

export default Edit
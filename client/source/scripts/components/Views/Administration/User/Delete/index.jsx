/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../../Elements/LinkButton';
import Form from '../../../../Elements/Form';
import FormGroup from '../../../../Elements/FormGroup';
import styles  from './styles.scss';
import {BackButton} from "../../../../Elements/BackButton";
import DataField from "../../../../../Data/Models/DataField";
import ModalConfirm from "../../../../Elements/ModalConfirm";

class Delete extends Component {
    dataProvider = window.dataProvider.users;

    constructor(props) {
        super(props);

        this.getTitle = this.getTitle.bind(this);
        this.delete = this.delete.bind(this);
        this.fieldChange = this.fieldChange.bind(this);
        this.savedDialog = this.savedDialog.bind(this);
        this.providerHandler = this.providerHandler.bind(this);

        this.state = {
            showSavedDialog: false,
            loading:true,
            debounce: (new Date()).getTime(),
            confirmDelete: new DataField("ConfirmDelete", "string", '', false),
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
        if(event == "USERS_LOADED"){
            const id = this.props.match.params.id;
            this.state.item = this.dataProvider.getRow(id);
            this.state.loading = false;
        } else if (event == "USER_DELETED"){
            this.state.showSavedDialog = true;
        }

        this.setState(this.state);
    }

    getTitle(){
        const { item } = this.state;

        let name
            = item.getFieldValue('FirstName')
            + " "
            + item.getFieldValue('LastName');

        if(name === "")
            name = item.getFieldValue('UserLogin');

        return 'Confirm delete ' + name;
    }

    fieldChange(fieldName, value){
        let field = this.state[fieldName];
        field.setValue(value);

        this.setState(this.state);
    }


    delete(){
        if((new Date()).getTime() > this.state.debounce) {
            const { item } = this.state;
            const deleteVerification = "delete " + item.fields['UserLogin'].getValue();
            const userId = item.fields["UserId"].getValue();

            let confirmDelete = this.state["confirmDelete"];

            confirmDelete.setValidationMessage("");

            let isValid = true;

            if(confirmDelete.getValue() != deleteVerification){
                confirmDelete.setValidationMessage("Confirmation Failed");
                isValid = false;
            }

            if(isValid){
                this.dataProvider.delete(userId);
            }
        }

        this.setState({debounce: (new Date()).getTime() + 3000});
    }

    savedDialog(){
        return (
            <ModalConfirm
                title={"User deleted"}
                message={"The User was successfully deleted,"}
                confirm={() => this.props.history.push('/administration/users')}
                open={this.state.showSavedDialog}
            />
        )
    }

    render(){
        const { item, loading } = this.state;

        const deleteConfirm = (item != null) ? "delete " + item.fields['UserLogin'].getValue() : "";
        const SavedDialog = this.savedDialog;

        return(
            <Fragment>
                <SavedDialog />
                {!loading &&
                <div className={styles.userForm}>
                    <Form save={this.delete}>
                        <p>
                            Deleting this user can not be undone. To confirm please type "{deleteConfirm}" in the box
                            and click delete.
                        </p>
                        <FormGroup
                            id="deleteConfirm"
                            label="Confirm Delete"
                            value={this.state["confirmDelete"].getValue()}
                            onChange={(e) => {
                                this.fieldChange("confirmDelete", e.target.value)
                            }}
                            validationMessage={this.state["confirmDelete"].getValidationMessage()}
                        />
                        <div className={styles.buttonGroup}>
                            <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.goBack()}
                                        caption="Cancel"/>
                            <LinkButton type={'warning'} href="#" onClick={this.delete} caption="Delete"/>
                        </div>
                    </Form>
                </div>
                }
                {loading &&
                <h2>Loading....</h2>
                }
            </Fragment>
        )
    }
}

export default Delete
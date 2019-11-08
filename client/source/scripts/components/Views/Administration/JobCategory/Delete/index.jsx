import React, {Component} from 'react';
import LinkButton from '../../../../Elements/LinkButton';
import Form from '../../../../Elements/Form';
import FormGroup from '../../../../Elements/FormGroup';
import styles  from './styles.scss';
import {BackButton} from "../../../../Elements/BackButton";
import DataField from "../../../../../Data/Models/DataField";

class Delete extends Component {
    constructor(props) {
        super(props);

        this.getTitle = this.getTitle.bind(this);
        this.delete = this.delete.bind(this);
        this.fieldChange = this.fieldChange.bind(this);

        this.state = {
            debounce: (new Date()).getTime(),
            confirmDelete: new DataField("ConfirmDelete", "string", '', false),
        }
    }

    getTitle(){
        const { selectedItem } = this.props;

        return 'Confirm delete ' + selectedItem.getFieldValue('Name');
    }

    fieldChange(fieldName, value){
        let field = this.state[fieldName];
        field.setValue(value);

        this.setState(this.state);
    }

    delete(){
        if((new Date()).getTime() > this.state.debounce) {
            const { selectedItem } = this.props;
            const deleteVerification = "delete " + selectedItem.fields['Name'].getValue();
            const itemId = selectedItem.fields["Id"].getValue();

            let confirmDelete = this.state["confirmDelete"];

            confirmDelete.setValidationMessage("");

            let isValid = true;

            if(confirmDelete.getValue() != deleteVerification){
                confirmDelete.setValidationMessage("Confirmation Failed");
                isValid = false;
            }

            if(isValid){
                window.dataProvider.JobCategories.delete(itemId);
            }
        }

        this.setState({debounce: (new Date()).getTime() + 3000});
    }

    render(){
        const { selectedItem, onClickBack } = this.props;

        const title = this.getTitle();
        const deleteConfirm = "delete " + selectedItem.fields['Name'].getValue();

        return(
            <div className={styles.userForm}>
                <BackButton onClick={onClickBack} />
                <Form title={title} save={this.delete}>
                    <p>
                        Deleting this category can not be undone. To confirm please type "{deleteConfirm}" in the box and click delete.
                    </p>
                    <FormGroup
                        id="deleteConfirm"
                        label="Confirm Delete"
                        value={this.state["confirmDelete"].getValue()}
                        onChange={(e) => {this.fieldChange("confirmDelete",e.target.value)}}
                        validationMessage={this.state["confirmDelete"].getValidationMessage()}
                    />
                    <div className={styles.buttonGroup}>
                        <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.push('/administration/jobcategories')}  caption="Close"/>
                        <LinkButton type={'warning'} href="#" onClick={this.delete} caption="Delete"/>
                    </div>
                </Form>
            </div>
        )
    }
}

export default Delete
/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../Elements/LinkButton';
import Form from '../../../Elements/Form';
import FormGroup from '../../../Elements/FormGroup';
import styles  from './styles.scss';
import DataField from "../../../../Data/Models/DataField";
import ModalConfirm from "../../../Elements/ModalConfirm";

class Create extends Component {
    dataProvider = window.dataProvider.ProfileQuestionGroups;

    constructor(props) {
        super(props);

        this.getTitle = this.getTitle.bind(this);
        this.validate = this.validate.bind(this);
        this.create = this.create.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.savedDialog = this.savedDialog.bind(this);

        this.state = {
            showSavedDialog: false,
            mode: "GROUPNAME",
            Name: new DataField("Name", "string", '', false),
        }
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data) {
        if(event == "PROFILE_QUESTION_GROUP_CREATED") {
            this.setState({showSavedDialog:true})
        }
    }

    getTitle(){
        return 'Create Question Group';
    }

    fieldChange(fieldName, value){
        let field = this.state[fieldName];
        field.setValue(value);

        this.setState(this.state);
    }

    validate(){
        let name = this.state["Name"];


        if(name.getValue().length < 5){
            name.setValidationMessage("Requires minimum of 5 chars");
        } else {
            this.create();
        }

        this.setState({Title: name});
    }

    create(){
        let data = [];

        data.push({name:"Name", value: this.state.Name.getValue()});

        this.dataProvider.create(data);
    }

    savedDialog(){
        let id = this.state.item ? this.state.item.getKey() : 0;

        return (
            <ModalConfirm
                title={"Question group created"}
                message={"The Group was successfully created,"}
                confirm={() => this.props.history.replace(`/profilequestiongroups`)}
                open={this.state.showSavedDialog}
            />
        )
    }

    render(){
        const SavedDialog = this.savedDialog;

        return (
            <Fragment>
                <SavedDialog />
                <Form title={this.getTitle()} save={this.validate}>
                    <FormGroup
                        id="Name"
                        label="Group Name"
                        value={this.state["Name"].getValue()}
                        onChange={(e) => {this.fieldChange("Name",e.target.value)}}
                        validationMessage={this.state["Name"].getValidationMessage()}
                    />

                    <div className={styles.buttonGroup}>
                        <LinkButton type='secondary' href="#" onClick={() => this.props.history.goBack()} caption="Cancel"/>
                        <LinkButton type='primary' href="#" onClick={this.validate} caption="Create"/>
                    </div>
                </Form>
            </Fragment>
        )
    }
}

export default Create
/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../../Elements/LinkButton';
import Form from '../../../../Elements/Form';
import FormGroup from '../../../../Elements/FormGroup';
import styles  from './styles.scss';
import DataField from "../../../../../Data/Models/DataField";
import SchoolDataRow from "../../../../../Data/Models/SchoolDataRow";
import ModalConfirm from "../../../../Elements/ModalConfirm";
import FormSection from "../../../../Elements/FormSection";

class Create extends Component {
    dataProvider = window.dataProvider.schools;

    constructor(props) {
        super(props);

        this.checkNameAvailability = this.checkNameAvailability.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.handleSchoolExists = this.handleSchoolExists.bind(this);
        this.handleSchoolCreated = this.handleSchoolCreated.bind(this);
        this.createSchool = this.createSchool.bind(this);
        this.savedDialog = this.savedDialog.bind(this);

        this.state = {
            mode: "SCHOOLNAME",
            Name: new DataField("NAME", "string", '', false),
        }
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        if(event == "SCHOOL_EXISTS")
            this.handleSchoolExists(data);
        else if(event == "SCHOOL_CREATED")
            this.handleSchoolCreated(data);
    }

    handleSchoolExists(data){
        if(data.exists){
            this.state.Name.setValidationMessage("School already exists");
        } else {
            this.state.Name.setValidationMessage("");
            this.createSchool();
        }

        this.setState({UserLogin:this.state.UserLogin, mode:this.state.mode});
    }

    handleSchoolCreated(data){
        if(data.status == "success"){
            const insertId = data.insertId;

            const newSchoolData = {
                Id: insertId,
                Name: this.state.Name.getValue(),
                Address: '',
                City: '',
                State: '',
                Country: '',
                ContactName: '',
                Phone: '',
                Website: '',
                Status: '',
                Created: '0'
            };

            let SchoolRow = new SchoolDataRow(newSchoolData);

            this.dataProvider.addRow(SchoolRow);

            this.setState({item:SchoolRow,showSavedDialog:true});
        }
    }

    fieldChange(fieldName, value){
        let field = this.state[fieldName];
        field.setValue(value);

        this.setState(this.state);
    }

    checkNameAvailability(){
        let schools = this.dataProvider;
        let name = this.state["Name"];


        if(name.getValue().length < 5){
            name.setValidationMessage("Requires minimum of 5 chars");
        } else {
            schools.checkSchoolExists(name.getValue());
        }

        this.setState({Name: name});
    }

    createSchool(){
        let userData = [];
        let created = (new Date()).getTime()/1000;

        userData.push({name:"Name", value: this.state.Name.getValue()});
        userData.push({name:"Status", value: 0});
        userData.push({name:"Created", value: created });
        userData.push({name:"ImportId", value: 0});
        userData.push({name:"OwnerUserId", value: 0});

        this.dataProvider.create(userData);
    }

    savedDialog(){
        let id = this.state.item ? this.state.item.getKey() : 0;

        return (
            <ModalConfirm
                title={"School Saved"}
                message={"The School was successfully created,"}
                confirm={() => this.props.history.goBack()}
                open={this.state.showSavedDialog}
            />
        )
    }

    render(){
        const SavedDialog = this.savedDialog;

        return(
            <Fragment>
                <SavedDialog />
                <Form title='New School' save={this.checkNameAvailability}>
                    <FormGroup
                        id="Name"
                        label="Name"
                        value={this.state["Name"].getValue()}
                        onChange={(e) => {this.fieldChange("Name",e.target.value)}}
                        validationMessage={this.state["Name"].getValidationMessage()}
                    />

                    <div className={styles.buttonGroup}>
                        <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.push('/administration/schools')} caption="Close"/>
                        <LinkButton type='primary' href="#" onClick={this.checkNameAvailability} caption="Next"/>
                    </div>
                </Form>
            </Fragment>
        )
    }
}

export default Create
/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../Elements/LinkButton';
import Form from '../../../Elements/Form';
import FormGroup from '../../../Elements/FormGroup';
import styles  from './styles.scss';
import DataField from "../../../../Data/Models/DataField";
import AgencyDataRow from "../../../../Data/Models/AgencyDataRow";
import ModalConfirm from "../../../Elements/ModalConfirm";
import FormSection from "../../../Elements/FormSection";

class Create extends Component {
    dataProvider = window.dataProvider.agencies;

    constructor(props) {
        super(props);

        this.checkNameAvailability = this.checkNameAvailability.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.handleAgencyExists = this.handleAgencyExists.bind(this);
        this.handleAgencyCreated = this.handleAgencyCreated.bind(this);
        this.createAgency = this.createAgency.bind(this);
        this.savedDialog = this.savedDialog.bind(this);

        this.state = {
            mode: "AGENCYNAME",
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
        if(event == "AGENCY_EXISTS")
            this.handleAgencyExists(data);
        else if(event == "AGENCY_CREATED")
            this.handleAgencyCreated(data);
    }

    handleAgencyExists(data){
        if(data.exists){
            this.state.Name.setValidationMessage("Agency already exists");
        } else {
            this.state.Name.setValidationMessage("");
            this.createAgency();
        }

        this.setState({UserLogin:this.state.UserLogin, mode:this.state.mode});
    }

    handleAgencyCreated(data){
        if(data.status == "success"){
            const insertId = data.insertId;

            const newAgencyData = {
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

            let AgencyRow = new AgencyDataRow(newAgencyData);

            this.dataProvider.addRow(AgencyRow);

            this.setState({item:AgencyRow,showSavedDialog:true});
        }
    }

    fieldChange(fieldName, value){
        let field = this.state[fieldName];
        field.setValue(value);

        this.setState(this.state);
    }

    checkNameAvailability(){
        let agencies = this.dataProvider;
        let name = this.state["Name"];


        if(name.getValue().length < 5){
            name.setValidationMessage("Requires minimum of 5 chars");
        } else {
            agencies.checkAgencyExists(name.getValue());
        }

        this.setState({Name: name});
    }

    createAgency(){
        let userData = [];
        let created = (new Date()).getTime()/1000;

        userData.push({name:"Name", value: this.state.Name.getValue()});
        userData.push({name:"Status", value: 0});
        userData.push({name:"Created", value: created });

        this.dataProvider.create(userData);
    }

    savedDialog(){
        let id = this.state.item ? this.state.item.getKey() : 0;

        return (
            <ModalConfirm
                title={"Agency Saved"}
                message={"The Agency was successfully created,"}
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
                <Form title='New Agency' save={this.checkNameAvailability}>
                    <FormGroup
                        id="Name"
                        label="Name"
                        value={this.state["Name"].getValue()}
                        onChange={(e) => {this.fieldChange("Name",e.target.value)}}
                        validationMessage={this.state["Name"].getValidationMessage()}
                    />

                    <div className={styles.buttonGroup}>
                        <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.push('/agencies')} caption="Close"/>
                        <LinkButton type='primary' href="#" onClick={this.checkNameAvailability} caption="Next"/>
                    </div>
                </Form>
            </Fragment>
        )
    }
}

export default Create
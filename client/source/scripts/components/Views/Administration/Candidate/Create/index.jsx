/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../Elements/LinkButton';
import Form from '../../../Elements/Form';
import FormGroup from '../../../Elements/FormGroup';
import styles  from './styles.scss';
import DataField from "../../../../Data/Models/DataField";
import CandidateDataRow from "../../../../Data/Models/CandidateDataRow";
import ModalConfirm from "../../../Elements/ModalConfirm";

class Create extends Component {
    dataProvider = window.dataProvider.candidates;

    constructor(props) {
        super(props);

        this.checkNameAvailability = this.checkNameAvailability.bind(this);
        this.savedDialog = this.savedDialog.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.handleExists = this.handleExists.bind(this);
        this.handleCreated = this.handleCreated.bind(this);
        this.create = this.create.bind(this);

        this.state = {
            mode: "CANDIDATENAME",
            Name: new DataField("Name", "string", '', false),
        }
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        if(event == "CANDIDATE_EXISTS")
            this.handleExists(data);
        else if(event == "CANDIDATE_CREATED")
            this.handleCreated(data);
    }


    handleExists(data){
        if(data.exists){
            this.state.Name.setValidationMessage("Candidate already exists");
        } else {
            this.state.Name.setValidationMessage("");
            this.create();
        }

        this.setState({Name:this.state.Name, mode:this.state.mode});
    }

    handleCreated(data){
        if(data.status == "success"){
            const insertId = data.insertId;

            const newCandidateData = {
                Id: insertId,
                UserId: 0,
                Name: this.state.Name.getValue(),
                Address: '',
                City: '',
                State: '',
                PostalCode: '',
                Country: '',
                Phone: '',
                Email: '',
                DateOfBirth: 0,
                Status: 0,
                Created: 0
            };

            let CandidateRow = new CandidateDataRow(newCandidateData);

            this.dataProvider.addRow(CandidateRow);

            this.setState({item:CandidateRow,showSavedDialog:true});
        }
    }

    fieldChange(fieldName, value){
        let field = this.state[fieldName];
        field.setValue(value);

        this.setState(this.state);
    }

    checkNameAvailability(){
        let candidates = window.dataProvider.candidates;
        let name = this.state["Name"];

        if(name.getValue().length < 5){
            name.setValidationMessage("Requires minimum of 5 chars");
        } else {
            candidates.checkCandidateExists(name.getValue());
        }

        this.setState({Name: name});
    }

    create(){
        let data = [];
        let created = (new Date()).getTime()/1000;

        data.push({name:"Name", value: this.state.Name.getValue()});
        data.push({name:"DateOfBirth", value: 0});
        data.push({name:"Status", value: 0});
        data.push({name:"Created", value: created });

        this.dataProvider.create(data);
    }

    savedDialog(){
        let id = this.state.item ? this.state.item.getKey() : 0;

        return (
            <ModalConfirm
                title={"Candidate Saved"}
                message={"The Candidate was successfully created,"}
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
                <Form title='New Candidate' save={this.checkNameAvailability}>
                    <FormGroup
                        id="Name"
                        label="Name"
                        value={this.state["Name"].getValue()}
                        onChange={(e) => {this.fieldChange("Name",e.target.value)}}
                        validationMessage={this.state["Name"].getValidationMessage()}
                    />

                    <div className={styles.buttonGroup}>
                        <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.push('/candidates')} caption="Close"/>
                        <LinkButton type='primary' href="#" onClick={this.checkNameAvailability} caption="Next"/>
                    </div>
                </Form>
            </Fragment>
        )
    }
}

export default Create
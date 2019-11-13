/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../../Elements/LinkButton';
import Form from '../../../../Elements/Form';
import FormGroup from '../../../../Elements/FormGroup';
import FormSection from '../../../../Elements/FormSection';
import styles  from './styles.scss';
import ModalConfirm from "../../../../Elements/ModalConfirm";
import QuestionButton from "../../../../Elements/QuestionButton";
import Modal from "../../../../Elements/Modal";
import VerticalNavMenu from "../../../../Elements/VerticalNavMenu";
import VerticalMenu from "../../../../Elements/VerticalMenu";
import Content from "../../../../Elements/Layout/Content";


class Loader {
    id = 0;

    constructor(id) {
        this.id = id;

        this.load = this.load.bind(this);
        this.loadCandidate = this.loadCandidate.bind(this);
        this.loadProfileData = this.loadProfileData.bind(this);
    }

    load() {
        const loader = this;

        let data = {
            candidate: null,
            profileData: null
        };

        return new Promise((resolve, reject) => {
            let getCandidate = loader.loadCandidate(loader.id);
            let getProfileData = loader.loadProfileData(loader.id);

            let promises = [
                getCandidate,
                getProfileData
            ];

            Promise.all(promises).then((results) => {
                data.candidate = results[0];
                data.profileData = results[1];
                resolve(data);
            })
        });
    }

    loadCandidate(id) {
        return new Promise((resolve, reject) => {
            let item = window.dataProvider.candidates.getRow(id);

            const handler = (event, data) => {
                if (event == "CANDIDATES_LOADED") {
                    item = window.dataProvider.candidates.getRow(id);

                    window.dataProvider.candidates.unsubscribe(this);

                    resolve(item);
                }
            };

            if (item == null) {
                window.dataProvider.candidates.subscribeToChanges(handler);
                window.dataProvider.candidates.getAll();
            } else {
                resolve(item);
            }
        })
    }

    loadProfileData(id) {
        return new Promise((resolve, reject) => {
            const handler = (event, data) => {
                if (event == "CANDIDATE_PROFILE_LOADED") {
                    let profileData = data;

                    window.dataProvider.candidates.unsubscribe(this);

                    resolve(profileData);
                }
            };

            window.dataProvider.candidates.subscribeToChanges(handler);
            window.dataProvider.candidates.getProfileData(id);
        })
    }
}

class View extends Component {
    dataProvider = window.dataProvider.candidates;

    constructor(props) {
        super(props);

        this.providerHandler = this.providerHandler.bind(this);
        this.savedDialog = this.savedDialog.bind(this);
        this.getProfileData = this.getProfileData.bind(this);
        this.save = this.save.bind(this);

        this.state = {
            item: null,
            profileData: null,
            loading: true,
            showSavedDialog: false,
            showAnswerDialog: false,
            selectedQuestionId: 0,
            debounce: (new Date()).getTime()
        }
    }

    componentDidMount(){
        const loader = new Loader(this.props.match.params.id);

        loader.load().then(data => {
            this.state.item = data.candidate;
            this.state.profileData = data.profileData;
            this.state.loading = false;

            this.setState(this.state);
        });

        this.dataProvider.subscribeToChanges(this.providerHandler);
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(message, data){
        if (message == "CANDIDATE_SAVED"){
            this.state.showSavedDialog = true;
        }

        this.setState(this.state);
    }

    save(){
        if((new Date()).getTime() > this.state.debounce) {
            const {item} = this.state;

            if(!item.validate()) return;

            if(!item.isDirty())
                this.providerHandler("CANDIDATE_SAVED", null);
            else
                this.dataProvider.saveChanges();
        }

        this.setState({debounce: (new Date()).getTime() + 3000});
    }

    savedDialog(){
        return (
            <ModalConfirm
                title={"Candidate Saved"}
                message={"The Candidate was successfully saved,"}
                confirm={() => this.props.history.goBack()}
                open={this.state.showSavedDialog}
            />
        )
    }

    getProfileData(){
        let fields = [];

        //Group Fields by name
        for(let d of this.state.profileData){
            let field = fields.find(element=>element.FieldName == (d.FieldName + " - " + d.NewFieldId));

            if(!field) {
                field = { FieldName:d.FieldName + " - " + d.NewFieldId, Values:[]};
                fields.push(field);
            }

            if(d.FieldValue != "")field.Values.push(d.FieldValue + " - " + d.NewDictionaryId);
        }

        //Sort by field name and filter out empty values
        return fields
            .filter(element => element.Values.length > 0)
            .sort((a,b)=>{
                if (a.FieldName < b.FieldName) {
                    return -1;
                }
                if (a.FieldName > b.FieldName) {
                    return 1;
                }
                return 0;
            });
    }

    render(){
        const { item } = this.state;
        const SavedDialog = this.savedDialog;

        return(
            <Fragment>
                <SavedDialog />
                {this.state.loading &&
                    <h2>Loading....</h2>
                }

                {!this.state.loading &&
                    <Form  save={this.save}>
                        <FormSection justify="start">
                            <h3>Candidate Information</h3>
                            <FormGroup
                                id="Name"
                                label="Name"
                                readOnly={true}
                                value={item.fields['Name'].getValue()}
                                validationMessage = {item.fields['Name'].getValidationMessage()}
                                onChange={(e) => item.fields['Name'].setValue(e.target.value)}
                            />
                            <FormGroup
                                id="Phone"
                                label="Phone"
                                readOnly={true}
                                value={item.fields['Phone'].getValue() || ''}
                                validationMessage = {item.fields['Phone'].getValidationMessage()}
                                onChange={(e) => item.fields['Phone'].setValue(e.target.value)}
                            />
                            <FormGroup
                                id="Email"
                                label="Email"
                                readOnly={true}
                                value={item.fields['Email'].getValue() || ''}
                                validationMessage = {item.fields['Email'].getValidationMessage()}
                                onChange={(e) => item.fields['Email'].setValue(e.target.value)}
                            />
                            <FormGroup
                                id="ImportId"
                                label="Import Id"
                                readOnly={true}
                                value={item.fields['ImportId'].getValue()}
                                validationMessage = {item.fields['ImportId'].getValidationMessage()}
                                onChange={(e) => item.fields['ImportId'].setValue(e.target.value)}
                            />
                        </FormSection>
                        <FormSection justify="start">
                            <h3>Mailing Address</h3>
                            <FormGroup
                                id="Address"
                                label="Address"
                                readOnly={true}
                                value={item.fields['Address'].getValue() || ''}
                                validationMessage = {item.fields['Address'].getValidationMessage()}
                                onChange={(e) => item.fields['Address'].setValue(e.target.value)}
                            />
                            <FormGroup
                                id="City"
                                label="City"
                                readOnly={true}
                                value={item.fields['City'].getValue() || ''}
                                validationMessage = {item.fields['City'].getValidationMessage()}
                                onChange={(e) => item.fields['City'].setValue(e.target.value)}
                            />
                            <FormGroup
                                id="State"
                                label="State"
                                readOnly={true}
                                value={item.fields['State'].getValue() || ''}
                                validationMessage = {item.fields['State'].getValidationMessage()}
                                onChange={(e) => item.fields['State'].setValue(e.target.value)}
                            />
                            <FormGroup
                                id="PostalCode"
                                label="Postal Code"
                                readOnly={true}
                                value={item.fields['PostalCode'].getValue() || ''}
                                validationMessage = {item.fields['PostalCode'].getValidationMessage()}
                                onChange={(e) => item.fields['PostalCode'].setValue(e.target.value)}
                            />
                        </FormSection>
                        <FormSection justify={"start"}>
                            <h3>Profile Data</h3>
                            <ul className={styles.profileData}>
                                {this.getProfileData().map(field =>
                                    <li>
                                        <div>
                                            <div className={styles.profileFieldName}>
                                                {field.FieldName}
                                            </div>
                                            <div className={styles.profileFieldValue}>
                                                <ul>
                                                    {field.Values.map(value =>
                                                        <li>{decodeURI(value)}</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </FormSection>
                        <FormSection justify="end">
                            <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.push(`/administration/candidate/edit/${item.getKey()}`)} caption="Edit"/>
                            <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.goBack()}  caption="Close"/>
                        </FormSection>
                    </Form>
                }
            </Fragment>
        )
    }
}

export default View
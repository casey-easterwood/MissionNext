/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../Elements/LinkButton';
import Form from '../../../Elements/Form';
import FormGroup from '../../../Elements/FormGroup';
import styles  from './styles.scss';
import FormSection from "../../../Elements/FormSection";
import ModalConfirm from "../../../Elements/ModalConfirm";
import VerticalMenu from "../../../Elements/VerticalMenu";
import Modal from "../../../Elements/Modal";
import ModalFullscreen from "../../../Elements/ModalFullscreen";


class Loader {
    id = 0;
    constructor(id){
        this.id = id;

        this.load = this.load.bind(this);
        this.loadAgency = this.loadAgency.bind(this);
        this.loadAgencyJobs = this.loadAgencyJobs.bind(this);
    }

    load(){
        const loader = this;

        let data = {
            agency: null,
            jobs: [],
        };

        return new Promise((resolve, reject) => {
            let getAgency = loader.loadAgency(loader.id);
            let getJobs = loader.loadAgencyJobs(loader.id);

            let promises = [
                getAgency,
                getJobs
            ];


            Promise.all(promises).then((results) => {
                data.agency = results[0];
                data.jobs = results[1];

                console.log("Jobs:" + data.jobs.length);

                resolve(data);
            })
        });
    }

    loadAgency(agencyId) {
        return new Promise((resolve, reject) => {
            let agency = window.dataProvider.agencies.getRow(agencyId);

            const handler = (event, data) => {
                if(event =="AGENCIES_LOADED"){
                    agency = window.dataProvider.agencies.getRow(agencyId);

                    window.dataProvider.agencies.unsubscribe(this);

                    resolve(agency);
                }
            };

            if(agency == null){
                window.dataProvider.agencies.subscribeToChanges(handler);
                window.dataProvider.agencies.getAll();
            } else {
                resolve(agency);
            }
        })
    }

    loadAgencyJobs(agencyId) {
        return new Promise((resolve, reject) => {
            let jobs = window.dataProvider.jobs.getByAgency(agencyId);

            const handler = (event, data) => {
                if(event =="JOBS_LOADED"){
                    jobs = window.dataProvider.jobs.getByAgency(agencyId);

                    window.dataProvider.jobs.unsubscribe(this);

                    resolve(jobs);
                }
            };

            if(jobs.length == 0) {
                window.dataProvider.jobs.subscribeToChanges(handler);
                window.dataProvider.jobs.getAll();
            } else {
                resolve(jobs);
            }
        })
    }

}

class View extends Component {
    dataProvider = window.dataProvider.agencies;

    constructor(props) {
        super(props);

        this.providerHandler = this.providerHandler.bind(this);
        this.savedDialog = this.savedDialog.bind(this);
        this.save = this.save.bind(this);
        this.state = {
            item: null,
            fullscreen: false,
            jobs: [],
            loading: true,
            showSavedDialog: false,
            debounce: (new Date()).getTime()
        }
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);

        const id = this.props.match.params.id;
        let item = this.dataProvider.getRow(id);

        const loader = new Loader(id);

        loader.load().then(results =>{
            this.setState({item:results.agency, jobs:results.jobs, loading:false});
        });
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(message, data){
        if (message == "AGENCY_SAVED"){
            this.state.showSavedDialog = true;
        }

        this.setState(this.state);
    }

    save(){
        if((new Date()).getTime() > this.state.debounce) {
            const {item} = this.state;

            if(!item.validate()) return;

            if(!item.isDirty())
                this.providerHandler("AGENCY_SAVED", null);
            else
               this.dataProvider.saveChanges();
        }

        this.setState({debounce: (new Date()).getTime() + 3000});
    }

    savedDialog(){
        return (
            <ModalConfirm
                title={"Agency Saved"}
                message={"The Agency was successfully saved,"}
                confirm={() => this.props.history.push('/agencies')}
                open={this.state.showSavedDialog}
            />
        )
    }

    render(){
        const { item } = this.state;
        const { history } = this.props;
        const SavedDialog = this.savedDialog;

        return(
            <Fragment>
            <SavedDialog />
                {!this.state.loading &&
                <Form save={this.save}>
                    <FormSection justify="start">
                        <h3>Agency</h3>
                        <FormGroup
                            id="Name"
                            label="Name"
                            readOnly={true}
                            value={item.fields['Name'].getValue()}
                            validationMessage={item.fields['Name'].getValidationMessage()}
                            onChange={(e) => item.fields['Name'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="Status"
                            label="Status"
                            readOnly={true}
                            value={item.fields['Status'].getValue() || 0}
                            validationMessage={item.fields['Status'].getValidationMessage()}
                            onChange={(e) => item.fields['Status'].setValue(e.target.value)}
                        />
                    </FormSection>
                    <FormSection justify="start">
                        <h3>Contact Information</h3>
                        <FormGroup
                            id="ContactName"
                            label="Contact Name"
                            readOnly={true}
                            value={item.fields['ContactName'].getValue() || ''}
                            validationMessage={item.fields['ContactName'].getValidationMessage()}
                            onChange={(e) => item.fields['ContactName'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="Phone"
                            label="Phone"
                            readOnly={true}
                            value={item.fields['Phone'].getValue() || ''}
                            validationMessage={item.fields['Phone'].getValidationMessage()}
                            onChange={(e) => item.fields['Phone'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="Website"
                            label="Website"
                            readOnly={true}
                            value={item.fields['Website'].getValue() || ''}
                            validationMessage={item.fields['Website'].getValidationMessage()}
                            onChange={(e) => item.fields['Website'].setValue(e.target.value)}
                        />
                    </FormSection>
                    <FormSection justify="start">
                        <h3>Address</h3>
                        <FormGroup
                            id="Address"
                            label="Address"
                            readOnly={true}
                            value={item.fields['Address'].getValue() || ''}
                            validationMessage={item.fields['Address'].getValidationMessage()}
                            onChange={(e) => item.fields['Address'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="City"
                            label="City"
                            readOnly={true}
                            value={item.fields['City'].getValue() || ''}
                            validationMessage={item.fields['City'].getValidationMessage()}
                            onChange={(e) => item.fields['City'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="State"
                            label="State"
                            readOnly={true}
                            value={item.fields['State'].getValue() || ''}
                            validationMessage={item.fields['State'].getValidationMessage()}
                            onChange={(e) => item.fields['State'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="Country"
                            label="Country"
                            readOnly={true}
                            value={item.fields['Country'].getValue() || ''}
                            validationMessage={item.fields['Country'].getValidationMessage()}
                            onChange={(e) => item.fields['Country'].setValue(e.target.value)}
                        />
                    </FormSection>

                    <FormSection>
                        <div className={styles.jobsToolbar}>
                            <h3>Jobs</h3>
                            <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.push(`/job/create`)} caption="New"/>
                        </div>
                        <VerticalMenu
                            icon="baseline-work-24px.svg"
                            idField="Id"
                            captionField="Title"
                            defaultAction={(id) => this.props.history.push(`/job/view/${id}`)}
                            menuActions={[
                                {caption:"Edit Job", onClick:(id) => this.props.history.push(`/job/edit/${id}`), warning:false},
                                {caption:"View Job", onClick:(id) => this.props.history.push(`/job/view/${id}`), warning:false},
                            ]}
                            data={this.state.jobs}
                        />
                    </FormSection>

                    <FormSection justify="end">
                        <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.push(`/agency/edit/${item.getKey()}`)} caption="Edit"/>
                        <LinkButton type={'secondary'} href="#" onClick={() => history.goBack()} caption="Close"/>
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

export default View
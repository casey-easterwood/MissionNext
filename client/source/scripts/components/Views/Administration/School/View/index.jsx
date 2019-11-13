/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../../Elements/LinkButton';
import Form from '../../../../Elements/Form';
import FormGroup from '../../../../Elements/FormGroup';
import styles  from './styles.scss';
import FormSection from "../../../../Elements/FormSection";
import VerticalMenu from "../../../../Elements/VerticalMenu";

class Loader {
    id = 0;
    constructor(id){
        this.id = id;

        this.load = this.load.bind(this);
        this.loadSchool = this.loadSchool.bind(this);
        this.loadSchoolJobs = this.loadSchoolJobs.bind(this);
    }

    load(){
        const loader = this;

        let data = {
            school: null,
            jobs: [],
        };

        return new Promise((resolve, reject) => {
            let getSchool = loader.loadSchool(loader.id);
            let getJobs = loader.loadSchoolJobs(loader.id);

            let promises = [
                getSchool,
                getJobs
            ];


            Promise.all(promises).then((results) => {
                data.school = results[0];
                data.jobs = results[1];

                resolve(data);
            })
        });
    }

    loadSchool(schoolId) {
        return new Promise((resolve, reject) => {
            let school = window.dataProvider.schools.getRow(schoolId);

            const handler = (event, data) => {
                if(event =="SCHOOLS_LOADED"){
                    school = window.dataProvider.schools.getRow(schoolId);

                    window.dataProvider.schools.unsubscribe(this);

                    resolve(school);
                }
            };

            if(school == null){
                window.dataProvider.schools.subscribeToChanges(handler);
                window.dataProvider.schools.getAll();
            } else {
                resolve(school);
            }
        })
    }

    loadSchoolJobs(schoolId) {
        return new Promise((resolve, reject) => {
            let jobs = window.dataProvider.jobs.getBySchool(schoolId);

            const handler = (event, data) => {
                if(event =="JOBS_LOADED"){
                    jobs = window.dataProvider.jobs.getBySchool(schoolId);

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
    constructor(props) {
        super(props);

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
        const id = this.props.match.params.id;

        const loader = new Loader(id);

        loader.load().then(results =>{
            this.setState({item:results.school, jobs:results.jobs, loading:false});
        });
    }

    componentWillUnmount(){
    }


    render(){
        const { item } = this.state;
        const { history } = this.props;
        const SavedDialog = this.savedDialog;

        return(
            <Fragment>
                {!this.state.loading &&
                <Form >
                    <FormSection justify="start">
                        <h3>School</h3>
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
                            <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.push(`/administration/job/create`)} caption="New"/>
                        </div>
                        <VerticalMenu
                            icon="baseline-work-24px.svg"
                            idField="Id"
                            captionField="Name"
                            defaultAction={(id) => this.props.history.push(`/administration/job/view/${id}`)}
                            menuActions={[
                                {caption:"Edit Job", onClick:(id) => this.props.history.push(`/administration/job/edit/${id}`), warning:false},
                                {caption:"View Job", onClick:(id) => this.props.history.push(`/administration/job/view/${id}`), warning:false},
                            ]}
                            data={this.state.jobs}
                        />
                    </FormSection>

                    <FormSection justify="end">
                        <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.push(`/administration/school/edit/${item.getKey()}`)} caption="Edit"/>
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
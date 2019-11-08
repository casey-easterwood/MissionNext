/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../../Elements/LinkButton';
import Form from '../../../../Elements/Form';
import FormGroup from '../../../../Elements/FormGroup';
import styles  from './styles.scss';
import FormSection from "../../../../Elements/FormSection";
import DataField from "../../../../../Data/Models/DataField";
import FormGroupTextArea from "../../../../Elements/FormGroupTextArea";

class Loader {
    id = 0;
    constructor(id){
        this.id = id;

        this.load = this.load.bind(this);
        this.loadJob = this.loadJob.bind(this);
    }

    load(id){
        const loader = this;

        let data = {
            job: null,
            description: null
        };

        return new Promise((resolve, reject) => {
            let getJob = loader.loadJob(id);
            let getDescription = loader.loadJobDescription(id);

            let promises = [
                getJob,
                getDescription
            ];

            Promise.all(promises).then((results) => {
                data.job = results[0];
                data.description = results[1];
                resolve(data);
            })
        });
    }

    loadJob(id) {
        return new Promise((resolve, reject) => {
            const handler = (event, data) => {
                if(event =="JOBS_LOADED"){
                    let job = window.dataProvider.jobs.getRow(id);

                    window.dataProvider.jobs.unsubscribe(this);

                    resolve(job);
                }
            };

            let job = window.dataProvider.jobs.getRow(id);

            if(job) {
                resolve(job);
            } else {
                window.dataProvider.jobs.subscribeToChanges(handler);
                window.dataProvider.jobs.getAll();
            }
        })
    }

    loadJobDescription(id) {
        return new Promise((resolve, reject) => {
            const handler = (event, data) => {
                if(event =="JOB_DESCRIPTION_LOADED"){
                    window.dataProvider.jobs.unsubscribe(this);

                    resolve(data);
                }
            };

            let description = window.dataProvider.jobs.getDescription(id);

            if(description) {
                resolve(description);
            } else {
                window.dataProvider.jobs.subscribeToChanges(handler);
                window.dataProvider.jobs.getDescription();
            }
        })
    }
}

class View extends Component {
    dataProvider = window.dataProvider.jobs;

    constructor(props) {
        super(props);

        this.state = {
            item: null,
            DescriptionId: null,
            Description: new DataField("Description", "string", "", false),
        }
    }

    componentDidMount(){
        const loader = new Loader();

        loader.load(this.props.match.params.jobId).then(data => {
            this.state.item = data.job;
            this.state.description = data.description;
            this.state.loading = false;

            this.setState(this.state);
        });
    }

    componentWillUnmount(){

    }

    render(){
        const { item } = this.state;

        return(
            <Fragment>
                {item != null &&
                    <Form save={this.save}>
                    <FormSection justify={"start"}>
                        <h3>Job Details</h3>
                        <FormGroup
                            id="Title"
                            label="Title"
                            readOnly={true}
                            value={item.fields['Title'].getValue()}
                        />
                        <FormGroup
                            id="Category"
                            label="Category"
                            readOnly={true}
                            value={item.fields['Category'].getValue() || ''}
                        />
                        <FormGroup
                            id="Location"
                            label="Location"
                            readOnly={true}
                            value={item.fields['Location'].getValue() || ''}
                        />
                        <FormGroup
                            id="Status"
                            label="Status"
                            readOnly={true}
                            value={item.fields['Status'].getValue() || ''}
                        />
                    </FormSection>
                    <FormSection justify={"stretch"}>
                        <h3>Job Description</h3>
                        <FormGroupTextArea
                            id={"JobDescription"}
                            label={"Job Description"}
                            readOnly={true}
                            value={this.state.description.fields["Description"].getValue()}
                        />
                    </FormSection>
                    <FormSection justify={"end"}>
                            <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.push(`/agency/job/edit/${item.getKey()}`)} caption="Edit"/>
                            <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.goBack()} caption="Close"/>
                    </FormSection>
                </Form>
                }
                {item == null &&
                    <h2>Loading...</h2>
                }
            </Fragment>
        );
    }
}

export default View
/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../Elements/LinkButton';
import Form from '../../../Elements/Form';
import FormGroup from '../../../Elements/FormGroup';
import styles  from './styles.scss';
import FormSection from "../../../Elements/FormSection";
import DataField from "../../../../Data/Models/DataField";
import FormGroupTextArea from "../../../Elements/FormGroupTextArea";

class View extends Component {
    dataProvider = window.dataProvider.jobs;

    constructor(props) {
        super(props);

        this.onFieldChange = this.onFieldChange.bind(this);
        this.providerHandler = this.providerHandler.bind(this);

        this.state = {
            item: null,
            DescriptionId: null,
            Description: new DataField("Description", "string", "", false),
        }
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);

        if(this.dataProvider.rows.length == 0){
            this.dataProvider.getAll()
        } else {
            const id = this.props.match.params.jobId;
            const item = this.dataProvider.getRow(id);

            this.dataProvider.getDescription(id);
            this.setState({item:item});
        }
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(message, data){
        if(message == "JOB_DESCRIPTION_LOADED"){
            if(data){
                this.state.DescriptionId = data.fields["Id"].getValue();
                this.state.Description.setValue(data.fields["Description"].getValue());
            }
        } else if(message == "JOBS_LOADED"){
            const id = this.props.match.params.jobId;
            this.state.item = this.dataProvider.getRow(id);

            this.dataProvider.getDescription(id);
        }

        this.setState(this.state);
    }

    onFieldChange(e){
        const { item } = this.state;
        const { id, value } = e.target;

        item.setFieldValue(id, value);
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
                            validationMessage={item.fields['Title'].getValidationMessage()}
                            onChange={(e) => item.fields['Title'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="Category"
                            label="Category"
                            readOnly={true}
                            value={item.fields['Category'].getValue() || ''}
                            validationMessage={item.fields['Category'].getValidationMessage()}
                            onChange={(e) => item.fields['Category'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="Location"
                            label="Location"
                            readOnly={true}
                            value={item.fields['Location'].getValue() || ''}
                            validationMessage={item.fields['Location'].getValidationMessage()}
                            onChange={(e) => item.fields['Location'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="Status"
                            label="Status"
                            readOnly={true}
                            value={item.fields['Status'].getValue() || ''}
                            validationMessage={item.fields['Status'].getValidationMessage()}
                            onChange={(e) => item.fields['Status'].setValue(e.target.value)}
                        />
                    </FormSection>
                    <FormSection justify={"stretch"}>
                        <h3>Job Description</h3>
                        <FormGroupTextArea
                            id={"JobDescription"}
                            label={"Job Description"}
                            readOnly={true}
                            value={this.state.Description.getValue()}
                            validationMessage={this.state.Description.getValidationMessage()}
                            onChange={(e) => {this.onFieldChange("Description",e.target.value)}}
                        />
                    </FormSection>
                    <FormSection justify={"end"}>
                            <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.push(`/job/edit/${item.getKey()}`)} caption="Edit"/>
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
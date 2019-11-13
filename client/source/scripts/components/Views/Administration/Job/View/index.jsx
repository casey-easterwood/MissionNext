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
import {VerticalMenuItem} from "../../../../Elements/VerticalMenu";
import FlexRow from "../../../../Elements/FlexRow";

class View extends Component {
    dataProvider = window.dataProvider.jobs;

    constructor(props) {
        super(props);

        this.onFieldChange = this.onFieldChange.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.getProfileData - this.getProfileData.bind(this);

        this.state = {
            item: null,
            profileData: []
        }
    }

    componentDidMount(){
        window.dataProvider.jobs.subscribeToChanges(this.providerHandler);

        if(window.dataProvider.jobs.rows.length == 0){
            window.dataProvider.jobs.getAll()
        } else {
            const id = this.props.match.params.jobId;
            const item = window.dataProvider.jobs.getRow(id);

            window.dataProvider.jobs.getProfileData(id);
            this.setState({item:item});
        }
    }

    componentWillUnmount(){
        window.dataProvider.jobs.unsubscribe(this.providerHandler);
    }

    providerHandler(message, data){

        if(message == "JOBS_LOADED"){
            const id = this.props.match.params.jobId;
            this.state.item = window.dataProvider.jobs.getRow(id);

            window.dataProvider.jobs.getProfileData(id);
        } else if (message == "JOB_PROFILE_LOADED") {
            this.state.profileData = data;
        }

        this.setState(this.state);
    }

    onFieldChange(e){
        const { item } = this.state;
        const { id, value } = e.target;

        item.setFieldValue(id, value);
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
        const { item, profileData } = this.state;

        return(
            <Fragment>
                {item != null &&
                    <Form save={this.save}>
                    <FormSection justify={"start"}>
                        <h3>Job Details</h3>
                        <FormGroup
                            id="Name"
                            label="Name"
                            readOnly={true}
                            value={item.fields['Name'].getValue()}
                            validationMessage={item.fields['Name'].getValidationMessage()}
                            onChange={(e) => item.fields['Name'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="Created"
                            label="Created"
                            readOnly={true}
                            value={item.fields['Created'].getValue() || ''}
                            validationMessage={item.fields['Created'].getValidationMessage()}
                            onChange={(e) => item.fields['Created'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="Updated"
                            label="Updated"
                            readOnly={true}
                            value={item.fields['Updated'].getValue() || ''}
                            validationMessage={item.fields['Updated'].getValidationMessage()}
                            onChange={(e) => item.fields['Updated'].setValue(e.target.value)}
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
                    <FormSection justify={"end"}>
                            <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.push(`/administration/job/edit/${item.getKey()}`)} caption="Edit"/>
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
/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../../Elements/LinkButton';
import Form from '../../../../Elements/Form';
import FormGroup from '../../../../Elements/FormGroup';
import styles  from './styles.scss';
import FormSection from "../../../../Elements/FormSection";
import ModalConfirm from "../../../../Elements/ModalConfirm";
import ModalFullscreen from "../../../../Elements/ModalFullscreen";

class EditForm extends Component {
    dataProvider = window.dataProvider.agencies;

    constructor(props) {
        super(props);

        this.providerHandler = this.providerHandler.bind(this);
        this.savedDialog = this.savedDialog.bind(this);
        this.save = this.save.bind(this);
        this.state = {
            fullscreen:false,
            loading: true,
            showSavedDialog: false,
            debounce: (new Date()).getTime()
        }
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);

        const id = this.props.match.params.id;
        let item = this.dataProvider.getRow(id);

        if(item == null){
            this.dataProvider.getAll()
        } else {
            this.setState({item:item, loading:false});
        }
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(message, data){
        if(message == "AGENCIES_LOADED"){
            const id = this.props.match.params.id;
            this.state.item = this.dataProvider.getRow(id);
            this.state.loading = false;
        } else if (message == "AGENCY_SAVED"){
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
                confirm={() => this.props.history.goBack()}
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
                            value={item.fields['ContactName'].getValue() || ''}
                            validationMessage={item.fields['ContactName'].getValidationMessage()}
                            onChange={(e) => item.fields['ContactName'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="Phone"
                            label="Phone"
                            value={item.fields['Phone'].getValue() || ''}
                            validationMessage={item.fields['Phone'].getValidationMessage()}
                            onChange={(e) => item.fields['Phone'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="Website"
                            label="Website"
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
                            value={item.fields['Address'].getValue() || ''}
                            validationMessage={item.fields['Address'].getValidationMessage()}
                            onChange={(e) => item.fields['Address'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="City"
                            label="City"
                            value={item.fields['City'].getValue() || ''}
                            validationMessage={item.fields['City'].getValidationMessage()}
                            onChange={(e) => item.fields['City'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="State"
                            label="State"
                            value={item.fields['State'].getValue() || ''}
                            validationMessage={item.fields['State'].getValidationMessage()}
                            onChange={(e) => item.fields['State'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="Country"
                            label="Country"
                            value={item.fields['Country'].getValue() || ''}
                            validationMessage={item.fields['Country'].getValidationMessage()}
                            onChange={(e) => item.fields['Country'].setValue(e.target.value)}
                        />
                    </FormSection>

                    <FormSection justify="end">
                        <LinkButton type={'secondary'} href="#" onClick={() => history.goBack()} caption="Close"/>
                        <LinkButton type={'primary'} href="#" onClick={this.save} caption="Save"/>
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

export default EditForm
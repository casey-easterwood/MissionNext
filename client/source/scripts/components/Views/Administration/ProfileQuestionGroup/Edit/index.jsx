/**
 * @var selectedItem
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../../Elements/LinkButton';
import Form from '../../../../Elements/Form';
import FormGroup from '../../../../Elements/FormGroup';
import styles  from './styles.scss';
import ModalConfirm from "../../../../Elements/ModalConfirm";

class EditQuestionScene extends Component {
    dataProvider = window.dataProvider.ProfileQuestionGroups;

    constructor(props) {
        super(props);

        this.getTitle = this.getTitle.bind(this);
        this.validate = this.validate.bind(this);
        this.savedDialog = this.savedDialog.bind(this);
        this.save = this.save.bind(this);
        this.providerHandler = this.providerHandler.bind(this);

        this.state = {
            loading: true,
            showSavedDialog: false,
            item: null
        }
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);

        if(this.dataProvider.rows.length == 0){
            this.dataProvider.getAll()
        } else {
            const id = this.props.match.params.id;
            const item = this.dataProvider.getRow(id);

            this.setState({item:item, loading:false});
        }
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        switch (event) {
            case "PROFILE_QUESTION_GROUP_LOADED":
                const id = this.props.match.params.id;
                this.state.item = this.dataProvider.getRow(id);
                this.state.loading = false;
                break;
            case "PROFILE_QUESTION_GROUP_SAVED":
                this.state.showSavedDialog = true;
                break;
        }
        this.setState(this.state);
    }

    getTitle(){
        return 'Edit Question Group';
    }

    fieldChange(fieldName, value){
        this.state.item.fields[fieldName].setValue(value);
        this.setState(this.state);
    }

    validate(){
        const isValid = this.state.item.validate();

        if(isValid)
            this.save();
    }

    save(){
        this.dataProvider.saveChanges();
    }

    savedDialog(){
        return (
            <ModalConfirm
                title={"Group Saved"}
                message={"The Group was successfully saved,"}
                confirm={() => this.props.history.push('/administration/profilequestiongroups')}
                open={this.state.showSavedDialog}
            />
        )
    }

    render(){
        const SavedDialog = this.savedDialog;
        const { item } = this.state;
        return (
            <Fragment>
                <SavedDialog />
                {!this.state.loading &&
                <Form title={this.getTitle()} save={this.validate}>
                    <FormGroup
                        id="Group"
                        label="Question Group"
                        value={item.fields["Name"].getValue()}
                        onChange={(e) => {
                            this.fieldChange("Name", e.target.value)
                        }}
                        validationMessage={item.fields["Name"].getValidationMessage()}
                    />

                    <div className={styles.buttonGroup}>
                        <LinkButton type='secondary' href="#" onClick={() => this.props.history.goBack()} caption="Cancel"/>
                        <LinkButton type='primary' href="#" onClick={this.validate} caption="Save"/>
                    </div>
                </Form>
                }

                {this.state.loading &&
                <h2>Loading....</h2>
                }
            </Fragment>

        )
    }
}

export default EditQuestionScene
/**
 * @var selectedItem
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../../Elements/LinkButton';
import Form from '../../../../Elements/Form';
import FormGroup from '../../../../Elements/FormGroup';
import styles  from './styles.scss';
import ModalConfirm from "../../../../Elements/ModalConfirm";

class Edit extends Component {
    constructor(props) {
        super(props);
        this.dataProvider = window.dataProvider.ProfileQuestions;

        this.getTitle = this.getTitle.bind(this);
        this.save = this.save.bind(this)
        this.savedDialog = this.savedDialog.bind(this);
        this.providerHandler = this.providerHandler.bind(this);

        this.state = {
            item: null,
            loading: true,
            showSavedDialog: false,
            groupId: 0
        }
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);

        if(this.dataProvider.rows.length == 0){
            this.dataProvider.getAll()
        } else {
            const id = this.props.match.params.id;
            const item = this.dataProvider.getRow(id);
            const groupId = item.fields["GroupId"].getValue();

            this.setState({item:item, loading:false, groupId:groupId});
        }
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        switch (event) {
            case "QUESTIONS_LOADED":
                const id = this.props.match.params.id;
                this.state.item = this.dataProvider.getRow(id);
                this.state.loading = false;
                this.state.groupId = item.fields["GroupId"].getValue();

                break;
            case "PROFILE_QUESTION_SAVED":
                this.state.showSavedDialog = true;
                break;
        }

        this.setState(this.state);
    }

    getTitle(){
        return 'Edit Question';
    }

    fieldChange(fieldName, value){
        this.state.item.fields[fieldName].setValue(value);
        this.setState(this.state);
    }

    save(){
        const isValid = this.state.item.validate();

        if(isValid)
            this.dataProvider.saveChanges();
    }

    savedDialog(){
        return (
            <ModalConfirm
                title={"Question Saved"}
                message={"The Question was successfully saved,"}
                confirm={() => this.props.history.push(`/administration/groupquestions/${this.state.groupId}`)}
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
                        id="Question"
                        label="Question"
                        value={item.fields["Question"].getValue()}
                        onChange={(e) => {this.fieldChange("Question",e.target.value)}}
                        validationMessage={item.fields["Question"].getValidationMessage()}
                    />

                    <div className={styles.buttonGroup}>
                        <LinkButton type='secondary' href="#" onClick={() => this.props.history.goBack()} caption="Cancel"/>
                        <LinkButton type='primary' href="#" onClick={this.save} caption="Save"/>
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

export default Edit
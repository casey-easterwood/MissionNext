/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../Elements/LinkButton';
import Form from '../../../Elements/Form';
import FormGroup from '../../../Elements/FormGroup';
import styles  from './styles.scss';
import DataField from "../../../../Data/Models/DataField";
import ModalConfirm from "../../../Elements/ModalConfirm";

class Create extends Component {
    dataProvider = window.dataProvider.ProfileQuestions;

    constructor(props) {
        super(props);

        this.getTitle = this.getTitle.bind(this);
        this.checkQuestion = this.checkQuestion.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.savedDialog = this.savedDialog.bind(this);
        this.create = this.create.bind(this);

        this.state = {
            mode: "GROUPNAME",
            Question: new DataField("Question", "string", '', false),
        }
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data) {
        if(event == "PROFILE_QUESTION_CREATED") {
            this.setState({showSavedDialog:true})
        }
    }

    getTitle(){
        return 'Create Question';
    }

    fieldChange(fieldName, value){
        let field = this.state[fieldName];
        field.setValue(value);

        this.setState(this.state);
    }

    checkQuestion(){
        let question = this.state["Question"];

        if(question.getValue().length < 5){
            question.setValidationMessage("Requires minimum of 5 chars");
        } else {
            this.create();
        }

        this.setState({Title: name});
    }

    create(){
        const groupId = this.props.match.params.groupId;

        let data = [];

        data.push({name:"Question", value: this.state.Question.getValue()});
        data.push({name:"GroupId", value: groupId});

        this.dataProvider.create(data);
    }

    savedDialog(){
        const groupId = this.props.match.params.groupId;

        return (
            <ModalConfirm
                title={"Question group created"}
                message={"The Group was successfully created,"}
                confirm={() => this.props.history.replace(`/groupquestions/${groupId}`)}
                open={this.state.showSavedDialog}
            />
        )
    }

    render(){
        const SavedDialog = this.savedDialog;

        return (
            <Fragment>
                <SavedDialog />
                <Form title={this.getTitle()} save={this.checkQuestion}>
                    <FormGroup
                        id="Question"
                        label="Question"
                        value={this.state["Question"].getValue()}
                        onChange={(e) => {this.fieldChange("Question",e.target.value)}}
                        validationMessage={this.state["Question"].getValidationMessage()}
                    />

                    <div className={styles.buttonGroup}>
                        <LinkButton type='secondary' href="#" onClick={this.props.onClickBack} caption="Cancel"/>
                        <LinkButton type='primary' href="#" onClick={this.checkQuestion} caption="Create"/>
                    </div>
                </Form>
            </Fragment>
        )
    }
}

export default Create
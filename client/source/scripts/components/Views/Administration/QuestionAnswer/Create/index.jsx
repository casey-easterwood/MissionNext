/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../../Elements/LinkButton';
import Form from '../../../../Elements/Form';
import FormGroup from '../../../../Elements/FormGroup';
import styles  from './styles.scss';
import DataField from "../../../../../Data/Models/DataField";
import ModalConfirm from "../../../../Elements/ModalConfirm";

class Create extends Component {
    dataProvider = window.dataProvider.ProfileQuestionsAnswers;

    constructor(props) {
        super(props);

        this.getTitle = this.getTitle.bind(this);
        this.checkQuestion = this.checkQuestion.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.savedDialog = this.savedDialog.bind(this);
        this.create = this.create.bind(this);

        this.state = {
            Answer: new DataField("Answer", "string", '', false),
            creating: false
        }
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data) {
        if(event == "PROFILE_QUESTION_ANSWER_CREATED") {
            this.setState({showSavedDialog:true})
        }
    }

    getTitle(){
        return 'Create Answers';
    }

    fieldChange(fieldName, value){
        let field = this.state[fieldName];
        field.setValue(value);

        this.setState(this.state);
    }

    checkQuestion(){
        let answer = this.state["Answer"];

        if(answer.getValue().length < 2){
            answer.setValidationMessage("Requires minimum of 2 chars");
        } else {
            this.create();
        }

        this.setState({Answer: answer});
    }

    create(){
        if(this.state.creating) return;

        const questionId = this.props.match.params.questionId;

        let data = [];

        data.push({name:"Answer", value: this.state.Answer.getValue()});
        data.push({name:"QuestionId", value: questionId});

        this.dataProvider.create(data);
        this.setState({creating:true});
    }

    savedDialog(){
        const groupId = this.props.match.params.groupId;
        const questionId = this.props.match.params.questionId;

        return (
            <ModalConfirm
                title={"Answer created"}
                message={"The Answer was successfully created,"}
                confirm={() => this.props.history.replace(`/administration/questionanswers/${groupId}/${questionId}`)}
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
                        id="Answer"
                        label="Answer"
                        value={this.state["Answer"].getValue()}
                        onChange={(e) => {this.fieldChange("Answer",e.target.value)}}
                        validationMessage={this.state["Answer"].getValidationMessage()}
                    />

                    <div className={styles.buttonGroup}>
                        <LinkButton type='secondary' href="#" onClick={() => this.props.history.goBack()} caption="Cancel"/>
                        <LinkButton type='primary' href="#" onClick={this.checkQuestion} caption="Create"/>
                    </div>
                </Form>
            </Fragment>
        )
    }
}

export default Create
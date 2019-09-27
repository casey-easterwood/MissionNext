/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../Elements/LinkButton';
import Form from '../../../Elements/Form';
import FormGroup from '../../../Elements/FormGroup';
import FormSection from '../../../Elements/FormSection';
import styles  from './styles.scss';
import ModalConfirm from "../../../Elements/ModalConfirm";
import QuestionButton from "../../../Elements/QuestionButton";
import Modal from "../../../Elements/Modal";
import VerticalNavMenu from "../../../Elements/VerticalNavMenu";
import VerticalMenu from "../../../Elements/VerticalMenu";
import Content from "../../../Elements/Layout/Content";


class Loader {
    id = 0;

    constructor(id) {
        this.id = id;

        this.load = this.load.bind(this);
        this.loadCandidate = this.loadCandidate.bind(this);
        this.loadQuestionGroups = this.loadQuestionGroups.bind(this);
        this.loadQuestions = this.loadQuestions.bind(this);
        this.loadAnswers = this.loadAnswers.bind(this);
    }

    load() {
        const loader = this;

        let data = {
            candidate: null,
            questionGroups: [],
            questions: [],
            answers: []
        };

        return new Promise((resolve, reject) => {
            let getCandidate = loader.loadCandidate(loader.id);
            let getQuestionGroups = loader.loadQuestionGroups();
            let getQuestions = loader.loadQuestions();
            let getAnswers = loader.loadAnswers();

            let promises = [
                getCandidate,
                getQuestionGroups,
                getQuestions,
                getAnswers
            ];

            Promise.all(promises).then((results) => {
                data.candidate = results[0];
                data.questionGroups = results[1];
                data.questions = results[2];
                data.answers = results[3];
                resolve(data);
            })
        });
    }

    loadCandidate(id) {
        return new Promise((resolve, reject) => {
            let item = window.dataProvider.candidates.getRow(id);

            const handler = (event, data) => {
                if (event == "CANDIDATES_LOADED") {
                    item = window.dataProvider.candidates.getRow(id);

                    window.dataProvider.candidates.unsubscribe(this);

                    resolve(item);
                }
            };

            if (item == null) {
                window.dataProvider.candidates.subscribeToChanges(handler);
                window.dataProvider.candidates.getAll();
            } else {
                resolve(item);
            }
        })
    }

    loadQuestionGroups() {
        return new Promise((resolve, reject) => {
            let items = [];

            const handler = (event, data) => {
                if (event == "PROFILE_QUESTION_GROUP_LOADED") {
                    items = window.dataProvider.ProfileQuestionGroups.rows;

                    window.dataProvider.ProfileQuestionGroups.unsubscribe(this);

                    resolve(items);
                }
            };

            window.dataProvider.ProfileQuestionGroups.subscribeToChanges(handler);
            window.dataProvider.ProfileQuestionGroups.getAll();
        })
    }

    loadQuestions() {
        return new Promise((resolve, reject) => {
            let items = [];

            const handler = (event, data) => {
                if (event == "QUESTIONS_LOADED") {
                    items = window.dataProvider.ProfileQuestions.rows;

                    window.dataProvider.ProfileQuestions.unsubscribe(this);

                    resolve(items);
                }
            };

            window.dataProvider.ProfileQuestions.subscribeToChanges(handler);
            window.dataProvider.ProfileQuestions.getAll();
        })
    }

    loadAnswers() {
        return new Promise((resolve, reject) => {
            let items = [];

            const handler = (event, data) => {
                if (event == "QUESTION_ANSWERS_LOADED") {
                    items = window.dataProvider.ProfileQuestionsAnswers.rows;

                    window.dataProvider.ProfileQuestionsAnswers.unsubscribe(this);

                    resolve(items);
                }
            };

            window.dataProvider.ProfileQuestionsAnswers.subscribeToChanges(handler);
            window.dataProvider.ProfileQuestionsAnswers.getAll();
        })
    }
}

class View extends Component {
    dataProvider = window.dataProvider.candidates;

    constructor(props) {
        super(props);

        this.providerHandler = this.providerHandler.bind(this);
        this.savedDialog = this.savedDialog.bind(this);
        this.answerDialog = this.answerDialog.bind(this);
        this.showAnswerDialog = this.showAnswerDialog.bind(this);
        this.closeAnswerDialog = this.closeAnswerDialog.bind(this);
        this.selectAnswer = this.selectAnswer.bind(this);
        this.getAnswer = this.getAnswer.bind(this);
        this.save = this.save.bind(this);

        this.state = {
            item: null,
            questionGroups: [],
            questions: [],
            answers:[],
            selectedAnswers:[],
            loading: true,
            showSavedDialog: false,
            showAnswerDialog: false,
            selectedQuestionId: 0,
            debounce: (new Date()).getTime()
        }
    }

    componentDidMount(){
        const loader = new Loader(this.props.match.params.id);

        loader.load().then(data => {
            this.state.item = data.candidate;
            this.state.questionGroups = data.questionGroups;
            this.state.questions = data.questions;
            this.state.answers = data.answers;
            this.state.loading = false;

            this.setState(this.state);
        });

        this.dataProvider.subscribeToChanges(this.providerHandler);
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(message, data){
        if (message == "CANDIDATE_SAVED"){
            this.state.showSavedDialog = true;
        }

        this.setState(this.state);
    }

    save(){
        if((new Date()).getTime() > this.state.debounce) {
            const {item} = this.state;

            if(!item.validate()) return;

            if(!item.isDirty())
                this.providerHandler("CANDIDATE_SAVED", null);
            else
                this.dataProvider.saveChanges();
        }

        this.setState({debounce: (new Date()).getTime() + 3000});
    }

    showAnswerDialog(id){
        this.state.selectedQuestionId = id;
        this.state.showAnswerDialog = true;

        this.setState(this.state);
    }

    closeAnswerDialog(){
        this.setState({showAnswerDialog:false});
    }

    selectAnswer(id){
        let answer = this.state.answers.find(answer => answer.getKey() == id);

        this.state.selectedAnswers.push(answer);
        this.state.showAnswerDialog = false;
        this.setState(this.state);

    }

    answerDialog(){
        let filteredAnswers = this.state.answers.filter(answer => answer.fields["QuestionId"].getValue() == this.state.selectedQuestionId);

        return (
            <Modal
                open={this.state.showAnswerDialog}
                close={() => this.closeAnswerDialog()}
            >
                <h2>Choose A Answer</h2>
                <VerticalMenu
                    icon={null}
                    idField="Id"
                    captionField="Answer"
                    defaultAction={(id) => this.selectAnswer(id)}
                    menuActions={null}
                    data={filteredAnswers}
                />
            </Modal>
        )
    }

    savedDialog(){
        return (
            <ModalConfirm
                title={"Candidate Saved"}
                message={"The Candidate was successfully saved,"}
                confirm={() => this.props.history.goBack()}
                open={this.state.showSavedDialog}
            />
        )
    }

    getAnswer(questionId) {
        const answer = this.state.selectedAnswers.find(answer => answer.fields["QuestionId"].getValue() == questionId);

        if(answer)
            return answer.fields["Answer"].getValue();
        else
            return "";
    }

    render(){
        const { item } = this.state;
        const SavedDialog = this.savedDialog;
        const AnswerDialog = this.answerDialog;

        return(
            <Fragment>
                <AnswerDialog/>
                <SavedDialog />
                {this.state.loading &&
                    <h2>Loading....</h2>
                }

                {!this.state.loading &&
                    <Form  save={this.save}>
                        <FormSection justify="start">
                            <h3>Candidate Information</h3>
                            <FormGroup
                                id="Name"
                                label="Name"
                                readOnly={true}
                                value={item.fields['Name'].getValue()}
                                validationMessage = {item.fields['Name'].getValidationMessage()}
                                onChange={(e) => item.fields['Name'].setValue(e.target.value)}
                            />
                            <FormGroup
                                id="Phone"
                                label="Phone"
                                readOnly={true}
                                value={item.fields['Phone'].getValue() || ''}
                                validationMessage = {item.fields['Phone'].getValidationMessage()}
                                onChange={(e) => item.fields['Phone'].setValue(e.target.value)}
                            />
                            <FormGroup
                                id="Email"
                                label="Email"
                                readOnly={true}
                                value={item.fields['Email'].getValue() || ''}
                                validationMessage = {item.fields['Email'].getValidationMessage()}
                                onChange={(e) => item.fields['Email'].setValue(e.target.value)}
                            />
                        </FormSection>
                        <FormSection justify="start">
                            <h3>Mailing Address</h3>
                            <FormGroup
                                id="Address"
                                label="Address"
                                readOnly={true}
                                value={item.fields['Address'].getValue() || ''}
                                validationMessage = {item.fields['Address'].getValidationMessage()}
                                onChange={(e) => item.fields['Address'].setValue(e.target.value)}
                            />
                            <FormGroup
                                id="City"
                                label="City"
                                readOnly={true}
                                value={item.fields['City'].getValue() || ''}
                                validationMessage = {item.fields['City'].getValidationMessage()}
                                onChange={(e) => item.fields['City'].setValue(e.target.value)}
                            />
                            <FormGroup
                                id="State"
                                label="State"
                                readOnly={true}
                                value={item.fields['State'].getValue() || ''}
                                validationMessage = {item.fields['State'].getValidationMessage()}
                                onChange={(e) => item.fields['State'].setValue(e.target.value)}
                            />
                            <FormGroup
                                id="PostalCode"
                                label="Postal Code"
                                readOnly={true}
                                value={item.fields['PostalCode'].getValue() || ''}
                                validationMessage = {item.fields['PostalCode'].getValidationMessage()}
                                onChange={(e) => item.fields['PostalCode'].setValue(e.target.value)}
                            />
                        </FormSection>

                        {this.state.questionGroups.map(group =>
                            <FormSection justify={"start"} key={group.fields["Id"].getValue()}>
                                <h3>{group.fields["Name"].getValue()}</h3>
                                <ul className={styles.questionList}>
                                    {this.state.questions.filter((question) =>
                                        group.getKey() == question.fields["GroupId"].getValue())
                                        .map(question =>
                                            <li key={question.getKey()}>
                                                <div className={styles.question}>
                                                    {question.fields["Question"].getValue()}
                                                </div>
                                                <div className={styles.answer}>
                                                    {this.getAnswer(question.getKey())}
                                                </div>
                                            </li>
                                    )}
                                </ul>
                            </FormSection>
                        )}

                        <FormSection justify="end">
                            <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.push(`/candidate/edit/${item.getKey()}`)} caption="Edit"/>
                            <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.goBack()}  caption="Close"/>
                        </FormSection>
                    </Form>
                }
            </Fragment>
        )
    }
}

export default View
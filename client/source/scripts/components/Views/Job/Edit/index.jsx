/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../Elements/LinkButton';
import Form from '../../../Elements/Form';
import FormGroup from '../../../Elements/FormGroup';
import styles  from './styles.scss';
import FormSection from "../../../Elements/FormSection";
import FormGroupButton from "../../../Elements/FormGroupButton";
import FormGroupTextArea from "../../../Elements/FormGroupTextArea";
import DataField from "../../../../Data/Models/DataField";
import Modal from "../../../Elements/Modal"
import ModalConfirm from "../../../Elements/ModalConfirm";
import VerticalNavMenu from "../../../Elements/VerticalNavMenu";
import QuestionButton from "../../../Elements/QuestionButton";
import VerticalMenu from "../../../Elements/VerticalMenu";

class Loader {
    id = 0;
    constructor(id){
        this.id = id;

        this.load = this.load.bind(this);
        this.loadJob = this.loadJob.bind(this);
        this.loadDescription = this.loadDescription.bind(this);
        this.loadCategories = this.loadCategories.bind(this);
    }

    load(){
        const loader = this;

        let data = {
            job: null,
            categories: null,
            description: {
              id: null,
              value: null
            },
            questionGroups: [],
            questions: [],
            answers: []
        };

        return new Promise((resolve, reject) => {
            let getJob = loader.loadJob(loader.id);
            let getDescription = loader.loadDescription(loader.id);
            let getCategories = loader.loadCategories();
            let getQuestionGroups = loader.loadQuestionGroups();
            let getQuestions = loader.loadQuestions();
            let getAnswers = loader.loadAnswers();

            let promises = [
                getJob,
                getDescription,
                getCategories,
                getQuestionGroups,
                getQuestions,
                getAnswers
            ];


            Promise.all(promises).then((results) => {
                data.job = results[0];

                if(results[1] == null){
                    data.description.id = null;
                    data.description.value = "";
                } else {
                    data.description.id = results[1].fields["Id"].getValue();
                    data.description.value = results[1].fields["Description"].getValue();
                }

                data.categories = results[2];
                data.questionGroups = results[3];
                data.questions = results[4];
                data.answers = results[5];

                resolve(data);
            })
        });
    }

    loadJob(jobId) {
        return new Promise((resolve, reject) => {
            let job = window.dataProvider.jobs.getRow(jobId);

            const handler = (event, data) => {
                if(event =="JOBS_LOADED"){
                    job = window.dataProvider.jobs.getRow(jobId);

                    window.dataProvider.jobs.unsubscribe(this);

                    resolve(job);
                }
            };

            if(job == null){
                window.dataProvider.jobs.subscribeToChanges(handler);
                window.dataProvider.jobs.getAll();
            } else {
                resolve(job);
            }
        })
    }

    loadDescription(jobId) {
        return new Promise((resolve, reject) => {
            const handler = (event, data) => {
                if(event =="JOB_DESCRIPTION_LOADED"){
                    let description = data;

                    window.dataProvider.jobs.unsubscribe(this);

                    resolve(description);
                }
            };

            window.dataProvider.jobs.subscribeToChanges(handler);
            window.dataProvider.jobs.getDescription(jobId);
        })
    }

    loadCategories() {
        return new Promise((resolve, reject) => {
            const handler = (event, data) => {
                if(event == "JOB_CATEGORIES_LOADED"){
                    let categories = [];

                    window.dataProvider.JobCategories.rows.map((category) =>{
                        categories.push(
                            {Id: category.fields["Id"].getValue(), Name: category.fields["Name"].getValue()}
                        )
                    });

                    window.dataProvider.JobCategories.unsubscribe(this);
                    resolve(categories);
                }
            };

            window.dataProvider.JobCategories.subscribeToChanges(handler);
            window.dataProvider.JobCategories.getAll();
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

class Edit extends Component {
    dataProvider = window.dataProvider.jobs;
    categoriesProvider = window.dataProvider.JobCategories;
    jobDescription = null;

    constructor(props) {
        super(props);

        this.providerHandler = this.providerHandler.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.openCategoryDialog = this.openCategoryDialog.bind(this);
        this.closeCategoryDialog = this.closeCategoryDialog.bind(this);
        this.categoryDialog = this.categoryDialog.bind(this);
        this.savedDialog = this.savedDialog.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
        this.getAnswer = this.getAnswer.bind(this);
        this.showAnswerDialog = this.showAnswerDialog.bind(this);
        this.closeAnswerDialog = this.closeAnswerDialog.bind(this);
        this.selectAnswer = this.selectAnswer.bind(this);
        this.answerDialog = this.answerDialog.bind(this);
        this.save = this.save.bind(this);

        this.state = {
            loading: true,
            showDialog: false,
            showSavedDialog: false,
            item: null,
            categories: [],
            debounce: (new Date()).getTime(),
            DescriptionId: null,
            Description: new DataField("Description", "string", "", false),
            questionGroups: [],
            questions: [],
            answers:[],
            selectedAnswers:[],
            showAnswerDialog: false,
            selectedQuestionId: 0,
        }
    }

    openCategoryDialog(){
        this.setState({showDialog:true});
    }

    closeCategoryDialog(){
        this.setState({showDialog:false});
    }

    selectCategory(id){
        let category = this.state.categories.find((item) => item.Id == id);

        this.state.item.fields["CategoryId"].setValue(category.Id);
        this.state.item.fields["Category"].setValue(category.Name);

        this.setState(this.state);
    }

    componentDidMount(){
        const loader = new Loader(this.props.match.params.jobId);

        loader.load().then(data => {
            this.state.item = data.job;
            this.state.DescriptionId = data.description.id;
            this.state.Description.setValue(data.description.value);
            this.state.categories = data.categories;
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
        this.categoriesProvider.unsubscribe(this.categoriesProviderHandler);
    }

    providerHandler(message, data){
        if(message == "JOB_DESCRIPTION_CREATED"){
            this.state.DescriptionId = data;
        }

        this.setState(this.state);
    }

    onFieldChange(fieldName, value){
        let field = this.state[fieldName];
        field.setValue(value);

        this.setState(this.state);
    }

    save(){
        if((new Date()).getTime() > this.state.debounce) {
            const {item} = this.state;
            let jobId = item.fields["Id"].getValue();
            let description = this.state.Description.getValue();

            if(item.isDirty() && item.validate())
                this.dataProvider.saveChanges();

            if(!this.state.DescriptionId)
                this.dataProvider.createDescription(jobId, description);
            else
                this.dataProvider.saveDescription(jobId, description);

            this.setState({showSavedDialog:true});
        }

        this.setState({debounce: (new Date()).getTime() + 3000});
    }

    categoryDialog(){
        return (
            <Modal open={this.state.showDialog}
                   close={this.closeCategoryDialog}>
                <h2>Choose A Category</h2>
                <VerticalNavMenu
                    idField="Id"
                    captionField="Name"
                    defaultAction={(id) => this.selectCategory(id)}
                    data={this.state.categories}
                />
            </Modal>
        )
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

        //remove existing answer
        let selectedQuestionId = answer.fields["QuestionId"].getValue();
        for(let i=0;i<this.state.selectedAnswers.length;i++){
            const questionId = this.state.selectedAnswers[i].fields["QuestionId"].getValue();

            if(selectedQuestionId == questionId){
                this.state.selectedAnswers.splice(i,1);
                break;
            }
        }

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
                title={"Job Saved"}
                message={"The job was successfully saved,"}
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

        const CategoryDialog = this.categoryDialog;
        const SavedDialog = this.savedDialog;
        const AnswerDialog = this.answerDialog;

        return(
            <Fragment>
                <AnswerDialog/>
                <CategoryDialog />
                <SavedDialog />
                {this.state.loading &&
                <h2>Loading....</h2>
                }

                {!this.state.loading &&
                <Form save={this.save}>
                    <FormSection justify={"start"}>
                        <h3>Job Details</h3>
                        <FormGroup
                            id="Title"
                            label="Title"
                            value={item.fields['Title'].getValue()}
                            validationMessage = {item.fields['Title'].getValidationMessage()}
                            onChange={(e) => item.fields['Title'].setValue(e.target.value)}
                        />
                        <FormGroupButton
                            id="Category"
                            label="Category"
                            value={item.fields['Category'].getValue() || ''}
                            validationMessage = {item.fields['Category'].getValidationMessage()}
                            onChange={(e) => item.fields['Category'].setValue(e.target.value)}
                            onClick={() => this.openCategoryDialog()}
                        />
                        <FormGroup
                            id="Location"
                            label="Location"
                            value={item.fields['Location'].getValue() || ''}
                            validationMessage = {item.fields['Location'].getValidationMessage()}
                            onChange={(e) => item.fields['Location'].setValue(e.target.value)}
                        />
                        <FormGroup
                            id="Status"
                            label="Status"
                            value={item.fields['Status'].getValue() || ''}
                            validationMessage = {item.fields['Status'].getValidationMessage()}
                            onChange={(e) => item.fields['Status'].setValue(e.target.value)}
                        />
                    </FormSection>
                    <FormSection justify={"stretch"}>
                        <h3>Job Description</h3>
                        <FormGroupTextArea
                            id={"JobDescription"}
                            label={"Job Description"}
                            value={this.state.Description.getValue()}
                            validationMessage={this.state.Description.getValidationMessage()}
                            onChange={(e) => {this.onFieldChange("Description",e.target.value)}}
                        />
                    </FormSection>

                    <h3 className={styles.requirementsHeader}>Job Requirements</h3>
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

                                                <QuestionButton
                                                    type={this.getAnswer(question.getKey()) ? 'primary' : 'secondary'}
                                                    onClick={() => this.showAnswerDialog(question.getKey())}
                                                    caption="Answer"/>
                                            </div>
                                            <div className={styles.answer}>
                                                {this.getAnswer(question.getKey())}
                                            </div>
                                        </li>
                                    )}
                            </ul>
                        </FormSection>
                    )}

                    <FormSection justify={"end"}>
                        <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.goBack()}  caption="Close"/>
                        <LinkButton type={'primary'} href="#" onClick={this.save} caption="Save"/>
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

export default Edit
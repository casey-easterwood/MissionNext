/**
 * @var auth
 */

import React, {Component} from 'react';
import Main from '../../Elements/Layout/Main';
// import styles from './styles.scss';
import ToolBar from "../../Elements/ToolBar";
import Content from "../../Elements/Layout/Content";
import ToolbarButton from "../../Elements/ToolbarButton";
import VerticalMenu from "../../Elements/VerticalMenu";
import {BackButton} from "../../Elements/BackButton";

class QuestionAnswers extends Component {
    state = {
        loading: true,
    };

    dataProvider = window.dataProvider.ProfileQuestionsAnswers;
    constructor(props) {
        super(props);

        this.providerHandler = this.providerHandler.bind(this);
    };

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);
        this.dataProvider.getAll();
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        if(event == "QUESTION_ANSWERS_LOADED")
            this.setState({loading:false});
    }

    render(){
        let groupId = this.props.match.params.groupId || 0;
        let questionId = this.props.match.params.questionId || 0;

        let menuActions = [
            {caption:"Edit Answer", onClick:(id) => this.props.history.push(`/questionanswer/edit/${groupId}/${id}`), warning:false},
        ];

        return(
            <Main>
                <ToolBar>
                    <BackButton onClick={() => this.props.history.replace(`/groupquestions/${groupId}`)}/>

                    <div>Question Answers</div>

                    <ToolbarButton caption={'New'} onClick={() => this.props.history.push(`/questionanswer/create/${groupId}/${questionId}`)}/>
                </ToolBar>
                <Content>
                    <VerticalMenu
                        icon="baseline-person-24px.svg"
                        idField="Id"
                        captionField="Answer"
                        defaultAction={(id) => this.props.history.push(`/questionanswer/edit/${groupId}/${id}`)}
                        menuActions={menuActions}
                        data={this.dataProvider.getByQuestion(questionId)}
                    />
                </Content>
            </Main>
        );
    }
}

export default QuestionAnswers
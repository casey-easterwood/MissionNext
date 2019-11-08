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

class ProfileQuestionGroups extends Component {
    state = {
        loading: true,
    };

    dataProvider = window.dataProvider.ProfileQuestions;
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
        if(event == "QUESTIONS_LOADED")
            this.setState({loading:false});
    }

    render(){
        let groupId = this.props.match.params.id || 0;

        let menuActions = [
            {caption:"Edit Question", onClick:(id) => this.props.history.push(`/groupquestion/edit/${id}`), warning:false},
        ];

        return(
            <Main>
                <ToolBar>
                    <BackButton onClick={() => this.props.history.replace('/profilequestiongroups')}/>

                    <div>Group Questions</div>

                    <ToolbarButton caption={'New'} onClick={() => this.props.history.push(`/groupquestion/create/${groupId}`)}/>
                </ToolBar>
                <Content>
                    <VerticalMenu
                        icon="baseline-person-24px.svg"
                        idField="Id"
                        captionField="Question"
                        defaultAction={(id) => this.props.history.push(`/questionanswers/${groupId}/${id}`)}
                        menuActions={menuActions}
                        data={this.dataProvider.getByGroup(groupId)}
                    />
                </Content>
            </Main>
        );
    }
}

export default ProfileQuestionGroups
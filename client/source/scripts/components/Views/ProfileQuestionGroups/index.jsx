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
        AgencyFilter: '',
    };

    dataProvider = window.dataProvider.ProfileQuestionGroups;
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
        if(event == "PROFILE_QUESTION_GROUP_LOADED")
            this.setState({loading:false});
    }

    render(){

        let menuActions = [
            {caption:"Edit Group", onClick:(id) => this.props.history.push(`/profilequestiongroup/edit/${id}`), warning:false},
        ];

        return(
            <Main>
                <ToolBar>
                    <BackButton onClick={() => this.props.history.replace('/administration')}/>

                    <div>Question Groups</div>

                    <ToolbarButton caption={'New'} onClick={() => this.props.history.push(`/profilequestiongroup/create`)}/>
                </ToolBar>
                <Content>
                    <VerticalMenu
                        icon="baseline-person-24px.svg"
                        idField="Id"
                        captionField="Name"
                        defaultAction={(id) => this.props.history.push(`/groupquestions/${id}`)}
                        menuActions={menuActions}
                        data={this.dataProvider.rows}
                    />
                </Content>
            </Main>
        );
    }
}

export default ProfileQuestionGroups
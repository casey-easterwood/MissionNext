import React, {Component} from "react";
import Main from "../../../Elements/Layout/Main";
import ToolBar from "../../../Elements/ToolBar";
import {BackButton} from "../../../Elements/BackButton";
import ToolbarButton from "../../../Elements/ToolbarButton";
import {Route, Switch} from "react-router";
import Edit from "./Edit"
import Create from "./Create"
import Content from "../../../Elements/Layout/Content";

class ProfileQuestionGroup extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        let {match, history} = this.props;
        return(
            <Main>
                <ToolBar>
                    <BackButton onClick={() => history.goBack()}/>
                    <h3>Question Groups</h3>
                    <ToolbarButton caption={'New'} onClick={() => history.push("/administration/profilequestiongroup/create")}/>
                </ToolBar>
                <Content>
                    <Switch>
                        <Route path={'/administration/profilequestiongroup/edit/:id'} component={Edit} />
                        <Route path={'/administration/profilequestiongroup/create'} component={Create} />
                    </Switch>
                </Content>
            </Main>
        );
    }
}

export default ProfileQuestionGroup
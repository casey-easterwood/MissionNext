import React, {Component} from "react";
import Main from "../../Elements/Layout/Main";
import ToolBar from "../../Elements/ToolBar";
import {BackButton} from "../../Elements/BackButton";
import ToolbarButton from "../../Elements/ToolbarButton";
import {Route, Switch} from "react-router";
import Edit from "./Edit"
import Create from "./Create"
import Content from "../../Elements/Layout/Content";

class QuestionAnswer extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        let {match, history} = this.props;
        return(
            <Main>
                <ToolBar>
                    <BackButton onClick={() => history.goBack()}/>
                    <h3>Question Answers</h3>
                    <ToolbarButton caption={'New'} onClick={() => history.push("/questionanswer/create")}/>
                </ToolBar>
                <Content>
                    <Switch>
                        <Route path={'/questionanswer/edit/:groupId/:id'} component={Edit} />
                        <Route path={'/questionanswer/create/:groupId/:questionId'} component={Create} />
                    </Switch>
                </Content>
            </Main>
        );
    }
}

export default QuestionAnswer
import React, {Component} from "react";
import Main from "../../Elements/Layout/Main";
import ToolBar from "../../Elements/ToolBar";
import {BackButton} from "../../Elements/BackButton";
import ToolbarButton from "../../Elements/ToolbarButton";
import {Route, Switch} from "react-router";
import Edit from "./Edit"
import Create from "./Create"
import Content from "../../Elements/Layout/Content";

class GroupQuestion extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        let {match, history} = this.props;
        return(
            <Main>
                <ToolBar>
                    <BackButton onClick={() => history.replace('/profilequestiongroups')}/>
                    <h3>Profile Questions</h3>
                    <ToolbarButton caption={'New'} onClick={() => history.push("/groupquestion/create")}/>
                </ToolBar>
                <Content>
                    <Switch>
                        <Route path={'/groupquestion/edit/:id'} component={Edit} />
                        <Route path={'/groupquestion/create/:groupId'} component={Create} />
                    </Switch>
                </Content>
            </Main>
        );
    }
}

export default GroupQuestion
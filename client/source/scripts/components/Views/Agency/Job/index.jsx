import React, {Component} from "react";
import Main from "../../../Elements/Layout/Main";
import ToolBar from "../../../Elements/ToolBar";
import {BackButton} from "../../../Elements/BackButton";
import ToolbarButton from "../../../Elements/ToolbarButton";
import {Route, Switch} from "react-router";
import View from "./View"
import Edit from "./Edit"
import Create from "./Create"
import Content from "../../../Elements/Layout/Content";

class Jobs extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        let {match, history} = this.props;
        return(
            <Main>
                <ToolBar>
                    <BackButton onClick={() => history.goBack()}/>
                    <h2>Jobs</h2>
                    <ToolbarButton caption={'New'} onClick={() => history.push("/agency/job/create")}/>
                </ToolBar>
                <Content>
                    <Switch>
                        <Route path={'/agency/job/view/:jobId'} component={View} />
                        <Route path={'/agency/job/edit/:jobId'} component={Edit} />
                        <Route path={'/agency/job/create'} component={Create} />
                    </Switch>
                </Content>
            </Main>
        );
    }
}

export default Jobs
import React, {Component, Fragment} from "react";
import Main from "../../../Elements/Layout/Main";
import ToolBar from "../../../Elements/ToolBar";
import {BackButton} from "../../../Elements/BackButton";
import ToolbarButton from "../../../Elements/ToolbarButton";
import Content from "../../../Elements/Layout/Content";
import {Route, Switch} from "react-router";
import Edit from "./Edit";
import Create from "./Create";
import View from "./View";

class Candidate extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        let {match, history} = this.props;
        return(
            <Main>
                <ToolBar>
                    <BackButton onClick={() => history.goBack()}/>
                    <h2>Candidates</h2>
                    <ToolbarButton caption={'New'} onClick={() => history.push("/administration/candidate/create")}/>
                </ToolBar>
                <Content>
                    <Switch>
                        <Route path={'/administration/candidate/edit/:id'} component={Edit} />
                        <Route path={'/administration/candidate/view/:id'} component={View} />
                        <Route path={'/administration/candidate/create'} component={Create} />
                    </Switch>
                </Content>
            </Main>
        );
    }
}

export default Candidate
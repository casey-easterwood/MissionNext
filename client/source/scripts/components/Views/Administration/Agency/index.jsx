import React, {Component} from "react";
import Main from "../../../Elements/Layout/Main";
import ToolBar from "../../../Elements/ToolBar";
import {BackButton} from "../../../Elements/BackButton";
import ToolbarButton from "../../../Elements/ToolbarButton";
import Content from "../../../Elements/Layout/Content";
import {Route, Switch} from "react-router";
import Edit from "./Edit";
import Create from "./Create";
import View from "./View";

class Agency extends Component {
    basePath = '/administration/agency';
    
    constructor(props) {
        super(props);
    }

    render(){
        let {match, history} = this.props;
        return(
            <Main>
                <ToolBar>
                    <BackButton onClick={() => history.goBack()}/>
                    <h2>Agencies</h2>
                    <ToolbarButton caption={'New'} onClick={() => history.push(`${this.basePath}/create`)}/>
                </ToolBar>
                <Content>
                    <Switch>
                        <Route path={`${this.basePath}/edit/:id`} component={Edit} />
                        <Route path={`${this.basePath}/view/:id`} component={View} />
                        <Route path={`${this.basePath}/create`} component={Create} />
                    </Switch>
                </Content>
            </Main>
        );
    }
}

export default Agency
import React, {Component} from "react";
import Main from "../../Elements/Layout/Main";
import ToolBar from "../../Elements/ToolBar";
import {BackButton} from "../../Elements/BackButton";
import ToolbarButton from "../../Elements/ToolbarButton";
import Content from "../../Elements/Layout/Content";
import {Route, Switch} from "react-router";
import Edit from "../Agency/Edit";
import Create from "../Agency/Create";
import View from "../Agency/View";

class Agency extends Component {
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
                    <ToolbarButton caption={'New'} onClick={() => history.push("/agency/create")}/>
                </ToolBar>
                <Content>
                    <Switch>
                        <Route path={'/agency/edit/:id'} component={Edit} />
                        <Route path={'/agency/view/:id'} component={View} />
                        <Route path={'/agency/create'} component={Create} />
                    </Switch>
                </Content>
            </Main>
        );
    }
}

export default Agency
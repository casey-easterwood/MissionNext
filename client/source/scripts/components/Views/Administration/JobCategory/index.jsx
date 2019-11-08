import React, {Component} from "react";
import Main from "../../../Elements/Layout/Main";
import ToolBar from "../../../Elements/ToolBar";
import {BackButton} from "../../../Elements/BackButton";
import ToolbarButton from "../../../Elements/ToolbarButton";
import {Route, Switch} from "react-router";
// import View from "./View"
import Edit from "./Edit"
import Create from "./Create"
import Delete from "./Delete"
import Content from "../../../Elements/Layout/Content";

class JobCategory extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        let {match, history} = this.props;
        return(
            <Main>
                <ToolBar>
                    <BackButton onClick={() => history.goBack()}/>
                    <h3>Job Categories</h3>
                    <ToolbarButton caption={'New'} onClick={() => history.push("/jobcategory/create")}/>
                </ToolBar>
                <Content>
                    <Switch>
                        <Route path={'/jobcategory/view/:id'} component={Edit} />
                        <Route path={'/jobcategory/edit/:id'} component={Edit} />
                        <Route path={'/jobcategory/delete/:id'} component={Delete} />
                        <Route path={'/jobcategory/create'} component={Create} />
                    </Switch>
                </Content>
            </Main>
        );
    }
}

export default JobCategory
import React, {Component} from "react";
import Main from "../../Elements/Layout/Main";
import ToolBar from "../../Elements/ToolBar";
import {BackButton} from "../../Elements/BackButton";
import ToolbarButton from "../../Elements/ToolbarButton";
import {Route, Switch} from "react-router";
import View from "./View"
import Edit from "./Edit"
import Candidates from "./ChooseUserCandidate";
import Create from "./Create"
import Delete from "./Delete";
import ResetPassword from "./ResetPassword";
import Content from "../../Elements/Layout/Content";

class User extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        let {match, history} = this.props;
        return(
            <Main>
                <ToolBar>
                    <BackButton onClick={() => history.goBack()}/>
                    <h3>Users</h3>
                    <ToolbarButton caption={'New'} onClick={() => history.push("/job/create")}/>
                </ToolBar>
                <Content>
                    <Switch>
                        <Route path={'/user/view/:id'} component={View} />
                        <Route path={'/user/edit/:id'} component={Edit} />
                        <Route path={'/user/chooseCandidate/:id'} component={Candidates} />
                        <Route path={'/user/delete/:id'} component={Delete} />
                        <Route path={'/user/resetpassword/:id'} component={ResetPassword} />
                        <Route path={'/user/create'} component={Create} />
                    </Switch>
                </Content>
            </Main>
        );
    }
}

export default User
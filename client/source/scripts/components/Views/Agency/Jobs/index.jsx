/**
 * @var user
 */

import React, {Component} from 'react';
import ToolBar from "../../../Elements/ToolBar";
import ToolbarButton from "../../../Elements/ToolbarButton";
import Main from "../../../Elements/Layout/Main";
import {Switch, Route} from "react-router-dom";
import VerticalMenu from "../../../Elements/VerticalMenu";
import VerticalNavMenu from "../../../Elements/VerticalNavMenu";
import {BackButton} from "../../../Elements/BackButton";
import styles from "./styles.scss";
import Content from "../../../Elements/Layout/Content";

class Jobs extends Component {
    dataProvider = window.dataProvider.jobs;

    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        this.onClickItem = this.onClickItem.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.filterItems = this.filterItems.bind(this);
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);
        this.dataProvider.getAll();
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        if("JOBS_LOADED"){
            this.setState({loading:false});
        }
    }

    onClickItem(id){
        this.props.history.push(`/agency/job/view/${id}`);
    }

    filterItems(){
        let Items = this.dataProvider.rows;

        return Items;
    }

    render(){
        let menuActions = [
            {caption:"Edit Job", onClick:(id) => this.props.history.push(`/agency/job/edit/${id}`), warning:false},
            {caption:"View Job", onClick:(id) => this.props.history.push(`/agency/job/view/${id}`), warning:false},
        ];

        return(
            <Main>
                <ToolBar>
                    <div>&nbsp;</div>
                    <h3>Browse Jobs</h3>
                    <ToolbarButton caption={'New'} onClick={() => history.push("/administration/job/create")}/>
                </ToolBar>
                <Content>
                    <VerticalMenu
                        icon="baseline-work-24px.svg"
                        idField="Id"
                        captionField="Title"
                        defaultAction={(id) => this.onClickItem(id)}
                        menuActions={menuActions}
                        data={this.filterItems()}
                    />
                </Content>
            </Main>
        );
    }
}

export default Jobs
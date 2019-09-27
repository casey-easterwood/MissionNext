/**
 * @var auth
 */

import React, {Component} from 'react';
import styles from "./styles.scss";
import Main from "../../Elements/Layout/Main";
import ToolBar from "../../Elements/ToolBar";
import ToolbarButton from "../../Elements/ToolbarButton";
import VerticalMenu from "../../Elements/VerticalMenu";
import {BackButton} from "../../Elements/BackButton";
import Content from "../../Elements/Layout/Content";

class Index extends Component {
    dataProvider = window.dataProvider.JobCategories;
    
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        this.providerHandler = this.providerHandler.bind(this);
    };

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);
        this.dataProvider.getAll();
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        if(event == "JOB_CATEGORIES_LOADED")
           this.setState({loading: false});
    }

    render(){
        let menuActions = [
            {   caption:"Edit Job Category",
                onClick:(id) => this.props.history.push(`/jobcategory/edit/${id}`),
                warning:false
            },
        ];
        return(
            <Main>
                <ToolBar>
                    <BackButton onClick={() => this.props.history.replace('/administration')}/>
                    <h3>Job Categories</h3>
                    <ToolbarButton caption={'New'} onClick={() => this.props.history.push('/jobcategory/create')}/>
                </ToolBar>
                <Content>
                <VerticalMenu
                    icon="baseline-category-24px.svg"
                    idField="Id"
                    captionField="Name"
                    defaultAction={(id) => this.props.history.push(`/jobcategory/edit/${id}`)}
                    menuActions={menuActions}
                    data={this.dataProvider.getRows()}
                />
                </Content>
            </Main>
        )
    }
}


export default Index
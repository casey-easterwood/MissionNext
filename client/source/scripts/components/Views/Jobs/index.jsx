/**
 * @var user
 */

import React, {Component} from 'react';
import ToolBar from "../../Elements/ToolBar";
import ToolbarButton from "../../Elements/ToolbarButton";
import Main from "../../Elements/Layout/Main";
import {Switch, Route} from "react-router-dom";
import VerticalMenu from "../../Elements/VerticalMenu";
import VerticalNavMenu from "../../Elements/VerticalNavMenu";
import {BackButton} from "../../Elements/BackButton";
import styles from "./styles.scss";
import Content from "../../Elements/Layout/Content";


class JobList extends Component {
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
        this.props.history.push(`/job/view/${id}`);
    }

    filterItems(){
        let Items = this.dataProvider.rows;
        let {match} = this.props;
        let {category, subcategory} = match.params;

        return Items.filter((item) =>{
            let filtered = false;

            switch (category) {
                case "agencies":
                    if(item.getFieldValue('AgencyId') == match.params.subcategory)
                        filtered = true;
                    break;
                case "categories":
                    if(item.getFieldValue('Category') == match.params.subcategory)
                        filtered = true;
                    break;
                case "locations":
                    if(subcategory == "All"){
                        filtered = true;
                    } else {
                        if (item.getFieldValue('Location') == match.params.subcategory)
                            filtered = true;
                    }
                    break;
            }

            return filtered;
        })
    }

    render(){
        let menuActions = [
            {caption:"Edit Job", onClick:(id) => this.props.history.push(`/job/edit/${id}`), warning:false},
            {caption:"View Job", onClick:(id) => this.props.history.push(`/job/view/${id}`), warning:false},
        ];

        return(
            <VerticalMenu
                icon="baseline-work-24px.svg"
                idField="Id"
                captionField="Title"
                defaultAction={(id) => this.onClickItem(id)}
                menuActions={menuActions}
                data={this.filterItems()}
            />
        );
    }
}

class Category extends Component {
    dataProvider = window.dataProvider.jobs;

    constructor(props) {
        super(props);

        this.state = {
            menuOptions:[]
        };

        this.providerHandler = this.providerHandler.bind(this);
        this.clickMenu = this.clickMenu.bind(this);
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);

        let {match} = this.props;

        switch (match.params.category) {
            case "agencies":
                this.dataProvider.getAgencies();
                break;
            case "categories":
                this.dataProvider.getCategories();
                break;
            case "locations":
                this.dataProvider.getLocations();
                break;
        }
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        let menuOptions = [];
        switch (event) {
            case "CATEGORIES_LOADED":
                this.dataProvider.categories.map((category) =>{
                    let caption = (category.Name || "None") + " (" + category.Count + ")";

                    menuOptions.push(
                        {Id: category.Name, Name: caption}
                    )
                });

                this.setState({menuOptions: menuOptions, loading:false});
                break;
            case "LOCATIONS_LOADED":
                this.dataProvider.locations.map((location) =>{
                    let caption = (location.Name || "None") + " (" + location.Count + ")";

                    menuOptions.push(
                        {Id: location.Name || "All", Name: caption}
                    )
                });

                this.setState({menuOptions: menuOptions, loading:false});
                break;
            case "AGENCIES_LOADED":
                this.dataProvider.agencies.map((agency) =>{
                    let caption = (agency.Name || "None") + " (" + agency.Count + ")";

                    menuOptions.push(
                        {Id: agency.Id, Name: caption}
                    )
                });

                this.setState({menuOptions: menuOptions, loading:false});
                break;
        }
    }

    clickMenu(id){
        let { match, history}= this.props;
        history.push(`${match.url}/${id}`);
    }

    render(){
        return(
            <VerticalNavMenu
                idField="Id"
                captionField="Name"
                defaultAction={(id) => this.clickMenu(id)}
                data={this.state.menuOptions}
            />
        );
    }
}

class Categories extends Component {
    menuOptions = [
        {Id:2, Name:"By Agency", Category:"agencies" },
        {Id:1, Name:"By Category", Category:"categories" },
        {Id:3, Name:"By Location", Category:"locations" }
    ];

    constructor(props) {
        super(props);

        this.clickMenu = this.clickMenu.bind(this);
    }

    clickMenu(id){
        let { match, history}= this.props;
        history.push(`${match.url}/${id}`);
    }

    render(){
        return(
            <VerticalNavMenu
                idField="Category"
                captionField="Name"
                defaultAction={(id) => this.clickMenu(id)}
                data={this.menuOptions}
            />
        );
    }
}

class BrowseJobs extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        let {match, history} = this.props;
        return(
            <Main>
                <ToolBar>
                    <BackButton onClick={() => history.goBack()}/>
                    <h3>Browse Jobs</h3>
                    <ToolbarButton caption={'New'} onClick={() => history.push("/job/create")}/>
                </ToolBar>
                <Content>
                    <Switch>
                        <Route path={'/jobs/:category/:subcategory'} component={JobList} />
                        <Route path={'/jobs/:category'} component={Category} />
                        <Route path={'/jobs'} component={Categories} />
                    </Switch>
                </Content>
            </Main>
        );
    }
}

export default BrowseJobs
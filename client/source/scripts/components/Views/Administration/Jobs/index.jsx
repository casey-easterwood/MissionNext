/**
 * @var auth
 */

import React, {Component} from 'react';
import Main from '../../../Elements/Layout/Main';
import styles from './styles.scss';
import ToolBar from "../../../Elements/ToolBar";
import Content from "../../../Elements/Layout/Content";
import ToolbarButton from "../../../Elements/ToolbarButton";
import VerticalMenu from "../../../Elements/VerticalMenu";

class Jobs extends Component {
    basePath = '/administration/';

    state = {
        loading: true,
        JobFilter: '',
        recordCount : 0,
        itemsPerPage: 10,
        jobs:[],
        pages: 0,
        currentPage: 1,
        pageStart: 0,
        pageEnd: 9,
    };

    dataProvider = window.dataProvider.jobs;

    constructor(props) {
        super(props);

        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.filterJobs = this.filterJobs.bind(this);
        this.providerHandler = this.providerHandler.bind(this);

        this.clickNextPage = this.clickNextPage.bind(this);
        this.clickPrevPage = this.clickPrevPage.bind(this);

    };

    componentDidMount(){
        let currentPage = sessionStorage.getItem('JOBS_CURRENT_PAGE');
        this.state.currentPage = (currentPage) ? currentPage : 1;
        this.setState(this.state);

        this.dataProvider.subscribeToChanges(this.providerHandler);
        this.dataProvider.getAll();
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        if(event == "JOBS_LOADED"){
            this.state.recordCount = data.length;
            this.state.pages = parseInt(data.length/this.state.itemsPerPage);
            this.state.loading = false;
            this.state.jobs = data;

            this.state.pageEnd = this.state.currentPage * this.state.itemsPerPage;
            this.state.pageStart = this.state.pageEnd - this.state.itemsPerPage;

            this.setState(this.state);
        }
    }

    onSearchChanged(e){
        this.setState({JobFilter:e.target.value, currentPage:1});
    }

    clickNextPage(){
        if(this.state.currentPage <= this.state.pages){
            this.state.currentPage++;
            this.state.pageEnd = this.state.currentPage * this.state.itemsPerPage;
            this.state.pageStart = this.state.pageEnd - this.state.itemsPerPage;

            sessionStorage.setItem('JOBS_CURRENT_PAGE', this.state.currentPage);

            this.setState(this.state);
        }
    }

    clickPrevPage(){
        if(this.state.currentPage > 1){
            this.state.currentPage--;
            this.state.pageEnd = this.state.currentPage * this.state.itemsPerPage;
            this.state.pageStart = this.state.pageEnd - this.state.itemsPerPage;

            sessionStorage.setItem('JOBS_CURRENT_PAGE', this.state.currentPage);

            this.setState(this.state);
        }
    }

    filterJobs(){
        let JobFilter = this.state.JobFilter.toLocaleLowerCase();

        let filteredItems = this.state.jobs.filter((item) =>{
            let filtered = false;

            if(item.getFieldValue('Name').toLocaleLowerCase().indexOf(JobFilter) > -1)
                filtered = true;

            return filtered;
        });

        if(filteredItems.length > this.state.itemsPerPage)
            return filteredItems.slice(this.state.pageStart,this.state.pageEnd);
        else
            return filteredItems;
    }

    render(){
        let menuActions = [
            {caption:"Edit Job", onClick:(id) => this.props.history.push(`/administration/job/edit/${id}`), warning:false},
            {caption:"View Job", onClick:(id) => this.props.history.push(`/administration/job/view/${id}`), warning:false},
        ];

        const iconSrc = "/resources/images/icons/baseline-work-24px.svg";

        return(
            <Main>
                <ToolBar>
                    <div>
                        <input id="searchValue"
                               name="searchValue"
                               type="text"
                               placeholder="Search Jobs"
                               onChange={this.onSearchChanged}
                               className={styles.sidebarSearchInput}
                        />
                    </div>
                    <h2>Jobs </h2>
                    {this.state.JobFilter == "" &&
                    <div>
                        <input type="button" value={"<<"} onClick={this.clickPrevPage}/>
                        <span> Page {this.state.currentPage} </span>
                        <input type="button" value={">>"} onClick={this.clickNextPage}/>
                    </div>
                    }
                    <ToolbarButton caption={'New'} onClick={() => this.props.history.push(`/administration/job/create`)}/>
                </ToolBar>
                <Content>
                    <VerticalMenu
                        icon="baseline-work-24px.svg"
                        idField="Id"
                        captionField="Name"
                        defaultAction={(id) => this.props.history.push(`/administration/job/view/${id}`)}
                        menuActions={menuActions}
                        data={this.filterJobs()}
                    />
                </Content>
            </Main>
        );
    }
}

export default Jobs
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

class Agencies extends Component {
    basePath = '/administration/';

    state = {
        loading: true,
        AgencyFilter: '',
        recordCount : 0,
        itemsPerPage: 10,
        agencies:[],
        pages: 0,
        currentPage: 1,
        pageStart: 0,
        pageEnd: 9,
    };

    dataProvider = window.dataProvider.agencies;

    constructor(props) {
        super(props);

        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.filterAgencies = this.filterAgencies.bind(this);
        this.providerHandler = this.providerHandler.bind(this);

        this.clickNextPage = this.clickNextPage.bind(this);
        this.clickPrevPage = this.clickPrevPage.bind(this);

    };

    componentDidMount(){
        let currentPage = sessionStorage.getItem('AGENCIES_CURRENT_PAGE');
        this.state.currentPage = (currentPage) ? currentPage : 1;
        this.setState(this.state);

        this.dataProvider.subscribeToChanges(this.providerHandler);
        this.dataProvider.getAll();
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        if(event == "AGENCIES_LOADED"){
            this.state.recordCount = data.length;
            this.state.pages = parseInt(data.length/this.state.itemsPerPage);
            this.state.loading = false;
            this.state.agencies = data;

            this.state.pageEnd = this.state.currentPage * this.state.itemsPerPage;
            this.state.pageStart = this.state.pageEnd - this.state.itemsPerPage;

            let currentPage = sessionStorage.getItem('AGENCIES_CURRENT_PAGE');
            this.state.currentPage = (currentPage) ? currentPage : 1;


            this.setState(this.state);
        }
    }

    onSearchChanged(e){

        this.setState({AgencyFilter:e.target.value, currentPage:1});
    }

    clickNextPage(){
        if(this.state.currentPage <= this.state.pages){
            this.state.currentPage++;
            this.state.pageEnd = this.state.currentPage * this.state.itemsPerPage;
            this.state.pageStart = this.state.pageEnd - this.state.itemsPerPage;

            sessionStorage.setItem('AGENCIES_CURRENT_PAGE', this.state.currentPage);

            this.setState(this.state);
        }
    }

    clickPrevPage(){
        if(this.state.currentPage > 1){
            this.state.currentPage--;
            this.state.pageEnd = this.state.currentPage * this.state.itemsPerPage;
            this.state.pageStart = this.state.pageEnd - this.state.itemsPerPage;

            sessionStorage.setItem('AGENCIES_CURRENT_PAGE', this.state.currentPage);

            this.setState(this.state);
        }
    }

    filterAgencies(){
        let AgencyFilter = this.state.AgencyFilter.toLocaleLowerCase();

        let filteredItems = this.state.agencies.filter((item) =>{
            let filtered = false;

            if(item.getFieldValue('Name').toLocaleLowerCase().indexOf(AgencyFilter) > -1)
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
            {caption:"Edit Agency", onClick:(id) => this.props.history.push(`/administration/agency/edit/${id}`), warning:false},
            {caption:"View Agency", onClick:(id) => this.props.history.push(`/administration/agency/view/${id}`), warning:false},
        ];

        const iconSrc = "/resources/images/icons/baseline-search-24px.svg";

        return(
            <Main>
                <ToolBar>
                    <div>
                        <input id="searchValue"
                               name="searchValue"
                               type="text"
                               placeholder="Search Agencies"
                               onChange={this.onSearchChanged}
                               className={styles.sidebarSearchInput}
                        />
                    </div>
                    <h2>Agencies </h2>
                    {this.state.AgencyFilter == "" &&
                        <div>
                            <input type="button" value={"<<"} onClick={this.clickPrevPage}/>
                            <span> Page {this.state.currentPage} </span>
                            <input type="button" value={">>"} onClick={this.clickNextPage}/>
                        </div>
                    }
                    <ToolbarButton caption={'New'} onClick={() => this.props.history.push(`/administration/agency/create`)}/>
                </ToolBar>
                <Content>
                    <VerticalMenu
                        icon="baseline-language-24px.svg"
                        idField="Id"
                        captionField="Name"
                        defaultAction={(id) => this.props.history.push(`/administration/agency/view/${id}`)}
                        menuActions={menuActions}
                        data={this.filterAgencies()}
                    />
                </Content>
            </Main>
        );
    }
}

export default Agencies
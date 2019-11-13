import React, {Component, Fragment} from "react";
import Main from '../../../Elements/Layout/Main';
import styles from './styles.scss';
import ToolBar from "../../../Elements/ToolBar";
import ToolbarButton from "../../../Elements/ToolbarButton";
import VerticalMenu from "../../../Elements/VerticalMenu";
import Content from "../../../Elements/Layout/Content";

class Candidates extends Component {
    //mode search, edit, view, creat
    state = {
        loading: false,
        Items: [],
        searchFilter: '',
        recordCount : 0,
        itemsPerPage: 10,
        pages: 0,
        currentPage: 1,
        pageStart: 0,
        pageEnd: 9,
    };
    dataProvider = window.dataProvider.candidates;

    constructor(props) {
        super(props);

        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.filterItems = this.filterItems.bind(this);
        this.providerHandler = this.providerHandler.bind(this);

        this.clickNextPage = this.clickNextPage.bind(this);
        this.clickPrevPage = this.clickPrevPage.bind(this);
    };

    componentDidMount(){
        let currentPage = sessionStorage.getItem('CANDIDATES_CURRENT_PAGE');
        this.state.currentPage = (currentPage) ? currentPage : 1;
        this.setState(this.state);

        this.dataProvider.subscribeToChanges(this.providerHandler);
        this.dataProvider.getAll();
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(message, data){
        if(message == "CANDIDATES_LOADED") {
            this.state.recordCount = data.length;
            this.state.pages = parseInt(data.length/this.state.itemsPerPage);
            this.state.loading = false;
            this.state.Items = data;

            this.state.pageEnd = this.state.currentPage * this.state.itemsPerPage;
            this.state.pageStart = this.state.pageEnd - this.state.itemsPerPage;

            this.setState(this.state);
        }
    }

    onSearchChanged(e){
        this.setState({searchFilter:e.target.value});
    }

    clickNextPage(){
        if(this.state.currentPage <= this.state.pages){
            this.state.currentPage++;
            this.state.pageEnd = this.state.currentPage * this.state.itemsPerPage;
            this.state.pageStart = this.state.pageEnd - this.state.itemsPerPage;

            sessionStorage.setItem('CANDIDATES_CURRENT_PAGE', this.state.currentPage);

            this.setState(this.state);
        }
    }

    clickPrevPage(){
        if(this.state.currentPage > 1){
            this.state.currentPage--;
            this.state.pageEnd = this.state.currentPage * this.state.itemsPerPage;
            this.state.pageStart = this.state.pageEnd - this.state.itemsPerPage;

            sessionStorage.setItem('CANDIDATES_CURRENT_PAGE', this.state.currentPage);

            this.setState(this.state);
        }
    }

    filterItems(){
        let searchFilter = this.state.searchFilter.toLocaleLowerCase();

        let filteredItems = this.state.Items.filter((item) =>{
            let filtered = false;

            if(item.getFieldValue('Name').toLocaleLowerCase().indexOf(searchFilter) > -1)
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
            {caption:"Edit Candidate", onClick:(id) => this.props.history.push(`/administration/candidate/edit/${id}`), warning:false},
            {caption:"View Candidate", onClick:(id) => this.props.history.push(`/administration/candidate/view/${id}`), warning:false},
        ];

        let style = {
          width:'100%',
          backgroundColor:"#CCCCCC"
        };

        return(
            <Main>
                <ToolBar>
                    <div>
                        <input id="searchValue"
                               name="searchValue"
                               type="text"
                               style={{boxShadow: "7px 7px 7px rgba(0, 0, 0, 0.50)"}}
                               placeholder="Search Candidates"
                               onChange={this.onSearchChanged}
                               className={styles.sidebarSearchInput}
                        />
                    </div>
                    <h2>Candidates</h2>
                    {this.state.searchFilter == "" &&
                    <div>
                        <input type="button" value={"<<"} onClick={this.clickPrevPage}/>
                        <span> Page {this.state.currentPage} </span>
                        <input type="button" value={">>"} onClick={this.clickNextPage}/>
                    </div>
                    }
                    <ToolbarButton caption={'New'} onClick={() => this.props.history.push(`/administration/candidate/create`)}/>
                </ToolBar>
                <Content>
                    <VerticalMenu
                        icon="baseline-person-24px.svg"
                        idField="Id"
                        captionField="Name"
                        defaultAction={(id) => this.props.history.push(`/administration/candidate/view/${id}`)}
                        menuActions={menuActions}
                        data={this.filterItems()}
                    />
                </Content>
            </Main>
        );
    }
}

export default Candidates
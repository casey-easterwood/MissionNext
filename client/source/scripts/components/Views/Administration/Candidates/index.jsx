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
        searchFilter: '',
    };
    dataProvider = window.dataProvider.candidates;

    constructor(props) {
        super(props);

        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.filterItems = this.filterItems.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
    };

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);
        this.dataProvider.getAll();
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(message, data){
        if(message == "CANDIDATES_LOADED") {
            this.setState({Items: this.dataProvider.getRows()});
        }
    }

    onSearchChanged(e){
        this.setState({searchFilter:e.target.value});
    }

    filterItems(){
        let Items = this.dataProvider;
        let searchFilter = this.state.searchFilter.toLocaleLowerCase();

        return Items.rows.filter((item) =>{
            let filtered = false;

            if(item.getFieldValue('Name').toLocaleLowerCase().indexOf(searchFilter) > -1)
                filtered = true;

            return filtered;
        })
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
/**
 * @var auth
 */

import React, {Component} from 'react';
import Main from '../../Elements/Layout/Main';
import styles from './styles.scss';
import ToolBar from "../../Elements/ToolBar";
import Content from "../../Elements/Layout/Content";
import ToolbarButton from "../../Elements/ToolbarButton";
import VerticalMenu from "../../Elements/VerticalMenu";

class Agencies extends Component {
    //mode search, edit, view, creat
    state = {
        loading: true,
        AgencyFilter: '',
    };

    dataProvider = window.dataProvider.agencies;
    constructor(props) {
        super(props);

        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.filterAgencies = this.filterAgencies.bind(this);
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
        if(event == "AGENCIES_LOADED")
            this.setState({loading:false});
    }

    onSearchChanged(e){
        this.setState({AgencyFilter:e.target.value});
    }

    filterAgencies(){
        let AgencyFilter = this.state.AgencyFilter.toLocaleLowerCase();

        return this.dataProvider.rows.filter((item) =>{
            let filtered = false;

            if(item.getFieldValue('Name').toLocaleLowerCase().indexOf(AgencyFilter) > -1)
                filtered = true;

            return filtered;
        })
    }

    render(){
        let menuActions = [
            {caption:"Edit Agency", onClick:(id) => this.props.history.push(`/agency/edit/${id}`), warning:false},
            {caption:"View Agency", onClick:(id) => this.props.history.push(`/agency/view/${id}`), warning:false},
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
                    <h2>Agencies</h2>
                    <ToolbarButton caption={'New'} onClick={() => this.props.history.push(`/agency/create`)}/>
                </ToolBar>
                <Content>
                    <VerticalMenu
                        icon="baseline-language-24px.svg"
                        idField="Id"
                        captionField="Name"
                        defaultAction={(id) => this.props.history.push(`/agency/view/${id}`)}
                        menuActions={menuActions}
                        data={this.filterAgencies()}
                    />
                </Content>
            </Main>
        );
    }
}

export default Agencies
import React, {Component, Fragment} from "react";
import styles from './styles.scss';
import VerticalMenu from "../../../Elements/VerticalMenu";
import FormGroup from "../../../Elements/FormGroup";
import FormSection from "../../../Elements/FormSection";
import Modal from "../../../Elements/Modal";
import VerticalNavMenu from "../../../Elements/VerticalNavMenu";

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
        return(
            <Fragment>
                {/*<h2>Candidates</h2>*/}
                {/*<input id="searchValue"*/}
                {/*       name="searchValue"*/}
                {/*       type="text"*/}
                {/*       placeholder="Search Candidates"*/}
                {/*       onChange={this.onSearchChanged}*/}
                {/*       className={styles.sidebarSearchInput}*/}
                {/*/>*/}
                <FormGroup
                    id="searchValue"
                    label="Search Candidates"
                    onChange={this.onSearchChanged}
                />
                <VerticalMenu
                    icon="baseline-person-24px.svg"
                    idField="Id"
                    captionField="Name"
                    defaultAction={(id) => this.props.history.push(`/candidate/view/${id}`)}
                    data={this.filterItems()}
                />
            </Fragment>
        );
    }
}

export default Candidates
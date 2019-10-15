import React, {Component, Fragment} from "react";
import Main from '../../Elements/Layout/Main';
import styles from './styles.scss';
import ToolBar from "../../Elements/ToolBar";
import ToolbarButton from "../../Elements/ToolbarButton";
import VerticalMenu from "../../Elements/VerticalMenu";
import Content from "../../Elements/Layout/Content";
import Modal from "../../Elements/Modal";

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
        this.selectCandidate = this.selectCandidate.bind(this);
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

    selectCandidate(id){
        this.props.onItemSelected(id);
    }

    render(){

        return(
            <Modal open={this.props.show}
                   close={this.props.close}>
                    <VerticalMenu
                        icon="baseline-person-24px.svg"
                        idField="Id"
                        captionField="Name"
                        defaultAction={(id) => this.selectCandidate(id)}
                        data={this.filterItems()}
                    />
            </Modal>
        );
    }
}

export default Candidates
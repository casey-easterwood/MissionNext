/**
 * @var auth
 * @function onItemSelected(id)
 * @param show
 * @param close
 */

import React, {Component} from 'react';
import VerticalMenu from "../../../Elements/VerticalMenu";
import Modal from "../../../Elements/Modal";

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
        this.selectAgency = this.selectAgency.bind(this);
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

    selectAgency(id){
        this.props.onItemSelected(id);
    }

    render(){
        return(
            <Modal open={this.props.show}
                   close={this.props.close}>
                    <VerticalMenu
                        icon="baseline-language-24px.svg"
                        idField="Id"
                        captionField="Name"
                        defaultAction={(id) => this.selectAgency(id)}
                        data={this.filterAgencies()}
                    />
            </Modal>
        );
    }
}

export default Agencies
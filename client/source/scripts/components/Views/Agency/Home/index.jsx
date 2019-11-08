/**
 * @var auth
 */

import React, {Component, Fragment} from 'react';
import Main from '../../../Elements/Layout/Main';
import styles from './styles.scss'
import VerticalMenu from "../../../Elements/VerticalMenu";
import Toolbar from "../../../Elements/ToolBar";
import ToolbarButton from "../../../Elements/ToolbarButton";

class Loader {
    constructor(){

        this.load = this.load.bind(this);
        this.loadAgencies = this.loadAgencies.bind(this);
        this.loadCandidates = this.loadCandidates.bind(this);
    }

    load(){
        const loader = this;

        let data = {
            agencies : [],
            candidates : [],
            jobs: []
        };

        return new Promise((resolve, reject) => {
            let getAgencies = loader.loadAgencies();
            let getCandidates = loader.loadCandidates();

            let promises = [
                getAgencies,
                getCandidates
            ];


            Promise.all(promises).then((results) => {
                data.agencies = results[0];
                data.candidates = results[1];

                resolve(data);
            })
        });
    }

    loadAgencies() {
        return new Promise((resolve, reject) => {
            const handler = (event, data) => {
                if(event == "AGENCIES_LOADED"){
                    let agencies = [];

                    window.dataProvider.agencies.rows.map((agency) =>{
                        agencies.push(agency)
                    });

                    window.dataProvider.agencies.unsubscribe(this);
                    resolve(agencies);
                }
            };

            window.dataProvider.agencies.subscribeToChanges(handler);
            window.dataProvider.agencies.getAll();
        })
    }

    loadCandidates() {
        return new Promise((resolve, reject) => {
            const handler = (event, data) => {
                if(event == "CANDIDATES_LOADED"){
                    let candidates = [];

                    window.dataProvider.candidates.rows.map((category) =>{
                        candidates.push(category)
                    });

                    window.dataProvider.candidates.unsubscribe(this);
                    resolve(candidates);
                }
            };

            window.dataProvider.candidates.subscribeToChanges(handler);
            window.dataProvider.candidates.getAll();
        })
    }

}

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        }
    };

    componentDidMount(){
        const loader = new Loader();

        loader.load().then(data => {
            this.state.agencies = data.agencies;
            this.state.candidates = data.candidates;
            this.state.loading = false;

            this.setState(this.state);
        });
    }

    componentWillUnmount(){
    }

    render(){
        const {loading, candidates, agencies} = this.state;
        const {history} = this.props;

        return(
            <Fragment>
                <Toolbar>
                    <div>&nbsp;</div>
                    <h2>Dashboard</h2>
                    <div>&nbsp;</div>
                </Toolbar>
                <div className={styles.container}>
                    {loading &&
                        <h2>Loading....</h2>
                    }
                    <h3>Candidates - Recently Added</h3>
                    {!loading &&
                    <div className={styles.agencies}>
                        <VerticalMenu
                            icon="baseline-person-24px.svg"
                            idField="Id"
                            captionField="Name"
                            defaultAction={(id) => this.props.history.push(`/administration/candidate/view/${id}`)}
                            menuActions={[
                                {caption:"Edit Candidate", onClick:(id) => this.props.history.push(`/administration/candidate/edit/${id}`), warning:false},
                                {caption:"View Candidate", onClick:(id) => this.props.history.push(`/administration/candidate/view/${id}`), warning:false},
                            ]}
                            data={candidates}
                        />
                    </div>
                    }

                    <h3>Agencies - Recently Added</h3>
                    {!loading &&
                    <div className={styles.candidates}>
                        <VerticalMenu
                            icon="baseline-language-24px.svg"
                            idField="Id"
                            captionField="Name"
                            defaultAction={(id) => this.props.history.push(`/administration/agency/view/${id}`)}
                            menuActions={[
                                {caption:"Edit Agency", onClick:(id) => this.props.history.push(`/administration/agency/edit/${id}`), warning:false},
                                {caption:"View Agency", onClick:(id) => this.props.history.push(`/administration/agency/view/${id}`), warning:false},
                            ]}
                            data={agencies}
                        />
                    </div>
                    }

                </div>
            </Fragment>
        );
    }
}


export default Index
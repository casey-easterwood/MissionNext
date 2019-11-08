/**
 * @var auth
 */

import React, {Component, Fragment} from 'react';
import styles from './styles.scss'
import Toolbar from "../../../Elements/ToolBar";
import Content from "../../../Elements/Layout/Content";

class Loader {
    id = 0;
    constructor(id){
        this.id = id;

        this.load = this.load.bind(this);
        this.loadAgency = this.loadAgency.bind(this);
    }

    load(){
        const loader = this;

        let data = {
            agency: null,
            jobs: [],
        };

        return new Promise((resolve, reject) => {
            let getAgency = loader.loadAgency();

            let promises = [
                getAgency
            ];


            Promise.all(promises).then((results) => {
                data.agency = results[0];
                resolve(data);
            })
        });
    }

    loadAgency() {
        return new Promise((resolve, reject) => {
            const handler = (event, data) => {
                if(event =="AGENCY_LOADED"){
                    let agency = data;

                    window.dataProvider.agency.unsubscribe(this);

                    resolve(agency);
                }
            };

            window.dataProvider.agency.subscribeToChanges(handler);
            window.dataProvider.agency.get();
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
            this.state.item = data.agency;
            this.state.loading = false;

            this.setState(this.state);
        });
    }

    componentWillUnmount(){
    }

    render(){
        const {loading, item} = this.state;
        const {history} = this.props;

        return(
            <div >
                <Toolbar>
                    <div>&nbsp;</div>
                    {!loading &&
                    <h2>{item.fields["Name"].getValue()}</h2>
                    }
                    <div>&nbsp;</div>
                </Toolbar>
                {!loading &&
                    <div className={[styles.flexRow, styles.fontWhite, styles.justifyCenter].join(' ')}>
                        <div className={styles.margin10}>
                            <h3>Contact Information</h3>
                            <ul>
                                <li><span>Contact: </span>{item.fields['ContactName'].getValue() || ''}</li>
                                <li><span>Phone: </span>{item.fields['Phone'].getValue() || ''}</li>
                                <li><span>Web Site: </span>{item.fields['Website'].getValue() || ''}</li>
                            </ul>
                        </div>
                        <div  className={styles.margin10}>
                            <h3>Address</h3>
                            <ul>
                                <li>{item.fields['Address'].getValue() || ''}</li>
                                <li>{item.fields['City'].getValue() || ''}, {item.fields['State'].getValue() || ''}, 90000</li>
                            </ul>
                        </div>
                    </div>
                }
            </div>
        );
    }
}


export default Index
/**
 * @var auth
 */

import React, {Component} from 'react';
import styles from './styles.scss';
import ReactDOM from "react-dom";

class Layout extends Component {
    constructor(props) {
        super(props);
    };

    render(){
        const {Authenticated} = this.props.auth;

        return(
            <div className={styles.layout}>
                {this.props.children}
            </div>
        )
    }
}

export default Layout
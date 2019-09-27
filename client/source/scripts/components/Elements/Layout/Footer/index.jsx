/**
 * @var auth
 */

import React, {Component} from 'react';
import styles from './styles.scss';
import ReactDOM from "react-dom";

class Footer extends Component {
    constructor(props) {
        super(props);
    };

    render(){
        return ReactDOM.createPortal(
        (
            <div className={styles.footer}>
                {this.props.children}
            </div>
        ),
            document.getElementById("footer-root")
        );
    }
}

export default Footer
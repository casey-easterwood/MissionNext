import React, {Component} from 'react';
import styles from './styles.scss';
import ReactDOM from "react-dom";

class Sidebar extends Component {
    constructor(props) {
        super(props);
    };


    render(){
        return ReactDOM.createPortal(
        (
            <div className={styles.toolBar}>
                {this.props.children}
            </div>
        ),
            document.getElementById("toolbar-root")
        );
    }
}

export default Sidebar
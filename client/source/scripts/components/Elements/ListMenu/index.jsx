/**
 * @var auth
 */

import React, {Component} from 'react';
import styles from './styles.scss';

class ListMenu extends Component {
    constructor(props) {
        super(props);
    };

    render(){
        return(
            <ul className={styles.ListMenu}>
                {this.props.children}
            </ul>
        );
    }
}


export default ListMenu
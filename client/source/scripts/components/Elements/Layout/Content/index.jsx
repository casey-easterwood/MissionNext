import React, {Component} from 'react';
import styles from './styles.scss';

class Content extends Component {
    constructor(props) {
        super(props);
    };


    render(){
        return(
            <div className={styles.content}>
                {this.props.children}
            </div>
        );
    }
}

export default Content
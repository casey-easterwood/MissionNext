/**
 * @var props.onChange
 */

import React, {Component} from 'react';
import styles from './styles.scss';

class FlexRow extends Component {
    render(){
        const { justify } = this.props;
        let componentStyle = [styles.section];

        if(justify == "start")
            componentStyle.push(styles.justifyStart);
        else if(justify == "end")
            componentStyle.push(styles.justifyEnd);
        else if(justify == "stretch")
            componentStyle.push(styles.stretch);
        else
            componentStyle.push(styles.justifyCenter);

        return(
            <div className={componentStyle.join(' ')} >
                {this.props.children}
            </div>
        )
    }
}

export default FlexRow;
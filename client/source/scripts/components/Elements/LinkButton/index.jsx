import React, {Component} from 'react';
import styles from './styles.scss';

/**
 * @param status : enabled, disabled, restricted
 * @param href
 * @param caption
 * @param onClick
 */
class LinkButton extends Component {
    render(){
        let style = styles.linkButton;
        let {onClick, caption, href, type} = this.props;

        if(type === 'secondary'){
            style = styles.linkButtonSecondary;
        } else if(type === 'warning'){
            style = styles.linkButtonWarning;
        } else {
            style = styles.linkButton;
        }

        return(
            <div className={style} onClick={onClick}>
                <div>
                    {caption}
                </div>
            </div>
        )
    }
}

export default LinkButton
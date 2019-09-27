import React, {Component} from 'react';
import styles from './styles.scss';

/**
 * @param status : enabled, disabled, restricted
 * @param href
 * @param caption
 * @param onClick
 */
class ToolbarButton extends Component {
    render(){
        let style = styles.toolbarButton;

        switch (this.props.status) {
            case 'disabled':
                style = styles.toolbarButtonDisabled;
                break;
            case 'restricted':
                style = styles.toolbarButtonRestricted;
                break;
        }


        return(
            <div className={style} onClick={this.props.onClick}>
                <a
                   href={this.props.href}
                   >
                    {this.props.caption}
                </a>
            </div>
        )
    }
}

export default ToolbarButton
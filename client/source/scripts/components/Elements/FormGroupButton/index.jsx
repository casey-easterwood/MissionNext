/**
 * @var props.onChange
 */

import React, {Component} from 'react';
import styles from './styles.scss';
import LinkButton from "../LinkButton";

class FormGroupButton extends Component {
    constructor(props) {
        super(props);

        this.renderButton = this.renderButton.bind(this);
        this.renderReadOnly = this.renderReadOnly.bind(this);
    }

    renderButton(){
        const ValidationMessage =() => {
            if(this.props.validationMessage != "")
                return <span className={styles.validationMessage}>{this.props.validationMessage}</span>
            else
                return "";
        };
        return(
            <div className={styles.formGroup}>
                <label htmlFor={this.props.id}>
                    {this.props.label}
                </label>
                <LinkButton
                    type={'secondary'}
                    href="#"
                    onClick={this.props.onClick}
                    caption={this.props.value}/>
                <ValidationMessage/>
            </div>
        )
    }

    renderReadOnly(){
        return(
            <div className={styles.formGroup}>
                <label htmlFor={this.props.id}>
                    {this.props.label}
                </label>
                <span className={styles.readOnly}>
                       {this.props.value}
                </span>
            </div>
        )
    }

    render(){
        let {readOnly} = this.props;

        if(readOnly)
            return this.renderReadOnly();
        else
            return this.renderButton();
    }
}

export default FormGroupButton;
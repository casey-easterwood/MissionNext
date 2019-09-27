/**
 * @var props.onChange
 */

import React, {Component} from 'react';
import styles from './styles.scss';

class FormGroupTextArea extends Component {
    constructor(props) {
        super(props);

        this.onKeyPress = this.onKeyPress.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.renderReadOnly = this.renderReadOnly.bind(this);
    }

    onKeyPress(e){
        let key = e.which || e.keyCode;
        if(key == 13 && this.props.save) {
            e.preventDefault();
            e.cancelBubble = true;
        }
    }

    renderEdit(){
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

                <textarea id={this.props.id}
                       name={this.props.id}
                       readOnly={this.props.readOnly}
                       value={this.props.value}
                       onChange={this.props.onChange}
                       onKeyPress={this.onKeyPress}
                />
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

        if(!readOnly)
            return this.renderEdit();
        else
            return this.renderReadOnly();
    }
}

export default FormGroupTextArea;
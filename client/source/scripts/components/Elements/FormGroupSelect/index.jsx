/**
 * @var props.onChange
 */

import React, {Component} from 'react';
import Select from 'react-select';
import styles from './styles.scss';

class FormGroup extends Component {
    constructor(props) {
        super(props);

        this.renderEdit = this.renderEdit.bind(this);
        this.renderReadOnly = this.renderReadOnly.bind(this);
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

                <Select
                    value={this.props.value}
                    onChange={this.props.onChange}
                    options={this.props.options}
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

export default FormGroup;
import React, {Component} from 'react';
import styles from './styles.scss';

class Form extends Component {
    constructor(props) {
        super(props);

        this.onKeyPress = this.onKeyPress.bind(this);
    }

    onKeyPress(e){
        // let key = e.which || e.keyCode;
        // if(key == 13 && this.props.save) {
        //     this.props.save();
        // }
    }

    render()
    {
        let title = '';

        if(this.props.title !== ''){
            title = <span className={styles.formTitle}>{this.props.title}</span>
        }

        return(
            <div className={styles.formDefault}>
                <form className="form" onSubmit={(event) => {event.preventDefault()}} onKeyPress={this.onKeyPress} method={this.props.method || "GET"}>
                    {title}
                    {this.props.children}
                </form>
            </div>
        )
    }
}

export default Form
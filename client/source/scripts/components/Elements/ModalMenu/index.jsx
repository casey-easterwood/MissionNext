import React, {Component} from "react";
import ReactDOM from "react-dom";
import styles  from './styles.scss';

class Modal extends Component{
    constructor(props) {
        super(props);
    }


    render(){
        if(this.props.open){
            return ReactDOM.createPortal(
                (
                    <div className={styles.modal} onClick={()=> this.props.close()}>
                        <div className={styles.childrenContainer}>
                        {this.props.children}
                        </div>
                    </div>
                ),
                document.getElementById("modal-root")
            )
        } else {
            return null;
        }
    }
}

export default Modal;
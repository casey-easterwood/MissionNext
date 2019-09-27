import React, {Component} from "react";
import ReactDOM from "react-dom";
import styles  from './styles.scss';
import LinkButton from "../LinkButton";

class ModalConfirm extends Component{
    constructor(props) {
        super(props);
    }


    render(){
        if(this.props.open){
            return ReactDOM.createPortal(
                (
                    <div className={styles.modal} onClick={()=> this.props.confirm()}>
                        <div className={styles.childrenContainer}>
                            <h2>{this.props.title}</h2>
                            <div>{this.props.message}</div>
                            <LinkButton type={'primary'} href="#" onClick={this.props.confirm} caption="Ok"/>
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

export default ModalConfirm;
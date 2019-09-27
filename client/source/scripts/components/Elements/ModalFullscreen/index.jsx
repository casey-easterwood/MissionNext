import React, {Component, Fragment} from "react";
import ReactDOM from "react-dom";
import styles  from './styles.scss';

class ModalFullscreen extends Component{
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
            return (
                <Fragment>
                {this.props.children}
                </Fragment>
            )
        }
    }
}

export default ModalFullscreen;
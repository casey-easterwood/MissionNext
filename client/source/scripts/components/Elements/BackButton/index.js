import React, {Component} from "react";
import styles from "./styles.scss";

export class BackButton extends Component {
    constructor(props) {
        super(props);
    };

    render(){
        const {onClick} = this.props;
        const iconSrc = "/resources/images/icons/baseline-arrow_back_ios-24px.svg";

        return(
            <div className={styles.backButton} onClick={onClick}>
                <img
                     src={iconSrc}
                     alt="Click Back"
                />
            </div>
        );
    }
}
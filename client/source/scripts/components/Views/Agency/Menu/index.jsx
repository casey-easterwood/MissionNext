import React, {Component} from 'react';
import styles from './styles.scss';
import ResponsiveMenu from 'react-responsive-navbar';
import { Link, NavLink } from 'react-router-dom';
import ReactDOM from "react-dom";

class Header extends Component {
    constructor(props) {
        super(props);

        this.signOut = this.signOut.bind(this);
        this.clickNav = this.clickNav.bind(this);
    };

    signOut(){
        window.sessionStorage.clear();
        window.location = "/";
    }

    clickNav(path){
        window.location = path;
    }

    render(){
        const pathname = window.location.pathname;

        return ReactDOM.createPortal(
            (
            <ResponsiveMenu
                menuOpenButton={<img style={{width:"40px", height:"40px", fill:"#FFF"}} src={"/resources/images/icons/baseline-menu-white-24px.svg"}/>}
                menuCloseButton={<img style={{width:"40px", height:"40px", fill:"#FFF"}} src={"/resources/images/icons/baseline-menu-white-24px.svg"}/>}
                changeMenuOn="600px"
                largeMenuClassName={styles.menu}
                smallMenuClassName={styles.responsiveMenu}
                menu={
                    <ul>
                        <li>
                            <NavLink activeClassName={styles.active} to={"/agency/Home"}>
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName={styles.active} to={"/agency/jobs"}>
                                Jobs
                            </NavLink>
                        </li>
                        <li>
                            <a href="#" onClick={this.signOut}>Sign Out</a>
                        </li>
                    </ul>
                }
            />
            ),
            document.getElementById("menu-root")
        );
    }
}

export default Header
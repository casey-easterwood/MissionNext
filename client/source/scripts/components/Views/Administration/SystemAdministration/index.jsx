/**
 * @var auth
 */

import React, {Component} from 'react';
import Main from '../../../Elements/Layout/Main';
import styles from "./styles.scss";
import VerticalNavMenu from "../../../Elements/VerticalNavMenu";
import Toolbar from "../../../Elements/ToolBar"


class Index extends Component {
    menuOptions = [
        {id:"1", name:"Job Categories", href:"/administration/jobcategories"},
        {id:"2", name:"Manage Users", href:"/administration/system/users/"},
        {id:"4", name:"Profile Questions", href:"/administration/profilequestiongroups"}
    ];

    constructor(props) {
        super(props);

        this.clickMenu = this.clickMenu.bind(this);
    };

    clickMenu(id){
        const option =this.menuOptions.find((menuOption) =>{
            return menuOption.id == id;
        });

        if(option){
           this.props.history.push(option.href);
        }
    }
    render(){
        return(
            <Main>
                <Toolbar>
                    <span>&nbsp;</span>
                    <span className={styles.title}>Administration</span>
                    <span>&nbsp;</span>
                </Toolbar>
                <VerticalNavMenu
                    idField="id"
                    captionField="name"
                    defaultAction={(id) => this.clickMenu(id)}
                    data={this.menuOptions}
                />
            </Main>
        );
    }
}


export default Index
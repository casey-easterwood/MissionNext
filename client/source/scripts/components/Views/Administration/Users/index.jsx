/**
 * @var auth
 */

import React, {Component} from 'react';
import styles from './styles.scss';
import Main from '../../Elements/Layout/Main';
import ToolBar from "../../Elements/ToolBar";
import Content from "../../Elements/Layout/Content";
import ToolbarButton from "../../Elements/ToolbarButton";
import VerticalMenu from "../../Elements/VerticalMenu";

class Users extends Component {
    dataProvider = window.dataProvider.users;

    constructor(props) {
        super(props);

        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.onUsersLoaded = this.onUsersLoaded.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.getFilteredUsers = this.getFilteredUsers.bind(this);

        this.state = {
            searchFilter: '',
        };

    };

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);
        this.dataProvider.getAllUsers();
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        if(event == ""){
            this.onUsersLoaded(data);
        }

        this.setState({users: this.dataProvider.getRows()});
    }

    onUsersLoaded(data){
        this.setState({users: data});
    }

    onSearchChanged(e){
        this.setState({searchFilter:e.target.value});
    }

    getFilteredUsers(){
        let searchFilter = this.state.searchFilter;

        return this.dataProvider.rows.filter((item) =>{
            let filtered = false;

            if(item.getFieldValue('UserLogin').toLocaleLowerCase().indexOf(searchFilter) > -1)
                filtered = true;
            if(item.getFieldValue('FirstName').toLocaleLowerCase().indexOf(searchFilter) > -1)
                filtered = true;
            if(item.getFieldValue('LastName').toLocaleLowerCase().indexOf(searchFilter) > -1)
                filtered = true;

            return filtered;
        })
    }

    render(){
        let menuActions = [
            {caption:"Edit User", onClick:(id) => this.props.history.push(`/user/edit/${id}`), warning:false},
            {caption:"View Profile", onClick:(id) => this.props.history.push(`/user/view/${id}`), warning:false},
            {caption:"Change Password", onClick:(id) => this.props.history.push(`/user/resetpassword/${id}`), warning:false},
            {caption:"Delete User", onClick:(id) => this.props.history.push(`/user/delete/${id}`), warning: true},
        ];

        return(
            <Main>
                <ToolBar>
                    <div>
                        <input id="searchValue"
                               name="searchValue"
                               type="text"
                               style={{boxShadow: "7px 7px 7px rgba(0, 0, 0, 0.50)"}}
                               placeholder="Search Users"
                               onChange={this.onSearchChanged}
                               className={styles.sidebarSearchInput}
                        />
                    </div>
                    <ToolbarButton caption={'New'} onClick={() => this.props.history.push(`/user/create`)}/>
                </ToolBar>
                <Content>
                    <VerticalMenu
                        icon="baseline-person-24px.svg"
                        idField="UserId"
                        captionField="UserLogin"
                        defaultAction={(id) => this.props.history.push(`/user/view/${id}`)}
                        menuActions={menuActions}
                        data={this.getFilteredUsers()}
                    />
                </Content>
            </Main>
        );
    }
}

export default Users
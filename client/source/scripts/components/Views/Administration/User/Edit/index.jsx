/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../../Elements/LinkButton';
import Form from '../../../../Elements/Form';
import FormGroup from '../../../../Elements/FormGroup';
import FormGroupSelect from '../../../../Elements/FormGroupSelect';
import FormSection from "../../../../Elements/FormSection";
import styles  from './styles.scss';
import {BackButton} from "../../../../Elements/BackButton";
import ModalConfirm from "../../../../Elements/ModalConfirm";
import {EVENT_TYPES} from "../../../../../Data/AdministrationProvider/UsersRoles";
import FormGroupButton from "../../../../Elements/FormGroupButton";
import Modal from "../../../../Elements/Modal";
import VerticalNavMenu from "../../../../Elements/VerticalNavMenu";
import AgenciesSearchModal from "../../AgenciesSearchModal";
import CandidatesSearchModal from "../../CandidatesSearchModal"

class Loader {
    constructor(){
        this.load = this.load.bind(this);
        this.loadUserRoles = this.loadUserRoles.bind(this);
        this.loadUser = this.loadUser.bind(this);

    }

    load(userId){
        const loader = this;

        let data = {
            userRoles : [],
            user : {}
        };

        return new Promise((resolve, reject) => {
            let getUserRoles = loader.loadUserRoles();
            let getUser = loader.loadUser(userId);

            let promises = [
                getUserRoles,
                getUser
            ];

            Promise.all(promises).then((results) => {
                data.userRoles = results[0];
                data.user = results[1];

                resolve(data);
            })
        });
    }

    loadUserRoles() {
        return new Promise((resolve, reject) => {
            const handler = (event, data) => {
                if(event == EVENT_TYPES.LOADED){
                    let userRoles = [];

                    window.dataProvider.usersRoles.rows.map((role) =>{
                        userRoles.push(role);
                    });

                    window.dataProvider.usersRoles.unsubscribe(this);
                    resolve(userRoles);
                }
            };

            window.dataProvider.usersRoles.subscribeToChanges(handler);
            window.dataProvider.usersRoles.getAll();
        })
    }

    loadUser(userId) {
        return new Promise((resolve, reject) => {
            const handler = function(event, data){

                if(event == "USERS_LOADED"){
                    const user = window.dataProvider.users.getRow(userId);

                    window.dataProvider.users.unsubscribe(this);
                    resolve(user);
                }
            };

            window.dataProvider.users.subscribeToChanges(handler);
            window.dataProvider.users.getAllUsers();
        })
    }
}

class Edit extends Component {
    dataProvider = window.dataProvider.users;

    constructor(props) {
        super(props);

        this.getTitle = this.getTitle.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.savedDialog = this.savedDialog.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.userRoleDialog = this.userRoleDialog.bind(this);
        this.selectUserRole = this.selectUserRole.bind(this);
        this.closeRoleDialog = this.closeRoleDialog.bind(this);
        this.agencySelected = this.agencySelected.bind(this);
        this.candidateSelected = this.candidateSelected.bind(this);

        this.state = {
            loading: true,
            showSavedDialog: false,
            showRoleDialog: false,
            showAgencyDialog: false,
            showCandidatesDialog: false,
            roleEntity: {
                type: 0,
                id: 0,
                name: ''
            },
            item: null,
            debounce: (new Date()).getTime()
        }
    }

    componentDidMount(){
        const loader = new Loader();
        const userId = this.props.match.params.id;

        loader.load(userId).then(data => {
            this.state.userRoles = data.userRoles;
            this.state.item = data.user;
            this.state.loading = false;
            this.setState(this.state);
        });

        this.dataProvider.subscribeToChanges(this.providerHandler);
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        if (event == "USER_SAVED"){
            this.state.showSavedDialog = true;
        }

        this.setState(this.state);
    }

    getTitle(){
        const { item } = this.state;

        if(item == null) return "";

        let name
            = item.getFieldValue('FirstName')
            + " "
            + item.getFieldValue('LastName');

        if(name == " ")
            name = item.getFieldValue('UserLogin');

        return 'Edit ' + name;
    }

    saveUser(){
        if((new Date()).getTime() > this.state.debounce) {
            const {item} = this.state;

            if(item.validate()){
                if (!item.isDirty())
                    this.setState({showSavedDialog:true});
                else
                    this.dataProvider.saveChanges();
            }
        }

        this.setState({debounce: (new Date()).getTime() + 3000});
    }

    savedDialog(){
        return (
            <ModalConfirm
                title={"User Saved"}
                message={"The User was successfully saved,"}
                confirm={() => this.props.history.push('/administration/users')}
                open={this.state.showSavedDialog}
            />
        )
    }

    userRoleDialog(){
        const { userRoles } = this.state;
        let roleOptions = [];

        if(userRoles) {
            roleOptions = userRoles.map(role => {
                return {Id: role.fields['Id'].getValue(), Name: role.fields['RoleName'].getValue()}
            });
        }

        return (
            <Modal open={this.state.showRoleDialog}
                   close={this.closeRoleDialog}>
                <h2>Choose A Agency</h2>
                <VerticalNavMenu
                    idField="Id"
                    captionField="Name"
                    defaultAction={(id) => this.selectUserRole(id)}
                    data={roleOptions}
                />
            </Modal>
        )
    }

    selectUserRole(roleId){
        const { item, roleEntity } = this.state;
        const role = window.dataProvider.usersRoles.getRow(roleId);

        this.setState({showRoleDialog:false});

        switch (roleId) {
            case '1':
                //administrator
                roleEntity.type = 1;
                roleEntity.id = 0;
                roleEntity.name = '';

                item.fields["RoleId"].setValue(1);
                item.fields["RoleName"].setValue('administrator');
                item.fields["EntityId"].setValue(0);
                item.fields["EntityName"].setValue('');

                this.setState({roleEntity: roleEntity, item: item});
                break;
            case '2':
                //candidate
                roleEntity.type = role.fields["Id"].getValue();
                roleEntity.id = 0;
                roleEntity.name = '';

                item.fields["RoleId"].setValue(role.fields["Id"].getValue());
                item.fields["RoleName"].setValue(role.fields["RoleName"].getValue());
                item.fields["EntityId"].setValue(0);
                item.fields["EntityName"].setValue('');

                this.setState({showCandidatesDialog: true, roleEntity: roleEntity, item: item});
                break;
            case '3':
                //agency
                roleEntity.type = role.fields["Id"].getValue();
                roleEntity.id = 0;
                roleEntity.name = '';

                item.fields["RoleId"].setValue(role.fields["Id"].getValue());
                item.fields["RoleName"].setValue(role.fields["RoleName"].getValue());
                item.fields["EntityId"].setValue(0);
                item.fields["EntityName"].setValue('');

                this.setState({showAgencyDialog: true, roleEntity: roleEntity, item: item});
                break;
        }

    }

    closeRoleDialog(){
        this.setState({showRoleDialog:false});
    }

    agencySelected(id){
        this.setState({showAgencyDialog: false});

        const agency = window.dataProvider.agencies.getRow(id);

        if(agency){
            const { item, roleEntity} = this.state;

            roleEntity.type = item.fields['RoleId'].getValue();
            roleEntity.id = agency.fields['Id'].getValue();
            roleEntity.name = agency.fields['Name'].getValue();

            item.fields["EntityId"].setValue(roleEntity.id);
            item.fields["EntityName"].setValue(roleEntity.name);

            this.setState({roleEntity: roleEntity, item: item});
        }
    }

    candidateSelected(id){
        this.setState({showCandidatesDialog: false});

        const candidate = window.dataProvider.candidates.getRow(id);

        if(candidate){
            const { item, roleEntity} = this.state;

            roleEntity.type = item.fields['RoleId'].getValue();
            roleEntity.id = candidate.fields['Id'].getValue();
            roleEntity.name = candidate.fields['Name'].getValue();

            item.fields["EntityId"].setValue(roleEntity.id);
            item.fields["EntityName"].setValue(roleEntity.name);

            this.setState({roleEntity: roleEntity, item: item});
        }
    }

    render(){
        const { item, userRoles, loading } = this.state;

        const UserRoleDialog = this.userRoleDialog;
        const SavedDialog = this.savedDialog;
        const title = this.getTitle();
        let roleOptions = [];
        let selectedRole = null;
        let itemId = 0;

        if(!loading) {
            itemId = item.fields['UserId'].getValue();
        }

        if(userRoles) {
            roleOptions = userRoles.map(role => {
                return {value: role.fields['Id'].getValue(), label: role.fields['RoleName'].getValue()}
            });

            selectedRole = roleOptions.find(option => item.fields['RoleId'].getValue() === option.value )
        } else {
            roleOptions = [{value:0, label:'Loading'}];
            selectedRole = roleOptions[0];
        }

        return(
            <Fragment>
                <UserRoleDialog/>
                <SavedDialog />
                <AgenciesSearchModal
                    show={this.state.showAgencyDialog}
                    close={ () => this.setState({showAgencyDialog: false})}
                    onItemSelected={this.agencySelected}
                />
                <CandidatesSearchModal
                    show={this.state.showCandidatesDialog}
                    close={ () => this.setState({showCandidatesDialog: false})}
                    onItemSelected={this.candidateSelected}
                />

                {!this.state.loading &&
                    <Form save={this.saveUser}>
                        <FormSection justify={"start"}>
                            <h3>{title}</h3>
                            <FormGroup
                                id="FirstName"
                                label="First Name"
                                value={item.fields['FirstName'].getValue()}
                                validationMessage={item.fields['FirstName'].getValidationMessage()}
                                onChange={(e) => item.fields['FirstName'].setValue(e.target.value)}
                            />
                            <FormGroup
                                id="LastName"
                                label="Last Name"
                                value={item.fields['LastName'].getValue()}
                                validationMessage={item.fields['LastName'].getValidationMessage()}
                                onChange={(e) => item.fields['LastName'].setValue(e.target.value)}
                            />
                            <FormGroup
                                id="Email"
                                label="Email Address"
                                value={item.fields['Email'].getValue()}
                                validationMessage={item.fields['Email'].getValidationMessage()}
                                onChange={(e) => item.fields['Email'].setValue(e.target.value)}
                            />

                        </FormSection>
                        <FormSection justify={"start"}>
                            <FormGroupButton
                                id="UserType"
                                label={"Role"}
                                value={item.fields['RoleName'].getValue()}
                                validationMessage = {""}
                                onChange={(e) => {}}
                                onClick={() => this.setState({showRoleDialog: true})}
                            />
                            {item.fields["RoleId"].getValue() > 1 &&
                            <FormGroupButton
                                id="UserTypeId"
                                label={item.fields['RoleName'].getValue()}
                                value={item.fields['EntityName'].getValue()}
                                validationMessage={this.state.selectedAgencyValidation}
                                onChange={(e) => {
                                }}
                                onClick={() => {
                                    debugger;
                                    switch (this.state.roleEntity.type) {
                                        case 1:
                                            //administrator
                                            break;
                                        case 2:
                                            //candidate
                                            this.setState({showCandidatesDialog: true})
                                            break;
                                        case 3:
                                            //agency
                                            this.setState({showAgencyDialog: true})
                                            break;
                                    }
                                }}
                            />
                            }
                    </FormSection>

                    <FormSection justify={"end"}>
                        <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.goBack()} caption="Close"/>
                        <LinkButton type={'primary'} href="#" onClick={this.saveUser} caption="Save"/>
                    </FormSection>
                </Form>
                }
                {this.state.loading &&
                    <h2>Loading....</h2>
                }

            </Fragment>
        )
    }
}

export default Edit
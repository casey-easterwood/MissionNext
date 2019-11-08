import Repository from "../Repository";
import UsersRolesApi from "../../Api/UsersRoles";
import UsersRoleDataRow from "../../Models/UsersRoleDataRow";

export class EVENT_TYPES {
    static LOADED = "USERS_ROLES_LOADED";
    static EXISTS = "USERS_ROLES_EXISTS";
    static CREATED = "USERS_ROLES_CREATED";
    static SAVED = "USERS_ROLES_SAVED";
    static DELETED = "USERS_ROLES_DELETED";
}


class UsersRoles extends Repository {
    constructor(){
        super();

        this.Api = new UsersRolesApi();

        this.getAll        = this.getAll.bind(this);
        this.saveChanges        = this.saveChanges.bind(this);
        this.onSaved            = this.onSaved.bind(this);
        this.onDeleted          = this.onDeleted.bind(this);
        this.createNew          = this.createNew.bind(this);
    }

    getAll(){
        if(this.rows.length == 0) {
            this.Api.getAll()
                .then(results => {
                    for (let record of results) {
                        let user = new UsersRoleDataRow(record);
                        this.addRow(user);
                    }
                    this.publishChanges(EVENT_TYPES.LOADED, this.getRows());
                });
        } else {
            this.publishChanges(EVENT_TYPES.LOADED, this.getRows());
        }
    }

    saveChanges(){
        for(let r of this.rows){
            if(r.isDirty()){
                let fieldData = r.getChanges();

                this.Api.update(fieldData)
                    .then((response) =>{
                        r.markClean();
                        this.onSaved(response);
                    });
            }
        }
    }

    checkRoleExists(roleName){
        this.Api.exists(roleName)

        .then((response) =>{
            this.publishChanges(EVENT_TYPES.EXISTS, response);
        });
    }

    createNew(fieldData){
        let roleData = [];
        roleData.push({name:"RoleName", value: fieldData.RoleName});
        roleData.push({name:"Description", value: fieldData.Description});

        this.Api.create(roleData)
        .then((response) =>{
            if(response.status == "success") {
                const insertId = response.insertId;

                const newUserData = {
                    Id: insertId,
                    RoleName: fieldData.RoleName,
                    Description: fieldData.Description,
                };

                let newRow = new UsersRoleDataRow(newUserData);

                this.addRow(newRow);
                this.publishChanges(EVENT_TYPES.CREATED, insertId);
            }
        });
    }

    delete(roleId){
        this.Api.delete(roleId)
            .then((response) =>{
                this.onDeleted(response);
            });
    }

    onSaved(response) {
        if(response.status == 'error'){
            if(response.message =='ER_DUP_ENTRY') {
                let field = user.getField("RoleName");
                field.isValid = false;
                field.message = 'Role already exists';
            } else {

            }
        }

        //order matters publish after updating repo
        this.publishChanges(EVENT_TYPES.SAVED, response);
    }

    onDeleted(response) {
        if(response.status == 'error'){
            console.log(response.error);
            return;
        }

        const roleId = response.message;

        for(let i=0;i<this.rows.length;i++){
            let r = this.rows[i];

            if(r.fields["Id"].getValue() == roleId){
                this.rows.splice(i,1);
            }
        }

        //order matters publish before updating repo
        this.publishChanges(EVENT_TYPES.DELETED, response.message);
    }
}

export default UsersRoles;
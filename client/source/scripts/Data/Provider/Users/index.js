import Repository from "../Repository";
import UsersApi from "../../Api/Users";
import UserDataRow from "../../Models/UserDataRow";

class Users extends Repository {
    constructor(){
        super();

        this.Api = new UsersApi();

        this.getAllUsers        = this.getAllUsers.bind(this);
        this.saveChanges        = this.saveChanges.bind(this);
        this.resetPassword      = this.resetPassword.bind(this);
        this.onPasswordSaved    = this.onPasswordSaved.bind(this);
        this.onSaved            = this.onSaved.bind(this);
        this.onDeleted          = this.onDeleted.bind(this);
        this.createNew          = this.createNew.bind(this);
    }

    getAllUsers(){
        if(this.rows.length == 0) {
            this.Api.getAll()
                .then(results => {
                    for (let record of results) {
                        let user = new UserDataRow(record);
                        this.addRow(user);
                    }
                    this.publishChanges("USERS_LOADED", this.getRows());
                });
        } else {
            this.publishChanges("USERS_LOADED", this.getRows());
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

    checkUserLoginExists(userLogin){
        this.Api.userExists(userLogin)

        .then((response) =>{
            this.publishChanges("USER_EXISTS", response);
        });
    }

    createNew(fieldData){
        let userData = [];
        userData.push({name:"UserLogin", value: fieldData.UserLogin});
        userData.push({name:"UserPassword", value: fieldData.UserPassword});
        userData.push({name:"Email", value: fieldData.Email});

        this.Api.create(userData)
        .then((response) =>{
            if(response.status == "success") {
                const insertId = response.insertId;

                const newUserData = {
                    UserId: insertId,
                    UserLogin: fieldData.UserLogin,
                    FirstName: '',
                    LastName: '',
                    Email: fieldData.Email,
                    Role: ''
                };

                let UserRow = new UserDataRow(newUserData);

                this.addRow(UserRow);
                this.publishChanges("USER_CREATED", insertId);
            }
        });
    }

    resetPassword(userId, password){
        this.Api.resetPassword(userId, password)
            .then((response) =>{
                this.onPasswordSaved(response);
            });
    }

    delete(userId){
        this.Api.delete(userId)
            .then((response) =>{
                this.onDeleted(response);
            });
    }

    onSaved(response) {
        if(response.status == 'error'){
            if(response.message =='ER_DUP_ENTRY') {
                let field = user.getField("UserLogin");
                field.isValid = false;
                field.message = 'Username already exists';
            } else {

            }
        }

        //order matters publish after updating repo
        this.publishChanges("USER_SAVED", response);
    }

    onPasswordSaved(response) {
        if(response.status == 'error'){
            console.log(response.error);
        }

        //order matters publish before updating repo
        this.publishChanges("PASSWORD_SAVED", response);
    }

    onDeleted(response) {
        if(response.status == 'error'){
            console.log(response.error);
            return;
        }

        const userId = response.message;

        for(let i=0;i<this.rows.length;i++){
            let r = this.rows[i];

            if(r.fields["UserId"].getValue() == userId){
                this.rows.splice(i,1);
            }
        }

        //order matters publish before updating repo
        this.publishChanges("USER_DELETED", response.message);
    }
}

export default Users;
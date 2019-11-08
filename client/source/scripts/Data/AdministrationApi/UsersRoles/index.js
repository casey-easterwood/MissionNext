import Api from '../Api';

class UsersRoles extends Api{
    constructor() {
        super();
    }

    getAll(){
        return fetch("/api/users/roles/getAll",{
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Authentication' : this.getAuthHeader()
            },
        })
        .then((response) => {
            if(response.ok)
                return response.json();
            else
                alert("Server error");
        })
    }

    update(data){
        return fetch("/api/users/roles/update",{
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authentication' : this.getAuthHeader()
            },
        })
        .then(response => response.json())
    }

    create(data){
        return fetch("/api/users/roles/createNew",{
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authentication' : this.getAuthHeader()
            },
        })
        .then(response => response.json())
    }

    exists(roleName){
        return fetch("/api/users/roles/exists",{
            method: "POST",
            credentials: "include",
            body: JSON.stringify({roleName:roleName}),
            headers: {
                'Content-Type': 'application/json',
                'Authentication' : this.getAuthHeader()
            },
        })
        .then(response => response.json())
    }

    delete(userId){
        let data = [
            {name:"UserId", value:userId},
        ];

        return fetch("/api/users/roles/delete",{
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authentication' : this.getAuthHeader()
            },
        })
        .then(response => response.json())
    }

    static getInstance(){
        return new UsersRoles();
    }
}

export default UsersRoles
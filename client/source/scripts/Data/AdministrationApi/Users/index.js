import Api from '../Api';

class Users extends Api{
    constructor() {
        super();
    }

    getAll(){
        return fetch("/api/users/getAll",{
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
        return fetch("/api/users/update",{
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
        return fetch("/api/users/createNew",{
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

    userExists(userName){
        return fetch("/api/users/userExists",{
            method: "POST",
            credentials: "include",
            body: JSON.stringify({userName:userName}),
            headers: {
                'Content-Type': 'application/json',
                'Authentication' : this.getAuthHeader()
            },
        })
        .then(response => response.json())
    }

    resetPassword(userId, password){
        let data = [
            {name:"UserId", value:userId},
            {name:"UserPassword", value:password}
        ];

        return fetch("/api/users/resetPassword",{
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

    delete(userId){
        let data = [
            {name:"UserId", value:userId},
        ];

        return fetch("/api/users/delete",{
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
        return new Users();
    }
}

export default Users
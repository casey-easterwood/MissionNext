class Authentication {
    verify(credentials){
        return fetch("/api/authenticate",{
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                UserLogin: credentials.userLogin,
                UserPassword: credentials.userPassword
            }),
        })
        .then(response => response.json())
    }

    static getInstance(){
        return new Authentication();
    }
}

export default Authentication
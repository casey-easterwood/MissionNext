class Api {
    constructor() {
        this.getAuthHeader = this.getAuthHeader.bind(this);
    }

    getAuthHeader(){
        // debugger;
        let auth = JSON.parse(sessionStorage.getItem('auth'));
        return auth.Token;
    }
}

export default Api;
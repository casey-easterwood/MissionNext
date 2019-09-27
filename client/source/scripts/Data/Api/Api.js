class Api {
    constructor() {
        this.getAuthHeader = this.getAuthHeader.bind(this);
    }


    getAuthHeader(){
        let auth = JSON.parse(sessionStorage.getItem('auth'));
        return auth.token;
    }
}

export default Api;
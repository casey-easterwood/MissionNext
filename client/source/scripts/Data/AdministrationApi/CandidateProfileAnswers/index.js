import Api from '../../Api';

class CandidateProfileAnswers extends Api{
    constructor() {
        super();
    }

    getByCandidate(id){
        return fetch(`/api/candidate/profile/listByCandidate?id=${id}`,{
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
        return fetch("/api/candidate/profile/update",{
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
        return fetch("/api/candidate/profile/createNew",{
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

    delete(id){
        let data = [
            {id: id},
        ];

        return fetch("/api/candidate/profile/delete",{
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
        return new CandidateProfileAnswers();
    }
}

export default CandidateProfileAnswers
import httpClient from "../http-common";


const register = data => {
    return httpClient.post('/api/v1/users/register', data);
}

const login = (data) => {
    return httpClient.post('/api/v1/users/login', data);
}

export default { register, login };
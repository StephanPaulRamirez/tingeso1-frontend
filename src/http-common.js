import axios from "axios";

const BackendServer = import.meta.env.VITE_BACKEND_SERVER;
const BackendPort = import.meta.env.VITE_BACKEND_PORT;

console.log(BackendServer)
console.log(BackendPort)

export default axios.create({
    baseURL: `http://${BackendServer}:${BackendPort}`,
    headers: {
        'Content-Type': 'application/json'
    }
});
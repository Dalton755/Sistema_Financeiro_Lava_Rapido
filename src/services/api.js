import axios from "axios";

const api = axios.create({

    baseURL: "https://sistemafinanceirolavarapido-production.up.railway.app"

});

export default api;
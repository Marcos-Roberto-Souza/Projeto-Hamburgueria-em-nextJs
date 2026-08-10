import axios from 'axios';

export const api = axios.create({
    baseURL: "https://projeto-hamburgueria-em-nextjs-production.up.railway.app",
});
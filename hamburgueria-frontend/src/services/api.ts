import axios from 'axios';

export const api = axios.create({
    baseURL: 'projeto-hamburgueria-em-nextjs-production.up.railway.app',
});
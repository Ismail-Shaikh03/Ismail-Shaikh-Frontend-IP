import axios from "axios";
const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + "/api" : "/api";
export const api = axios.create({ baseURL: base, timeout: 10000 });

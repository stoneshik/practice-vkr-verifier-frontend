import axios from "axios";

export const baseURL = "http://localhost:3351/api/v1"

export const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

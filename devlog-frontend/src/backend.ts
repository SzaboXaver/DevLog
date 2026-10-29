import axios from 'axios';

const url:string = import.meta.env.VITE_API_URL;

export async function register(username:string, email:string, password:string) {
    const response = await axios.post(`${url}register`, {
        username,
        email,
        password
    });
    return response;
}

export async function login(email:string, password:string) {
    const response = await axios.post(`${url}login`, {
        email,
        password
    });
    return response;
}

export async function loadProfile() {
    const accessToken = localStorage.getItem("access_token");
    const response = await axios.get(`${url}loadProfile`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
    return response;
}
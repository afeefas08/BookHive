import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_DJANGO_BASE_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (
        token &&
        !config.url.includes('/users/login/') &&
        !config.url.includes('/users/register/')
    ){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
})

export default api;
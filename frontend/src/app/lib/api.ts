import axios from 'axios';


// point axios to the nest js backend
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
})


// interceptos are of axios , request is sent for get , use is telling to use , config is basically builtin of axios , has details about the 
// request of which we are sending 
api.interceptors.request.use((config) => {

    // just a safety check to make sure we are in the browser and not in node environment 
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token)
    {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;


        
    });

export default api;

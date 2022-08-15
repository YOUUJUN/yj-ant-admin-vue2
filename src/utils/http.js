import axios from 'axios';
import { getToken } from "@/utils/auth";
import router from '@/router';

const baseURL = process.env.VUE_APP_API_BASE_URL;

let service = axios.create({
    baseURL,
    withCredentials :true
});

service.interceptors.request.use(function (config) {
    let token = getToken();
    if (token) {
        config.headers.authorization = token;
        // config.headers['accessToken'] = Token;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

service.interceptors.response.use((response) => {
    console.log('status', response.data.status)
    if(response.data.status == '99'){
        // router.push(`/login`);
        window.location.href = `${process.env.VUE_APP_API_STATIC_URL}/amis-web/static/login/login.html`
        // window.open(`${process.env.VUE_APP_API_STATIC_URL}/amis-web/static/login/login.html`, '_self')
    }
    return response
}, (error) => {
    console.log('error',error)
    return Promise.reject(error);
})


export default service;
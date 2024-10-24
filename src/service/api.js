import axios from 'axios';
import NProgress from 'nprogress';
import { destroyLoginSession, getUserToken, setSessionError } from '../helper/storage';

const $axios = axios.create();
$axios.defaults.timeout = 120000;
$axios.interceptors.request.use(
    async (config) => {
        NProgress.start();
        config.baseURL = process.env.SERVER_API; // 'http://192.168.2.11:4000/';
        config.headers = {
            'Content-Type': 'application/json',
            'user-Type': 'Website',
            token: getUserToken()
        };
        return config;
    },
    (error) => {
        NProgress.done();
        return Promise.reject(error);
    }
);

$axios.interceptors.response.use(
    async (response) => {
        NProgress.done();
        let res = response.data;
        if (res.hasOwnProperty('status_code') && res.status_code == 401) {
            setSessionError(res.message);
            destroyLoginSession();
        }
        return Promise.resolve(response);
    },
    function (error) {
        console.log(error);
        NProgress.done();
        return Promise.reject(error);
    }
);

export default $axios;

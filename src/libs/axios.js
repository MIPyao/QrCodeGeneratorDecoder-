/* eslint-disable */
import axios from 'axios'
import config from '@/config/config'
// import router from "@/router";
const baseUrl = config.api;


// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    if (token && isToken) {
        config.headers['Authorization'] = 'Bearer ' +  token// 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
}, error => {
    return Promise.reject(error)
})

/**
 * 响应拦截器
 */
instance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error && error.response) {
        switch (error.response.status) {
            // case 404:
            //     router.push({name:'error_404'});
            //     break;
            //
            // case 500:
            //     router.push({ name:'error_500'});
            //     break;

            default: error.message = `连接出错(${error.response.status})!`;
        }
    }
    return Promise.reject(error);
});


export default instance;

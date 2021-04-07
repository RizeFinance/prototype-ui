import axios from 'axios';
import config from '../config/config';

const axiosInstance = axios.create({
    baseURL: config.api.baseUrl
});

axiosInstance.interceptors.response.use(undefined, (err) => {
    throw {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data
    };
});

export default axiosInstance;

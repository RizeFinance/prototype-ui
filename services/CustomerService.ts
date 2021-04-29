import { Customer } from '../models';
import api from '../utils/api';

const getCustomer = async (accessToken: string): Promise<Customer> => {
    return await api.get('/customer',
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
        .then((response) => response.data);
};

const verifyIdentity = async (accessToken: string): Promise<Customer> => {
    return await api.put('/customer/identity_verification',
        undefined,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
        .then((response) => response.data);
};

const get = async (accessToken: string): Promise<any> => {
    return await api.put('/customer/get',
        undefined,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
        .then((response) => response.data);
};

export default {
    getCustomer,
    get,
    verifyIdentity,
};
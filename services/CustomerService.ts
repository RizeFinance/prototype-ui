import { Customer, CustomerDetails } from '../models';
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

const updateCustomer = async (
    accessToken: string,
    customerUid: string,
    customerEmail: string,
    customerDetails: CustomerDetails,
): Promise<Customer> => {
    return await api.put('/customer',
        {
            customerUid,
            email: customerEmail,
            details: customerDetails,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
        .then((response) => {
            return response.data;
        });
};

export default {
    getCustomer,
    updateCustomer,
    verifyIdentity,
};
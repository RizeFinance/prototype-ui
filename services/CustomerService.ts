import api from '../utils/api';

const getCustomer = async (accessToken: string): Promise<any> => {
    return await api.get('/customer',
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
        .then((response) => response.data);
};

export default {
    getCustomer
};
import api from '../utils/api';

const register = async (username: string, password: string): Promise<any> => {
    return await api.post('/auth/register', { username, password })
        .then((response) => response.data);
};

const forgot = async (email: string): Promise<any> => {
    return await api.post('/auth/forgot_password', { email })
        .then((response) => response.data);
};

export default {
    register,
    forgot
};

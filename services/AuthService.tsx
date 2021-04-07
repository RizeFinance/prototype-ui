import authApi from '../utils/authApi';

export const authorize = async (
    username: string,
    password: string
): Promise<any> => {
    return await authApi.post('/api/auth/authenticate',
        { 
            'username': username,
            'password': password,
        },
        {}
    ).then((response) => response.data);
};

export default {
    authorize
};
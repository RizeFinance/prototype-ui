import api from '../utils/api';

const register = async (username: string, password: string): Promise<any> => {
  return await api.post('/auth/register', { username, password }).then((response) => response.data);
};

const authorize = async (username: string, password: string): Promise<any> => {
  return await api
    .post(
      '/auth/authenticate',
      {
        username: username,
        password: password,
      },
      {}
    )
    .then((response) => response.data);
};

const forgotPassword = async (email: string): Promise<any> => {
  const { data } = await api.post('/auth/forgot_password', { email });

  return data;
};

const confirmPassword = async (userData: IConfirmPW): Promise<any> => {
  const { data } = await api.post('/auth/confirm_password', userData);
  return data;
};

const setPassword = async (
  username: string,
  oldPassword: string,
  newPassword: string
): Promise<any> => {
  return await api
    .post('/auth/set_password', { username, old_password: oldPassword, new_password: newPassword })
    .then((response) => response.data);
};

export default {
  authorize,
  register,
  forgotPassword,
  setPassword,
  confirmPassword,
};

export interface IConfirmPW {
  email: string;
  code: string;
  password: string;
}

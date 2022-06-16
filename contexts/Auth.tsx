import React, { useContext, useEffect, useState, createContext, useMemo, useCallback } from 'react';
import AuthService, { IConfirmPW } from '../services/AuthService';
import { storeData, getData, removeValue } from '../utils/asyncStorage';
import CustomerService from '../services/CustomerService';
import { Customer, CustomerDetails } from '../models';

export type AuthContextProps = {
  accessToken?: string;
  refreshToken?: string;
  userName?: string;
  login: (userName: string, password: string) => Promise<any>;
  logout: () => void;
  register: (username: string, password: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  confirmPassword: (data: IConfirmPW) => Promise<any>;
  setPassword: (username: string, oldPassword: string, newPassword: string) => Promise<any>;
  createCustomer: (username: string, customerType: string) => Promise<Customer>;
  updateCustomer: (username: string, details: CustomerDetails) => Promise<Customer>;
  refreshCustomer: () => Promise<Customer>;
  customer?: Customer;
  customerProducts?: any;
  setCustomer: React.Dispatch<React.SetStateAction<Customer>>;
};

export const AuthContext = createContext<AuthContextProps>({
  accessToken: '',
  refreshToken: '',
  userName: '',
  login: () => Promise.resolve(),
  logout: () => null,
  register: () => Promise.resolve(null),
  forgotPassword: () => Promise.resolve(null),
  setPassword: () => Promise.resolve(null),
  createCustomer: () => Promise.resolve(null),
  updateCustomer: () => Promise.resolve(null),
  refreshCustomer: () => Promise.resolve(null),
  confirmPassword: () => Promise.resolve(null),
  customer: undefined,
  customerProducts: [],
  setCustomer: () => null,
});

export type AuthProviderState = {
  accessToken?: string;
  refreshToken?: string;
  userName?: string;
  customer?: Customer;
  customerProducts?: any;
};

const initialState = {
  accessToken: '',
  refreshToken: '',
  userName: '',
  customer: undefined,
  customerProducts: [],
};

export interface AuthProviderProps {
  children?: React.ReactChildren[];
}

export const AuthProvider = ({ children }: AuthProviderProps): AuthProviderProps => {
  const [authData, setAuthData] = useState<AuthProviderState>(initialState);

  useEffect(() => {
    const getTokens = async () => {
      try {
        const { accessToken, refreshToken, userName } = await getData({ storageKey: '@tokens' });

        if (accessToken) {
          try {
            const customer = await CustomerService.getCustomer(accessToken);

            const { data: customerProducts } = await CustomerService.getCustomerProducts(
              accessToken,
              customer.uid
            );

            setAuthData({
              accessToken,
              refreshToken,
              customer,
              customerProducts,
            });
          } catch (err) {
            removeValue({ storageKey: '@tokens' });
          }
        }
      } catch (err) {
        setAuthData(initialState);
      }
    };
    if (!authData.customer) {
      getTokens();
    }
  }, [authData.customer]);

  useEffect(() => {
    console.log('CHANGED: ', authData);
  }, [authData]);

  const logout = useCallback(() => {
    setAuthData(initialState);
    removeValue({ storageKey: '@tokens' });
  }, []);

  const login = useCallback(async (userName: string, password: string): Promise<any> => {
    setAuthData((initialState) => ({ ...initialState, userName }));

    try {
      const response = await AuthService.authorize(userName, password);
      const { data } = response;

      const auth: AuthProviderState = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userName,
      };
      try {
        const customer = await CustomerService.getCustomer(data.accessToken);
        auth.customer = customer;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Customer not found, assume new customer init');
      } finally {
        setAuthData(auth);
      }

      const tokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userName,
      };

      storeData({ storageKey: '@tokens', data: tokens });

      return response;
    } catch (err) {
      if (err.status === 403) {
        return {
          success: false,
          message: 'Wrong Email and/or Password.',
        };
      } else if (err.status === 429) {
        return {
          success: false,
          message: 'Too Many Login Attempts.',
        };
      } else if (err.status === 401) {
        return { success: false, message: 'Unauthorized' };
      } else {
        throw err;
      }
    }
  }, []);

  const register = useCallback(async (username: string, password: string): Promise<any> => {
    try {
      const result = await AuthService.register(username, password);

      if (result.success && result.data && result.data.accessToken) {
        setAuthData((initialState) => ({
          ...initialState,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        }));
      }

      return result;
    } catch (err) {
      return {
        success: false,
        message: err.data.message,
      };
    }
  }, []);

  const forgotPassword = useCallback(async (email: string): Promise<any> => {
    try {
      const response = await AuthService.forgotPassword(email);
      return {
        ...response,
        message: 'The password reset code has been sent to your email address.',
      };
    } catch (err) {
      if (err.status === 429) {
        return {
          success: false,
          message: 'Too many attempts, please try again after some time',
        };
      }
      return {
        success: false,
        message: 'Something went wrong. Please try again.',
      };
    }
  }, []);

  const confirmPassword = useCallback(async (data: IConfirmPW): Promise<any> => {
    try {
      const response = await AuthService.confirmPassword(data);
      return response;
    } catch (err) {
      return { success: false };
    }
  }, []);

  const setPassword = useCallback(
    async (username: string, oldPassword: string, newPassword: string): Promise<any> => {
      try {
        const result = await AuthService.setPassword(username, oldPassword, newPassword);
        if (result.success && result.data.accessToken) {
          setAuthData((initialState) => ({
            ...initialState,
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
          }));
        }

        const tokens = {
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
          userName: username,
        };

        storeData({ storageKey: '@tokens', data: tokens });

        return result;
      } catch (err) {
        return err;
      }
    },
    []
  );

  const createCustomer = async (username: string, customer_type: string): Promise<Customer> => {
    if (!authData.accessToken) {
      throw Error('No Auth');
    }

    try {
      await CustomerService.createCustomer(authData.accessToken, username, customer_type);
      return this.refreshCustomer();
    } catch (err) {
      return err;
    }
  };

  const updateCustomer = async (username: string, details: CustomerDetails): Promise<Customer> => {
    if (!authData.accessToken) {
      throw Error('No Auth');
    }

    try {
      await CustomerService.updateCustomer(authData.accessToken, username, details);
      return this.refreshCustomer();
    } catch (err) {
      return err;
    }
  };

  const refreshCustomer = useCallback(async (): Promise<Customer> => {
    if (!authData.customer) {
      return undefined;
    }

    const customer = await CustomerService.getCustomer(authData.accessToken);
    const { data: customerProducts } = await CustomerService.getCustomerProducts(
      authData.accessToken,
      customer.uid
    );

    if (customer) {
      setAuthData((authData) => ({
        ...authData,
        customer,
        customerProducts,
      }));
    }

    return customer;
  }, [authData.accessToken, authData.customer]);

  const setCustomer = useCallback(async (customer: Customer) => {
    await setAuthData((authData) => ({
      ...authData,
      customer,
    }));
  }, []);

  const { accessToken, refreshToken, userName, customer, customerProducts } = authData;

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      userName,
      login,
      register,
      forgotPassword,
      setPassword,
      logout,
      customer,
      customerProducts,
      createCustomer,
      updateCustomer,
      refreshCustomer,
      setCustomer,
      confirmPassword,
    }),
    [
      accessToken,
      refreshToken,
      userName,
      login,
      register,
      forgotPassword,
      setPassword,
      logout,
      customer,
      customerProducts,
      createCustomer,
      updateCustomer,
      refreshCustomer,
      setCustomer,
      confirmPassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => useContext(AuthContext);

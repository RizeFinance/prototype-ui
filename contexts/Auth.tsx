import React, { useContext, useEffect, useState, createContext, useMemo, useCallback } from 'react';
import AuthService, { IConfirmPW } from '../services/AuthService';
import { storeData, getData, removeValue } from '../utils/asyncStorage';
import { CustomerService } from '../services';
import { Customer } from '../models';

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
  const [authIsLoading, setAuthIsLoading] = useState(true);

  useEffect(() => {
    const getTokens = async () => {
      try {
        setAuthIsLoading(true);
        const { accessToken, refreshToken } = await getData({ storageKey: '@tokens' });

        if (accessToken) {
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
        }
        setAuthIsLoading(false);
      } catch (err) {
        setAuthData(initialState);
        setAuthIsLoading(false);
      }
    };
    if (!authData.customer) {
      getTokens();
    }
  }, [authData.customer]);

  const logout = useCallback(() => {
    setAuthData(initialState);
    removeValue({ storageKey: '@tokens' });
  }, []);

  const login = useCallback(async (userName: string, password: string): Promise<any> => {
    setAuthData((initialState) => ({ ...initialState, userName }));

    try {
      setAuthIsLoading(true);
      const response = await AuthService.authorize(userName, password);
      const { data } = response;

      if (data && data.accessToken) {
        const customer = await CustomerService.getCustomer(data.accessToken);

        if (customer) {
          const customerData = {
            customer,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
          setAuthData(customerData);
        }

        const tokens = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };

        storeData({ storageKey: '@tokens', data: tokens });
      }
      setAuthIsLoading(false);

      return response;
    } catch (err) {
      setAuthIsLoading(false);
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

        return result;
      } catch (err) {
        return err;
      }
    },
    []
  );

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
      refreshCustomer,
      setCustomer,
      confirmPassword,
      authIsLoading,
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
      refreshCustomer,
      setCustomer,
      confirmPassword,
      authIsLoading,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => useContext(AuthContext);

export interface CustomerData {
  uid: string;
  external_uid: string;
  program_uid: string;
  email: string;
  status: string;
  kyc_status?: any;
  total_balance: number;
  created_at: Date;
  locked_at?: any;
  lock_reason?: any;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  phone: string;
  dob: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  postal_code: string;
}

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
  refreshCustomer: () => Promise<Customer>;
  customer?: CustomerData;
  customerProducts?: any;
  setCustomer: React.Dispatch<React.SetStateAction<Customer>>;
  authIsLoading: boolean;
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
  refreshCustomer: () => Promise.resolve(null),
  confirmPassword: () => Promise.resolve(null),
  customer: undefined,
  customerProducts: [],
  setCustomer: () => null,
  authIsLoading: true,
});

export type AuthProviderState = {
  accessToken?: string;
  refreshToken?: string;
  userName?: string;
  customer: Customer;
  customerProducts?: any;
};

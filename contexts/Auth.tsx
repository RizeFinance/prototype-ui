import React, {
  useContext,
  useEffect,
  useState,
  createContext,
  useMemo,
} from 'react';
import AuthService from '../services/AuthService';
import {storeData, getData, removeValue} from '../utils/asyncStorage'
import CustomerService from '../services/CustomerService';
import { Customer } from '../models';



export type AuthContextProps = {
    accessToken?: string;
    refreshToken?: string;
    userName?: string;
    login: (userName: string, password: string) => Promise<any>;
    logout: () => void;
    register: (username: string, password: string) => Promise<any>;
    forgotPassword: (email: string) => Promise<any>;
    setPassword: (username: string, oldPassword: string, newPassword: string) => Promise<any>;
    refreshCustomer: () => Promise<Customer>;
    customer?: Customer;
    setCustomer: React.Dispatch<React.SetStateAction<Customer>>;


}

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
  customer: undefined,
  setCustomer: () => null,
});

export type AuthProviderState = {
    accessToken?: string;
    refreshToken?: string
    userName?: string
    customer?: Customer
};

const initialState = {
  accessToken: '',
  refreshToken: '',
  userName: '',
  customer: undefined,
};

export interface AuthProviderProps {
    children?: JSX.Element;
}

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState<AuthProviderState>({
    accessToken: '',
    refreshToken: '',
    userName: '',
    customer: undefined,
  });

 

  useEffect(() => {
    const getTokens = async () => {
      try {
        const {accessToken, refreshToken} = await getData({storageKey: '@tokens'});
  
        if (accessToken) {
          const customer = await CustomerService.getCustomer(accessToken);
          setAuthData({
            accessToken,
            refreshToken,
            customer,
          })
        }
      } catch(err) {
        setAuthData(initialState)
      }
    };
    if(!authData.customer) {
      getTokens();
    }
  }, []);

  const logout = (): void => {
    setAuthData(initialState);
    removeValue({storageKey: '@tokens'});
  };

  const login = async (userName: string, password: string): Promise<any> => {
    setAuthData(initialState => ({ ...initialState, userName }));

    try {
      const { data } = await AuthService.authorize(userName, password);
      
      if (data && data.accessToken) {
        const customer = await CustomerService.getCustomer(data.accessToken);

        if(customer) {
          const customerData = {
            customer,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
          setAuthData(customerData)
        }
        
        const tokens = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };

        storeData({ storageKey: '@tokens', data: tokens });
      }
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
  };

  const register = async (username: string, password: string): Promise<any> => {
        try {
            const result = await AuthService.register(username, password);

            if (result.success && result.data && result.data.accessToken) {
        setAuthData(initialState => ({
          ...initialState,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        }));
      }

            return result;
        } catch (err) {
            return {
                success: false
            };
        }
    }

  const forgotPassword = async (email: string): Promise<any> => {
        try {
            return await AuthService.forgotPassword(email);
        } catch (err) {
            return {
                success: false
            };
        }
    }

  const setPassword = async (
    username: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<any> => {
    try {
      const result = await AuthService.setPassword(
        username,
        oldPassword,
        newPassword,
      );

      if (result.success && result.data.accessToken) {
        setAuthData(initialState => ({
          ...initialState,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        }));
      }

      return result;
    } catch (err) {
      return {
        success: false,
      };
    }
  };

  const refreshCustomer = async (): Promise<Customer> => {
    if (!authData.customer) {
      return undefined;
    }

    const customer = await CustomerService.getCustomer(authData.accessToken);
    
    if(customer) {
      setAuthData(authData => ({
        ...authData,
        customer,
      }))
    }
    
    
  };

  const setCustomer = () => {
    setAuthData(authData => ({
      ...authData,
      customer,
    }))
  }

  

  const { accessToken, refreshToken, userName, customer } = authData;

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
      refreshCustomer,
      setCustomer
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
      refreshCustomer,
      setCustomer
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = (): AuthContextProps => useContext(AuthContext);

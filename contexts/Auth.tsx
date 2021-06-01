import React, { useContext } from 'react';
import AuthService from '../services/AuthService';

export type AuthContextProps = {
    accessToken?: string;
    refreshToken?: string;
    userName?: string;
    login: (userName: string, password: string) => Promise<any>;
    logout: () => void;
    register: (username: string, password: string) => Promise<any>;
    forgotPassword: (email: string) => Promise<any>;
    setPassword: (username: string, oldPassword: string, newPassword: string) => Promise<any>;
}

export const AuthContext = React.createContext<AuthContextProps>({
    accessToken: undefined,
    refreshToken: undefined,
    userName: undefined,
    login: () => Promise.resolve(),
    logout: () => null,
    register: () => Promise.resolve(null),
    forgotPassword: () => Promise.resolve(null),
    setPassword: () => Promise.resolve(null)
});

export type AuthProviderState = {
    accessToken?: string;
    refreshToken?: string
    userName?: string
};

const initialState = {
    accessToken: undefined,
    refreshToken: undefined,
    userName: undefined,
};

export interface AuthProviderProps {
    children?: JSX.Element;
}

export class AuthProvider extends React.Component<AuthProviderProps, AuthProviderState> {
    constructor(props: AuthProviderProps) {
        super(props);

        this.state = initialState;
    }

    promisedSetState = async <K extends keyof AuthProviderState>(
        state: Pick<AuthProviderState, K> | ((prevState: Readonly<AuthProviderState>, props: Readonly<AuthProviderProps>) => (Pick<AuthProviderState, K> | AuthProviderState | null)) | null
    ): Promise<void> => {
        return new Promise((resolve) => {
            this.setState(state, () => { resolve(); });
        });
    }

    logout = (): void => {
        this.setState(initialState);
    }

    login = async (userName: string, password: string): Promise<any> => {
        this.setState({ userName });
        
        try {
            const { data } = await AuthService.authorize(userName, password);
            if (data && data.accessToken) {            
                await this.promisedSetState({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken
                });
            }

            return {
                success: true,
                data
            };
        } catch (err) {
            if (err.status === 403) {
                return {
                    success: false,
                    message: 'Wrong email or password.' 
                };
            } else if (err.status === 429) {
                return {
                    success: false,
                    message: 'Too many login attempts.' 
                };
            } else {
                throw err;
            }
        }
    };

    register = async (username: string, password: string): Promise<any> => {
        try {
            const result = await AuthService.register(username, password);

            if (result.success && result.data && result.data.accessToken) {
                await this.promisedSetState({
                    accessToken: result.data.accessToken,
                    refreshToken: result.data.refreshToken,
                });
            }

            return result;
        } catch (err) {
            return {
                success: false
            };
        }
    }

    forgotPassword = async (email: string): Promise<any> => {
        try {
            return await AuthService.forgotPassword(email);
        } catch (err) {
            return {
                success: false
            };
        }
    }

    setPassword = async (username: string, oldPassword: string, newPassword: string): Promise<any> => {
        try {
            const result = await AuthService.setPassword(username, oldPassword, newPassword);

            if (result.success && result.data.accessToken) {            
                await this.promisedSetState({
                    accessToken: result.data.accessToken,
                    refreshToken: result.data.refreshToken
                });
            }

            return result;
        } catch (err) {
            return {
                success: false
            };
        }
    }

    render(): JSX.Element {
        const { accessToken, refreshToken, userName } = this.state;

        return (
            <AuthContext.Provider
                value={{
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    userName: userName,
                    login: this.login,
                    register: this.register,
                    forgotPassword: this.forgotPassword,
                    setPassword: this.setPassword,
                    logout: this.logout
                }}
            >
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}

export const AuthConsumer = AuthContext.Consumer;

export const useAuth = (): AuthContextProps => useContext(AuthContext);

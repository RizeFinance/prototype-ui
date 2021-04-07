import React, { useContext } from 'react';
import AuthService from '../services/AuthService';

export type AuthContextProps = {
    isAuthenticated: boolean,
    login: (userName: string, password: string) => Promise<void>;
    logout: () => void,
}

export const AuthContext = React.createContext<AuthContextProps>({
    isAuthenticated: false,
    login: () => Promise.resolve(),
    logout: null,
});

export type AuthProviderState = {
    isAuthenticated: boolean;
    accessToken?: string;
    refreshToken?: string
};

const initialState = {
    isAuthenticated: false,
    accessToken: undefined,
    refreshToken: undefined
};

export interface AuthProviderProps {
    children?: JSX.Element;
}

export class AuthProvider extends React.Component<AuthProviderProps, AuthProviderState> {
    constructor(props: AuthProviderProps) {
        super(props);

        this.state = initialState;
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    login = async (userName: string, password: string): Promise<void> => {
        const { data } = await AuthService.authorize(userName, password);
        if (data && data.accessToken) {            
            this.setState({
                isAuthenticated: true,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken
            }, () => {
                console.log('---> this.state: ', this.state);
            });
        }
    };

    logout = (): void => {
        this.setState(initialState);
    }

    render(): JSX.Element {
        return (
            <AuthContext.Provider
                value={{
                    isAuthenticated: this.state.isAuthenticated,
                    login: this.login,
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
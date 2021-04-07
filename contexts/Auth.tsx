import React, { useContext } from 'react';
import AuthService from '../services/AuthService';

export type AuthContextProps = {
    accessToken?: string;
    refreshToken?: string;
    login: (userName: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<any>;
}

export const AuthContext = React.createContext<AuthContextProps>({
    accessToken: undefined,
    refreshToken: undefined,
    login: () => Promise.resolve(),
    register: () => Promise.resolve(null),
});

export type AuthProviderState = {
    accessToken?: string;
    refreshToken?: string
};

const initialState = {
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
    }

    promisedSetState = async <K extends keyof AuthProviderState>(
        state: Pick<AuthProviderState, K> | ((prevState: Readonly<AuthProviderState>, props: Readonly<AuthProviderProps>) => (Pick<AuthProviderState, K> | AuthProviderState | null)) | null
    ): Promise<void> => {
        return new Promise((resolve) => {
            this.setState(state, () => { resolve(); });
        });
    }

    login = async (userName: string, password: string): Promise<void> => {
        const { data } = await AuthService.authorize(userName, password);
        
        if (data && data.accessToken) {            
            await this.promisedSetState({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken
            });
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

    render(): JSX.Element {
        const { accessToken, refreshToken } = this.state;

        return (
            <AuthContext.Provider
                value={{
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    login: this.login,
                    register: this.register
                }}
            >
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}

export const AuthConsumer = AuthContext.Consumer;

export const useAuth = (): AuthContextProps => useContext(AuthContext);
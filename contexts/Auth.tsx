import React, { useContext } from 'react';
import AuthService from '../services/AuthService';

export type AuthContextProps = {
    accessToken?: string;
    refreshToken?: string;
    register: (username: string, password: string) => Promise<any>;
    forgot: (email: string) => Promise<any>;
}

export const AuthContext = React.createContext<AuthContextProps>({
    accessToken: undefined,
    refreshToken: undefined,
    register: () => Promise.resolve(null),
    forgot: () => Promise.resolve(null)
});

export interface AuthProviderProps {
    children?: JSX.Element;
}

export type AuthProviderState = {
    accessToken: string;
    refreshToken: string;
}

const initialState = {
    accessToken: undefined,
    refreshToken: undefined,
};

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

    forgot = async (email: string): Promise<any> => {
        try {
            await AuthService.forgot(email);
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
                    register: this.register,
                    forgot: this.forgot
                }}
            >
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}

export const AuthConsumer = AuthContext.Consumer;

export const useAuth = (): AuthContextProps => useContext(AuthContext);

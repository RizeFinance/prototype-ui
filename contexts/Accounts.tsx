import React, { useContext } from 'react';
import { SyntheticAccount } from '../models';
import AccountsService from '../services/AccountService';
import { AuthContext } from './Auth';

export type AccountsContextProps = {
    isLoading: boolean;
    liabilityAccounts?: SyntheticAccount[];
    refetchAccounts: () => Promise<SyntheticAccount[]>;
}

export const AccountsContext = React.createContext<AccountsContextProps>({
    isLoading: false,
    liabilityAccounts: [],
    refetchAccounts: () => Promise.resolve([]),
});

export type AccountsProviderState = {
    isLoading: boolean;
    liabilityAccounts?: SyntheticAccount[],
};

const initialState = {
    isLoading: false,
    liabilityAccounts: [],
};

export interface AccountsProviderProps {
    children?: JSX.Element;
}

export class AccountsProvider extends React.Component<AccountsProviderProps, AccountsProviderState> {
    static contextType = AuthContext;
    context: React.ContextType<typeof AuthContext>;

    constructor(props: AccountsProviderProps) {
        super(props);

        this.state = initialState;
    }

    refetchAccounts = async (): Promise<SyntheticAccount[]> => {
        this.setState({ isLoading: true });

        try {
            const accountList = await AccountsService.getSyntheticAccounts(this.context.accessToken);
            const liabilityAccounts = accountList.data.filter(x => x.liability);

            this.setState({ liabilityAccounts } );

            return liabilityAccounts;
        } finally {
            this.setState({ isLoading: true });
        }
    }

    render(): JSX.Element {
        const { isLoading, liabilityAccounts } = this.state;

        return (
            <AccountsContext.Provider
                value={{
                    isLoading: isLoading,
                    liabilityAccounts: liabilityAccounts,
                    refetchAccounts: this.refetchAccounts,
                }}
            >
                {this.props.children}
            </AccountsContext.Provider>
        );
    }
}

export const AccountsConsumer = AccountsContext.Consumer;

export const useAccounts = (): AccountsContextProps => useContext(AccountsContext);

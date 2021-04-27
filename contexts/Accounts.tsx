import React, { useContext } from 'react';
import { SyntheticAccount } from '../models';
import AccountsService from '../services/AccountService';
import { AuthContext } from './Auth';

export type AccountsContextProps = {
    isLoading: boolean;
    liabilityAccounts?: SyntheticAccount[];
    externalAccounts?: SyntheticAccount[];
    refetchAccounts: () => Promise<SyntheticAccount[]>;
}

export const AccountsContext = React.createContext<AccountsContextProps>({
    isLoading: false,
    liabilityAccounts: [],
    refetchAccounts: () => Promise.resolve([]),
});

export type AccountsProviderState = {
    isLoading: boolean;
    liabilityAccounts?: SyntheticAccount[];
    externalAccounts?: SyntheticAccount[];
};

const initialState = {
    isLoading: false,
    liabilityAccounts: [],
    externalAccounts: [],
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
            const sortedAccounts = accountList.data.sort((a, b) => new Date(a.opened_at).getTime() - new Date(b.opened_at).getTime());
            const liabilityAccounts = sortedAccounts.filter(x => x.liability);
            const externalAccounts = sortedAccounts.filter(x => x.synthetic_account_category === 'external');

            this.setState({ liabilityAccounts, externalAccounts } );

            return liabilityAccounts;
        } finally {
            this.setState({ isLoading: false });
        }
    }

    render(): JSX.Element {
        const { isLoading, liabilityAccounts, externalAccounts } = this.state;

        return (
            <AccountsContext.Provider
                value={{
                    isLoading: isLoading,
                    liabilityAccounts: liabilityAccounts,
                    externalAccounts: externalAccounts,
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

import React, { useContext } from 'react';
import { SyntheticAccount } from '../models';
import { AccountService } from '../services';
import { AuthContext } from './Auth';
import _ from 'lodash';

export const AccountType = {
  target_yield_account: 'target_yield_account',
  general: 'general',
} as const;

interface IAccountAPIResponse {
  total_count: string;
  limit: string;
  offset: string;
  data: SyntheticAccount[];
}

export type AccountsContextProps = {
  isLoading: boolean;
  liabilityAccounts?: SyntheticAccount[];
  externalAccounts?: SyntheticAccount[];
  poolUids?: string[];
  linkToken?: string;
  archiveAccount: (accountUid: string) => Promise<IAccountAPIResponse>;
  refetchAccounts: () => Promise<IAccountAPIResponse>;
  fetchLinkToken: () => Promise<string>;
};

export const AccountsContext = React.createContext<AccountsContextProps>({
  isLoading: false,
  liabilityAccounts: [],
  externalAccounts: [],
  poolUids: [],
  archiveAccount: () => Promise.resolve([]),
  refetchAccounts: () => Promise.resolve([]),
  fetchLinkToken: () => Promise.resolve(),
});

export type AccountsProviderState = {
  isLoading: boolean;
  liabilityAccounts?: SyntheticAccount[];
  externalAccounts?: SyntheticAccount[];
  poolUids?: string[];
  linkToken?: string;
};

const initialState = {
  isLoading: false,
  liabilityAccounts: [],
  externalAccounts: [],
  poolUids: [],
  linkToken: null,
};

export interface AccountsProviderProps {
  children?: JSX.Element;
}

export class AccountsProvider extends React.Component<
  AccountsProviderProps,
  AccountsProviderState
> {
  static contextType = AuthContext;
  context: React.ContextType<typeof AuthContext>;

  constructor(props: AccountsProviderProps) {
    super(props);

    this.state = initialState;
  }

  refetchAccounts = async (): Promise<SyntheticAccount[]> => {
    this.setState({ isLoading: true });

    try {
      const accountList = await AccountService.getSyntheticAccounts(this.context.accessToken);
      const nonArchivedAccounts = accountList.data.filter((x) => x.status !== 'archived');
      const sortedAccounts = nonArchivedAccounts.sort(
        (a, b) => new Date(a.opened_at).getTime() - new Date(b.opened_at).getTime()
      );
      const liabilityAccounts = sortedAccounts.filter((x) => x.liability);
      const externalAccounts = sortedAccounts.filter((x) =>
        ['external', 'plaid_external', 'outbound_ach'].includes(x.synthetic_account_category)
      );
      const poolUids = _.uniq(sortedAccounts.map((x) => x.pool_uid));

      this.setState({ liabilityAccounts, externalAccounts, poolUids });

      return accountList;
    } finally {
      this.setState({ isLoading: false });
    }
  };

  archiveAccount = async (accountUid: string): Promise<SyntheticAccount[]> => {
    this.setState({ isLoading: true });
    try {
      await AccountService.archiveSyntheticAccount(this.context.accessToken, accountUid);
      const accountList = await this.refetchAccounts();

      return accountList;
    } finally {
      this.setState({ isLoading: false });
    }
  };

  fetchLinkToken = async (): Promise<string> => {
    this.setState({ isLoading: true });

    try {
      const linkToken = await AccountService.getLinkToken(this.context.accessToken);

      this.setState({ linkToken });

      return linkToken;
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render(): JSX.Element {
    const { isLoading, liabilityAccounts, externalAccounts, poolUids, linkToken } = this.state;

    return (
      <AccountsContext.Provider
        value={{
          isLoading: isLoading,
          liabilityAccounts: liabilityAccounts,
          externalAccounts: externalAccounts,
          poolUids: poolUids,
          linkToken: linkToken,
          archiveAccount: this.archiveAccount,
          refetchAccounts: this.refetchAccounts,
          fetchLinkToken: this.fetchLinkToken,
        }}
      >
        {this.props.children}
      </AccountsContext.Provider>
    );
  }
}

export const AccountsConsumer = AccountsContext.Consumer;

export const useAccounts = (): AccountsContextProps => useContext(AccountsContext);

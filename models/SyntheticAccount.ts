import {
  SyntheticAccount as BaseSyntheticAccount,
  SyntheticAccountType as BaseSyntheticAccountType,
} from '@rizefinance/rize-js/types/lib/core/typedefs/synthetic-account.typedefs';

type UpdatedAccount = Omit<BaseSyntheticAccount, 'synthetic_account_category'>;

interface ISyntheticAccount extends UpdatedAccount {
  synthetic_account_category: 'general' | 'external' | 'plaid_external' | 'target_yield_account';
  asset_balances?: IAsset[];
}

interface IAsset {
  asset_quantity: string;
  asset_type: string;
  custodial_account_name: string;
  custodial_account_uid: string;
  current_usd_value: string;
  debit: boolean;
}

export type SyntheticAccount = ISyntheticAccount;
export type SyntheticAccountType = BaseSyntheticAccountType;

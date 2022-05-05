export enum AccountCategory {
  GENERAL = 'general',
  EXTERNAL = 'external',
  OUTBOUND_ACH = 'outbound_ach',
  PLAID_EXTERNAL = 'plaid_external',
  TARGET_YEILD_ACCOUNT = 'target_yield_account',
}

export enum AccountStatus {
  INITIATED = 'initiated',
  active = 'active',
  archived = 'archived',
  FAILED = 'failed',
}

export enum MessageStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export default {
  AccountCategory,
  AccountStatus,
  MessageStatus,
};

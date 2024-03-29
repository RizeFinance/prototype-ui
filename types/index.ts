import { MessageStatus } from './enums';
export { MessageStatus };

export type PDFReaderParams = {
  url: string;
};

export type ApplicationUnapprovedParams = {
  status: 'rejected' | 'manual_review' | 'under_review';
};

export type PIIFields = {
  business_name?: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  dob: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  ssn: string;
};

export type ConfirmPIIParams = {
  fieldValues: PIIFields;
};

export type LoginParams = {
  message?: string;
};

export type AccountDetailsParams = {
  accountUid: string;
};

export interface MessageState {
  status?: MessageStatus;
  copy?: string;
}

export type ExternalAccountsParams = {
  status?: MessageStatus;
  copy?: string;
};

export type RootStackParamList = {
  BankingDisclosures: undefined;
  Disclosures: undefined;
  Login: LoginParams;
  Signup: undefined;
  ForgotPassword: undefined;
  PatriotAct: undefined;
  PII: undefined;
  ConfirmPII: ConfirmPIIParams;
  ProcessingApplication: undefined;
  ApplicationUnapproved: ApplicationUnapprovedParams;
  PDFReader: PDFReaderParams;
  Accounts: undefined;
  AccountDetails: AccountDetailsParams;
  ExternalAccounts: ExternalAccountsParams;
  ConnectAccount: undefined;
  ConnectOneWay: undefined;
  ArchiveExternalAccount: AccountDetailsParams;
  InitTransfer: undefined;
  Menu: undefined;
  NotFound: undefined;
  LockedScreen: undefined;
  SetPassword: undefined;
  DebitCard: undefined;
  Statements: undefined;
  Agreements: undefined;
  Main: any;
  AccountsSetup: any;
  CustomerType: undefined;
  DebitCardActivation: any;
  PinSet: any;
  BrokerageOverview: any;
  BrokerageProductQuestions: any;
  BrokerageDisclosures: any;
  BrokerageProcessing: any;
};

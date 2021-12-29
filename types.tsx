export type PDFReaderParams = {
  url: string;
};

export type ApplicationUnapprovedParams = {
  status: 'rejected' | 'manual_review' | 'under_review';
};

export type PIIFields = {
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
  ExternalAccount: undefined;
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
  DebitCardActivation: any;
  PinSet: any;
  ProfileQuestions: any;
  BrokerageDisclosures: any;
  ProcessingScreen: any;
};

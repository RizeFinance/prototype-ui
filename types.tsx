export type PDFReaderParams = {
  url: string;
}

export type ResultParams = {
  status: 'approved' | 'rejected' | 'manual_review';
}

export type PIIFields = {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  dob: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  ssn: string;
}

export type ConfirmPIIParams = {
  fieldValues: PIIFields;
}

export type RootStackParamList = {
  BankingDisclosures: undefined;
  Disclosures: undefined;
  Login: undefined;
  PatriotAct: undefined;
  PII: undefined;
  ConfirmPII: ConfirmPIIParams;
  ProcessingApplication: undefined;
  Result: ResultParams;
  PDFReader: PDFReaderParams;
  NotFound: undefined;
};
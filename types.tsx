export type ResultParams = {
    status: 'approved' | 'rejected' | 'manual_review';
}

export type RootStackParamList = {
    BankingDisclosures: undefined;
    Disclosures: undefined;
    Login: undefined;
    PatriotAct: undefined;
    PII: undefined;
    ProcessingApplication: undefined;
    Result: ResultParams;
    NotFound: undefined;
};
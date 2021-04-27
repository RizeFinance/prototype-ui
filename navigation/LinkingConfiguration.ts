import * as Linking from 'expo-linking';

export default {
    prefixes: [Linking.makeUrl('/')],
    config: {
        screens: {
            Main: {
                screens: {
                    Login: 'login',
                    Signup: 'signup',
                    ForgotPassword: 'forgot-password',
                    Accounts: 'accounts',
                    ExternalAccount: 'external-account',
                    ProcessingApplication: 'processing-application',
                    ApplicationUnapproved: 'application-unapproved',
                    Disclosures: 'disclosures',
                    PatriotAct: 'patriot-act',
                    PII: 'pii',
                    BankingDisclosures: 'banking-disclosures',
                    InitTransfer: 'init-transfer',
                    NotFound: '*',
                },
            }
        }
    },
};

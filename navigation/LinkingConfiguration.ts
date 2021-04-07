import * as Linking from 'expo-linking';

export default {
    prefixes: [Linking.makeUrl('/')],
    config: {
        screens: {
            Main: {
                screens: {
                    Login: 'login',
                    Signup: 'signup',
                    Home: 'home',
                    ProcessingApplication: 'processing-application',
                    ApplicationUnapproved: 'application-unapproved',
                    Disclosures: 'disclosures',
                    PatriotAct: 'patriot-act',
                    PII: 'pii',
                    BankingDisclosures: 'banking-disclosures',
                    NotFound: '*',
                },
            }
        }
    },
};

import * as Linking from 'expo-linking';

export default {
    prefixes: [Linking.makeUrl('/')],
    config: {
        screens: {
            Login: 'login',
            ProcessingApplication: 'processing-application',
            Result: 'result',
            Disclosures: 'disclosures',
            PatriotAct: 'patriot-act',
            PII: 'pii',
            BankingDisclosures: 'banking-disclosures',
            NotFound: '*',
        },
    },
};

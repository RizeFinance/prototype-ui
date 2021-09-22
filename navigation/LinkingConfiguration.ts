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
          SetPassword: 'set-password',
          Accounts: 'accounts',
          ExternalAccount: 'external-account',
          Menu: 'menu',
          ProcessingApplication: 'processing-application',
          ApplicationUnapproved: 'application-unapproved',
          Disclosures: 'disclosures',
          PatriotAct: 'patriot-act',
          PII: 'pii',
          DebitCard: 'debit-card',
          PinSet: 'pin-set',
          Statements: 'statements',
          Agreements: 'agreements',
          BankingDisclosures: 'banking-disclosures',
          InitTransfer: 'init-transfer',
          NotFound: '*',
        },
      },
    },
  },
};

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
          CustomerType: 'set-type',
          Accounts: 'accounts',
          ExternalAccounts: 'external-accounts',
          ArchiveExternalAccount: 'archive-external-account',
          Menu: 'menu',
          ProcessingApplication: 'processing-application',
          ApplicationUnapproved: 'application-unapproved',
          Disclosures: 'disclosures',
          PatriotAct: 'patriot-act',
          PII: 'pii',
          ConfirmPII: 'confirm-pii',
          BrokerageDisclosures: 'brokerage-disclosures',
          BrokerageOverview: 'brokerage-overview',
          BrokerageProductQuestions: 'brokerage-questions',
          ProfileQuestions: 'profile-questions',
          DebitCard: 'debit-card',
          Activate: 'debit-card/activate',
          PinSet: 'debit-card/pin-set',
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

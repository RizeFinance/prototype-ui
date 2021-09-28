import Constants from 'expo-constants';

export type Config = {
  api: {
    baseUrl: string;
  };
  application: {
    allowSignup: string;
    sentryDsn: string;
    rizeEnv: string;
    defaultProductUid: string;
    brokerageProductUid: string;
    debitCardServiceUrl: string;
  };
};

export default {
  ...Constants.manifest.extra,
} as Config;

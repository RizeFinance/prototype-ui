import Constants from 'expo-constants';

export type Config = {
    rize: {
        programId: string;
        hmac: string;
    };
    api: {
        baseUrl: string;
    };
}

export default {
    ...Constants.manifest.extra,
} as Config;
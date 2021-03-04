import Constants from 'expo-constants';

export type Config = {
    rize: {
        programId: string;
        hmac: string;
    };
}

export default {
    ...Constants.manifest.extra,
} as Config;
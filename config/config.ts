import Constants from 'expo-constants';

export type Config = {
    api: {
        baseUrl: string;
    };
}

export default {
    ...Constants.manifest.extra,
} as Config;
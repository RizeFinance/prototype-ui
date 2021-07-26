import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export default {
    name: 'rize-compliance-demo-ui',
    slug: 'rize-compliance-demo-ui',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    plugins: ['sentry-expo'],
    splash: {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
    },
    updates: {
        fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
        '**/*'
    ],
    ios: {
        supportsTablet: true
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#FFFFFF'
        }
    },
    web: {
        favicon: './assets/images/favicon.png'
    },
    packagerOpts: {
        config: 'metro.config.js',
        sourceExts: [
            'expo.ts',
            'expo.tsx',
            'expo.js',
            'expo.jsx',
            'ts',
            'tsx',
            'js',
            'jsx',
            'json',
            'wasm',
            'svg',
        ],
    },
    extra: {
        api: {
            baseUrl: process.env.REACT_NATIVE_API_BASE_URL,
        },
        application: {
            allowSignup: process.env.ALLOW_SIGNUP,
            sentryDsn: process.env.SENTRY_DSN,
            rizeEnv: process.env.RIZE_ENV,
            defaultProductUid: process.env.DEFAULT_PRODUCT_UID
        }
    },
};

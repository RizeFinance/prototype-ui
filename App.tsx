import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import config from './config/config';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {ApplicationProviders} from './contexts'

import * as Sentry from 'sentry-expo';

Sentry.init({
    dsn: config.application.sentryDsn,
    environment: config.application.rizeEnv,
    enableInExpoDevelopment: true,
    debug: config.application.rizeEnv === 'development' ? true : false, 
});

export default function App(): any {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
          <ApplicationProviders>
            <SafeAreaProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </SafeAreaProvider>
          </ApplicationProviders>
        );
    }
}

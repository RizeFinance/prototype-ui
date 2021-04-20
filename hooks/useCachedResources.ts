import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';

export default function useCachedResources(): boolean {
    const [isLoadingComplete, setLoadingComplete] = React.useState(false);

    // Load any resources or data that we need prior to rendering the app
    React.useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                SplashScreen.preventAutoHideAsync();

                // Load fonts
                await Font.loadAsync({
                    ...Ionicons.font,
                    'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
                    'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
                    'OpenSans-SemiBold': require('../assets/fonts/OpenSans-SemiBold.ttf'),
                    'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
                });
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e); // eslint-disable-line
            } finally {
                setLoadingComplete(true);
                SplashScreen.hideAsync();
            }
        }

        loadResourcesAndDataAsync();
    }, []);

    return isLoadingComplete;
}

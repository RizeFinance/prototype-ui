import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import PDFReaderScreen from '../screens/PDFReaderScreen';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }): JSX.Element {
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator />
        </NavigationContainer>
    );
}

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Root" component={LoginScreen} />
            <Stack.Screen name="PDFReader" component={PDFReaderScreen} />
        </Stack.Navigator>
    );
}

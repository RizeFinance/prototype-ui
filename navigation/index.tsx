import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import { ComplianceWorkflowProvider } from '../contexts/ComplianceWorkflow';
import { CustomerProvider } from '../contexts/Customer';
import BankingDisclosuresScreen from '../screens/BankingDisclosuresScreen';
import DisclosuresScreen from '../screens/DisclosuresScreen';

import LoginScreen from '../screens/LoginScreen';
import PatriotActScreen from '../screens/PatriotActScreen';
import PIIScreen from '../screens/PIIScreen';
import ProcessingApplicationScreen from '../screens/ProcessingApplicationScreen';
import ResultScreen from '../screens/ResultScreen';
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
        <CustomerProvider>
            <ComplianceWorkflowProvider>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="ProcessingApplication" component={ProcessingApplicationScreen} />
                    <Stack.Screen name="Result" component={ResultScreen} />
                    <Stack.Screen name="Disclosures" component={DisclosuresScreen} />
                    <Stack.Screen name="PatriotAct" component={PatriotActScreen} />
                    <Stack.Screen name="PII" component={PIIScreen} />
                    <Stack.Screen name="BankingDisclosures" component={BankingDisclosuresScreen} />
                </Stack.Navigator>
            </ComplianceWorkflowProvider>
        </CustomerProvider>
    );
}

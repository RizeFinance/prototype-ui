import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { ComplianceWorkflowProvider } from '../contexts/ComplianceWorkflow';
import { CustomerProvider } from '../contexts/Customer';
import BankingDisclosuresScreen from '../screens/BankingDisclosuresScreen';
import DisclosuresScreen from '../screens/DisclosuresScreen';

import LoginScreen from '../screens/LoginScreen';
import PatriotActScreen from '../screens/PatriotActScreen';
import PIIScreen from '../screens/PIIScreen';
import ProcessingApplicationScreen from '../screens/ProcessingApplicationScreen';
import ResultScreen from '../screens/ResultScreen';
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
    const styles = StyleSheet.create({
        keyboardAvoidingView: {
            flex: 1
        },
    });

    return (
        <CustomerProvider>
            <ComplianceWorkflowProvider>
                <KeyboardAvoidingView
                    behavior='padding'
                    style={styles.keyboardAvoidingView}
                    keyboardVerticalOffset={Platform.OS === 'android' ? -200 : 0}
                >
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="ProcessingApplication" component={ProcessingApplicationScreen} />
                        <Stack.Screen name="Result" component={ResultScreen} />
                        <Stack.Screen name="Disclosures" component={DisclosuresScreen} />
                        <Stack.Screen name="PatriotAct" component={PatriotActScreen} />
                        <Stack.Screen name="PII" component={PIIScreen} />
                        <Stack.Screen name="BankingDisclosures" component={BankingDisclosuresScreen} />
                        <Stack.Screen name="PDFReader" component={PDFReaderScreen} />
                    </Stack.Navigator>
                </KeyboardAvoidingView>
            </ComplianceWorkflowProvider>
        </CustomerProvider>
    );
}

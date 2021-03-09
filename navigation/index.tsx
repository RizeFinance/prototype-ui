import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { ComplianceWorkflowProvider } from '../contexts/ComplianceWorkflow';
import { CustomerConsumer, CustomerProvider } from '../contexts/Customer';
import BankingDisclosuresScreen from '../screens/BankingDisclosuresScreen';
import DisclosuresScreen from '../screens/DisclosuresScreen';

import LoginScreen from '../screens/LoginScreen';
import PatriotActScreen from '../screens/PatriotActScreen';
import PIIScreen from '../screens/PIIScreen';
import ProcessingApplicationScreen from '../screens/ProcessingApplicationScreen';
import ApplicationUnapprovedScreen from '../screens/ApplicationUnapprovedScreen';
import PDFReaderScreen from '../screens/PDFReaderScreen';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import ConfirmPIIScreen from '../screens/ConfirmPIIScreen';
import HomeScreen from '../screens/HomeScreen';

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
            <CustomerConsumer>
                {({ customer }): JSX.Element => (
                    <ComplianceWorkflowProvider>
                        <KeyboardAvoidingView
                            behavior='padding'
                            style={styles.keyboardAvoidingView}
                            keyboardVerticalOffset={Platform.OS === 'android' ? -200 : 0}
                        >
                            <Stack.Navigator screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="Login" component={LoginScreen} />

                                {!!customer && (
                                    <>
                                        {customer.status === 'initiated' ? (
                                            <>
                                                <Stack.Screen name="Disclosures" component={DisclosuresScreen} />
                                                <Stack.Screen name="PatriotAct" component={PatriotActScreen} />
                                                <Stack.Screen name="PII" component={PIIScreen} />
                                                <Stack.Screen name="ConfirmPII" component={ConfirmPIIScreen} />
                                                <Stack.Screen name="BankingDisclosures" component={BankingDisclosuresScreen} />
                                                <Stack.Screen name="PDFReader" component={PDFReaderScreen} />
                                                <Stack.Screen name="ProcessingApplication" component={ProcessingApplicationScreen} />
                                            </>
                                        ) : (customer.status === 'queued' || customer.status === 'identity_verified') ? (
                                            <Stack.Screen name="ProcessingApplication" component={ProcessingApplicationScreen} />
                                        ) : (customer.status === 'manual_review' || customer.status === 'under_review' || customer.status === 'rejected') ? (
                                            <Stack.Screen
                                                name="ApplicationUnapproved"
                                                component={ApplicationUnapprovedScreen}
                                                initialParams={{ status: customer.status }}
                                            />
                                        ) : (
                                            <Stack.Screen name="Home" component={HomeScreen} />
                                        )}
                                    </>
                                )}
                            </Stack.Navigator>
                        </KeyboardAvoidingView>
                    </ComplianceWorkflowProvider>
                )}
            </CustomerConsumer>
        </CustomerProvider>
    );
}

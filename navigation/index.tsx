import * as React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions, StackNavigationProp } from '@react-navigation/stack';
import { ColorSchemeName, KeyboardAvoidingView, Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ComplianceWorkflowProvider } from '../contexts/ComplianceWorkflow';
import { CustomerProvider, useCustomer } from '../contexts/Customer';
import BankingDisclosuresScreen from '../screens/BankingDisclosuresScreen';
import DisclosuresScreen from '../screens/DisclosuresScreen';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import PatriotActScreen from '../screens/PatriotActScreen';
import PIIScreen from '../screens/PIIScreen';
import ConfirmPIIScreen from '../screens/ConfirmPIIScreen';
import ProcessingApplicationScreen from '../screens/ProcessingApplicationScreen';
import ApplicationUnapprovedScreen from '../screens/ApplicationUnapprovedScreen';
import PDFReaderScreen from '../screens/PDFReaderScreen';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import AccountsScreen from '../screens/AccountsScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import { AuthProvider } from '../contexts/Auth';
import { AccountsProvider } from '../contexts/Accounts';
import { useThemeColor } from '../components/Themed';
import { TextLink } from '../components';
import AccountDetailsScreen from '../screens/AccountDetailsScreen';
import ExternalAccountScreen from '../screens/ExternalAccountScreen';
import InitTransferScreen from '../screens/InitTransferScreen';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }): JSX.Element {
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator />
        </NavigationContainer>
    );
}

const RootStack = createStackNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function getMenuButton() {
    return (
        <TextLink>
            Menu
        </TextLink>
    );
}

function MainStackScreen() {
    const { customer } = useCustomer();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const background = useThemeColor('background');

    const screenCardStyle: StyleProp<ViewStyle> = {
        backgroundColor: background,
    };

    const screenOptions = {
        withHeader: {
            headerShown: true,
            headerTitle: '',
            headerLeft: () => <></>,
            headerRight: () => getMenuButton(),
            headerLeftContainerStyle: {
                paddingLeft: 32,
            },
            headerRightContainerStyle: {
                paddingRight: 32,
            },
            headerStyle: {
                shadowOpacity: 0,
            },
            cardStyle: screenCardStyle,
        } as StackNavigationOptions,
        withoutHeader: {
            headerShown: false,
            backgroundColor: background,
        } as StackNavigationOptions
    };

    return (
        <AuthProvider>
            {!customer ? (
                <Stack.Navigator screenOptions={screenOptions.withoutHeader}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                </Stack.Navigator>
            ) : (
                <ComplianceWorkflowProvider navigation={navigation}>
                    <AccountsProvider>
                        {customer.status === 'initiated' ? (
                            <Stack.Navigator screenOptions={screenOptions.withoutHeader}>
                                <Stack.Screen name="Disclosures" component={DisclosuresScreen} />
                                <Stack.Screen name="PatriotAct" component={PatriotActScreen} />
                                <Stack.Screen name="PII" component={PIIScreen} />
                                <Stack.Screen name="ConfirmPII" component={ConfirmPIIScreen} />
                                <Stack.Screen name="BankingDisclosures" component={BankingDisclosuresScreen} />
                                <Stack.Screen name="PDFReader" component={PDFReaderScreen} />
                                <Stack.Screen name="ProcessingApplication" component={ProcessingApplicationScreen} />
                            </Stack.Navigator>
                        ) : (customer.status === 'queued' || customer.status === 'identity_verified') ? (
                            <Stack.Navigator screenOptions={screenOptions.withoutHeader}>
                                <Stack.Screen name="ProcessingApplication" component={ProcessingApplicationScreen} />
                            </Stack.Navigator>
                        ) : (customer.status === 'manual_review' || customer.status === 'under_review' || customer.status === 'rejected') ? (
                            <Stack.Navigator screenOptions={screenOptions.withoutHeader}>
                                <Stack.Screen
                                    name="ApplicationUnapproved"
                                    component={ApplicationUnapprovedScreen}
                                    initialParams={{ status: customer.status }}
                                />
                            </Stack.Navigator>
                        ) : (
                            <Stack.Navigator screenOptions={screenOptions.withHeader}>
                                <Stack.Screen name="Accounts" component={AccountsScreen} />
                                <Stack.Screen name="AccountDetails" component={AccountDetailsScreen} />
                                <Stack.Screen name="ExternalAccount" component={ExternalAccountScreen} />
                                <Stack.Screen name="InitTransfer" component={InitTransferScreen} />
                            </Stack.Navigator>
                        )}
                    </AccountsProvider>
                </ComplianceWorkflowProvider>
            )}
        </AuthProvider>
    );
}

function RootNavigator() {
    const styles = StyleSheet.create({
        keyboardAvoidingView: {
            flex: 1
        },
    });

    return (
        <CustomerProvider>
            <KeyboardAvoidingView
                behavior='padding'
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'android' ? -200 : 0}
            >
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    <RootStack.Screen name="Main" component={MainStackScreen} />
                </RootStack.Navigator>
            </KeyboardAvoidingView>
        </CustomerProvider>
    );
}

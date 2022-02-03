import * as React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  ColorSchemeName,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import LinkingConfiguration from './LinkingConfiguration';
import { RootStackParamList } from '../types';

// Screens
import {
  AccountDetailsScreen,
  AccountsScreen,
  DisclosuresScreen,
  ExternalAccountScreen,
  ForgotPasswordScreen,
  InitTransferScreen,
  LoginScreen,
  MenuScreen,
  // PIIScreen,
  SignupScreen,
  SetPasswordScreen,
  DebitCardScreen,
  DebitCardActivationScreen,
  StatementScreen,
  AgreementScreen,
  LockedScreen,
  PinSetScreen,
  PDFReaderScreen,
  // ProfileQuestionsScreen,
  // BrokerageDisclosuresScreen,
  AccountsSetupScreen,
} from '../screens';

import { useAuth } from '../contexts';
import { useThemeColor, Body, TextLink } from '../components';
import useComplianceWorkflow from '../hooks/useComplianceWorkflow';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }): JSX.Element {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const RootStack = createStackNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const CloseButton = (): JSX.Element => {
  const primary = useThemeColor('primary');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <Body
      fontWeight="bold"
      style={{ color: primary }}
      onPress={(): void => {
        navigation.goBack();
      }}
    >
      X
    </Body>
  );
};

const MenuButton = (): JSX.Element => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <TextLink
      onPress={(): void => {
        navigation.navigate('Menu');
      }}
    >
      Menu
    </TextLink>
  );
};

function MainStackScreen() {
  const { customer } = useAuth();
  const { workflow } = useComplianceWorkflow();

  // const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const background = useThemeColor('background');

  const screenCardStyle: StyleProp<ViewStyle> = {
    backgroundColor: background,
  };

  const screenOptions = {
    withHeader: {
      headerShown: true,
      headerTitle: '',
      headerLeft: () => <></>,
      headerRight: () => <MenuButton />,
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
    } as StackNavigationOptions,
  };

  if (!customer) {
    return (
      <Stack.Navigator screenOptions={screenOptions.withoutHeader}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="SetPassword" component={SetPasswordScreen} />
      </Stack.Navigator>
    );
  }

  if (customer.status === 'active' && workflow.summary.status !== 'accepted') {
    return (
      <Stack.Navigator screenOptions={screenOptions.withoutHeader}>
        <Stack.Screen name="Disclosures" component={DisclosuresScreen} />
        <Stack.Screen name="PDFReader" component={PDFReaderScreen} />
      </Stack.Navigator>
    );
  }

  if (customer.locked_at) {
    return (
      <Stack.Navigator screenOptions={screenOptions.withoutHeader}>
        <Stack.Screen name="LockedScreen" component={LockedScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={screenOptions.withHeader}>
      <Stack.Screen name="Accounts" component={AccountsScreen} />
      <Stack.Screen name="AccountsSetup" component={AccountsSetupScreen} />

      <Stack.Screen name="AccountDetails" component={AccountDetailsScreen} />
      <Stack.Screen name="ExternalAccount" component={ExternalAccountScreen} />
      <Stack.Screen name="InitTransfer" component={InitTransferScreen} />
      <Stack.Screen name="DebitCard" component={DebitCardScreen} />
      <Stack.Screen name="DebitCardActivation" component={DebitCardActivationScreen} />
      <Stack.Screen name="PinSet" component={PinSetScreen} />
      <Stack.Screen name="Statements" component={StatementScreen} />
      <Stack.Screen name="Agreements" component={AgreementScreen} />
      <Stack.Screen name="PDFReader" component={PDFReaderScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const styles = StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
    },
  });

  const menuScreenOptions = {
    gestureDirection: 'horizontal-inverted',
    headerShown: true,
    headerLeft: null,
    headerTitle: null,
    headerRight: () => <CloseButton />,
    headerRightContainerStyle: {
      paddingRight: 32,
    },
    headerStyle: {
      shadowOpacity: 0,
    },
  } as StackNavigationOptions;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === 'android' ? -200 : 0}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Main" component={MainStackScreen} />
        <RootStack.Screen name="Menu" component={MenuScreen} options={menuScreenOptions} />
      </RootStack.Navigator>
    </KeyboardAvoidingView>
  );
}

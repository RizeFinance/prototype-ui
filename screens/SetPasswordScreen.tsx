import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Button, Input, Screen, useThemeColor } from '../components';
import { Body, BodySmall, Heading3 } from '../components/Typography';
import { Formik } from 'formik';
import validator from 'validator';
import { RootStackParamList } from '../types';
import CustomerService from '../services/CustomerService';
import ComplianceWorkflowService from '../services/ComplianceWorkflowService';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../contexts/Auth';
import { useComplianceWorkflow } from '../contexts/ComplianceWorkflow';

const logo = require('../assets/images/logo.png');

interface SetPasswordScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'ForgotPassword'>;
}

interface SetPasswordFields {
  username?: string;
  oldPassword: string;
  newPassword: string;
}

export default function SetPasswordScreen({ navigation }: SetPasswordScreenProps): JSX.Element {
  const { setCustomer, ...auth } = useAuth();
  const { setComplianceWorkflow, evaluateCurrentStep } = useComplianceWorkflow();

  const [message, setMesage] = useState<string>('');

  const initialValues: SetPasswordFields = {
    username: auth.userName,
    oldPassword: '',
    newPassword: '',
  };

  const primary = useThemeColor('primary');

  const styles = StyleSheet.create({
    logo: {
      height: 200,
      width: 200,
      marginTop: -30,
      marginBottom: -25,
    },
    message: {
      marginTop: 4,
    },
    inputContainer: {
      marginTop: 15,
      marginBottom: 10,
    },
    alreadyHaveAccount: {
      textDecorationLine: 'underline',
      textDecorationColor: primary,
      color: primary,
      marginTop: 20,
    },
    submitButton: {
      marginTop: 20,
    },
  });

  const validateForm = (values: SetPasswordFields): any => {
    const errors: any = {};

    if (!values.username || validator.isEmpty(values.username, { ignore_whitespace: true })) {
      errors.email = 'Email is required.';
    } else if (!validator.isEmail(values.username)) {
      errors.email = 'Invalid email address.';
    }

    return errors;
  };

  const onPressAlreadyHaveAccount = (): void => {
    navigation.navigate('Login');
  };

  const onSubmit = async (values: SetPasswordFields): Promise<void> => {
    setMesage('');
    const { username, oldPassword, newPassword } = values;

    try {
      if (!username) {
        throw new Error('Unable to find username/email');
      }

      const result = await auth.setPassword(username, oldPassword, newPassword);

      if (result.success) {
        const customer = await CustomerService.getCustomer(result.data.accessToken);
        const workflow = await ComplianceWorkflowService.viewLatestWorkflow(
          result.data.accessToken
        );

        await setCustomer(customer);
        await setComplianceWorkflow(workflow);
        await evaluateCurrentStep();
      } else {
        setMesage('Failed reset password.');
      }
    } catch (err) {
      setMesage('Something went wrong! Try again later. \n {err.message}');
    }
  };

  return (
    <Screen useScrollView bounces={false}>
      <View
        style={{
          alignSelf: 'center',
        }}
      >
        <Image source={logo} resizeMode="contain" resizeMethod="resize" style={styles.logo} />
      </View>
      <Heading3 textAlign="center">Set Password</Heading3>
      {!!message && (
        <BodySmall textAlign="center" style={styles.message}>
          {message}
        </BodySmall>
      )}
      <Formik initialValues={initialValues} onSubmit={onSubmit} validate={validateForm}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
          isSubmitting,
          dirty,
          touched,
        }) => {
          return (
            <>
              <Input
                label="Email"
                containerStyle={styles.inputContainer}
                autoCapitalize={'none'}
                textContentType="username"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                errorText={touched.username ? errors.username : ''}
                editable={!isSubmitting}
                onSubmitEditing={(): void => handleSubmit()}
              />
              <Input
                label="Old Password"
                containerStyle={styles.inputContainer}
                autoCapitalize={'none'}
                keyboardType="visible-password"
                textContentType="password"
                onChangeText={handleChange('oldPassword')}
                onBlur={handleBlur('oldPassword')}
                secureTextEntry={true}
                value={values.oldPassword}
                errorText={touched.oldPassword ? errors.oldPassword : ''}
                editable={!isSubmitting}
                onSubmitEditing={(): void => handleSubmit()}
              />
              <Input
                label="New Password"
                containerStyle={styles.inputContainer}
                autoCapitalize={'none'}
                keyboardType="visible-password"
                textContentType="newPassword"
                onChangeText={handleChange('newPassword')}
                onBlur={handleBlur('newPassword')}
                secureTextEntry={true}
                value={values.newPassword}
                errorText={touched.newPassword ? errors.newPassword : ''}
                editable={!isSubmitting}
                onSubmitEditing={(): void => handleSubmit()}
              />
              <Button
                title="Set Password"
                disabled={!dirty || !isValid || isSubmitting}
                onPress={(): void => handleSubmit()}
                style={styles.submitButton}
              />
              <Pressable
                onPress={(): void => {
                  onPressAlreadyHaveAccount();
                }}
                disabled={isSubmitting}
              >
                <Body textAlign="center" fontWeight="semibold" style={styles.alreadyHaveAccount}>
                  Back to Login
                </Body>
              </Pressable>
            </>
          );
        }}
      </Formik>
    </Screen>
  );
}

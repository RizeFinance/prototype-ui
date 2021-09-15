import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Button, Input, Screen } from '../components';
import { Body, BodySmall, Heading3 } from '../components/Typography';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useThemeColor } from '../components/Themed';
import { useAuth } from '../contexts/Auth';
import { useComplianceWorkflow } from '../contexts/ComplianceWorkflow';
import CustomerService from '../services/CustomerService';

const logo = require('../assets/images/logo.png');

interface SignupScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Signup'>;
}

interface SignupFields {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupScreen({ navigation }: SignupScreenProps): JSX.Element {
  const { register, setCustomer } = useAuth();

  const { setComplianceWorkflow } = useComplianceWorkflow();
  const [commonError, setCommonError] = useState<string>('');

  const initialValues: SignupFields = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  const primary = useThemeColor('primary');

  const styles = StyleSheet.create({
    logo: {
      height: 200,
      width: 200,
      marginTop: -30,
      marginBottom: -25,
    },
    commonError: {
      marginTop: 4,
      marginBottom: -20,
    },
    inputContainer: {
      marginTop: 35,
      marginBottom: 30,
    },
    passwordRulesSection: {
      marginTop: 4,
      marginBottom: 12,
    },
    alreadyHaveAccount: {
      textDecorationLine: 'underline',
      textDecorationColor: primary,
      color: primary,
      marginTop: 20,
    },
  });

  const passwordErrors = {
    min: 'At least 10 characters',
    lowercase: 'At least 1 lowercase letter',
    uppercase: 'At least 1 uppercase letter',
    number: 'At least 1 number',
    special: 'At least 1 special character',
  };

  const signupSchema = Yup.object().shape({
    email: Yup.string().required('Email is required.').email('Invalid email address.'),
    password: Yup.string()
      .required(passwordErrors.min)
      .min(10, passwordErrors.min)
      .matches(/[a-z]/, passwordErrors.lowercase)
      .matches(/[A-Z]/, passwordErrors.uppercase)
      .matches(/[0-9]/, passwordErrors.number)
      .matches(/[-#!$@%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]/, passwordErrors.special), // eslint-disable-line
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .equals([Yup.ref('password'), null], 'Passwords do not match.'),
  });

  const validateForm = (values: SignupFields): any => {
    try {
      signupSchema.validateSync(values, { abortEarly: false });
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errorKeyValues = Object.keys(values).map((key) => {
          const ve = err.inner.filter((x) => x.path === key);

          return {
            key: key,
            value:
              ve.length === 0 ? '' : ve.length === 1 ? ve[0].message : ve.map((x) => x.message),
          };
        });

        const errors = errorKeyValues.reduce(
          (obj, item) => Object.assign(obj, { [item.key]: item.value }),
          {}
        );
        return errors;
      } else {
        throw err;
      }
    }

    return {};
  };

  const onPressAlreadyHaveAccount = (): void => {
    navigation.navigate('Login');
  };

  const onSubmit = async (values: SignupFields): Promise<void> => {
    setCommonError('');

    const result = await register(values.email, values.password);

    if (!result.success) {
      setCommonError('Unable to register user.');
    } else {
      if (!result.data.accessToken) {
        navigation.navigate('Login', {
          message:
            'A verification link has been sent to your email address. Please verify before you log in.',
        });
      } else {
        await setComplianceWorkflow(result.data.workflow);

        const customer = await CustomerService.getCustomer(result.data.accessToken);

        await setCustomer(customer);
      }
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
      <Heading3 textAlign="center">Create Account</Heading3>
      {!!commonError && (
        <BodySmall color="error" textAlign="center" style={styles.commonError}>
          {commonError}
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
          const hasPasswordError = (message: string) => {
            return touched.password && errors.password && errors.password.includes(message);
          };

          return (
            <>
              <View style={styles.inputContainer}>
                <Input
                  label="Email"
                  autoCapitalize={'none'}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  errorText={touched.email && errors.email}
                  editable={!isSubmitting}
                  onSubmitEditing={(): void => handleSubmit()}
                />
                <Input
                  label="Password"
                  autoCapitalize={'none'}
                  textContentType="newPassword"
                  secureTextEntry={true}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  errorState={touched.password && !!errors.password}
                  editable={!isSubmitting}
                  onSubmitEditing={(): void => handleSubmit()}
                />
                <View style={styles.passwordRulesSection}>
                  <BodySmall fontWeight="semibold">Password must contain:</BodySmall>
                  <BodySmall
                    color={hasPasswordError(passwordErrors.min) ? 'error' : 'body'}
                    fontWeight={hasPasswordError(passwordErrors.min) ? 'semibold' : 'regular'}
                  >
                    &nbsp;&nbsp;&bull; {passwordErrors.min}
                  </BodySmall>
                  <BodySmall
                    color={hasPasswordError(passwordErrors.lowercase) ? 'error' : 'body'}
                    fontWeight={hasPasswordError(passwordErrors.lowercase) ? 'semibold' : 'regular'}
                  >
                    &nbsp;&nbsp;&bull; {passwordErrors.lowercase}
                  </BodySmall>
                  <BodySmall
                    color={hasPasswordError(passwordErrors.uppercase) ? 'error' : 'body'}
                    fontWeight={hasPasswordError(passwordErrors.uppercase) ? 'semibold' : 'regular'}
                  >
                    &nbsp;&nbsp;&bull; {passwordErrors.uppercase}
                  </BodySmall>
                  <BodySmall
                    color={hasPasswordError(passwordErrors.number) ? 'error' : 'body'}
                    fontWeight={hasPasswordError(passwordErrors.number) ? 'semibold' : 'regular'}
                  >
                    &nbsp;&nbsp;&bull; {passwordErrors.number}
                  </BodySmall>
                  <BodySmall
                    color={hasPasswordError(passwordErrors.special) ? 'error' : 'body'}
                    fontWeight={hasPasswordError(passwordErrors.special) ? 'semibold' : 'regular'}
                  >
                    &nbsp;&nbsp;&bull; {passwordErrors.special}
                  </BodySmall>
                </View>

                <Input
                  label="Confirm Password"
                  autoCapitalize={'none'}
                  textContentType="newPassword"
                  secureTextEntry={true}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  errorText={touched.confirmPassword && errors.confirmPassword}
                  editable={!isSubmitting}
                  onSubmitEditing={(): void => handleSubmit()}
                />
              </View>
              <Button
                title="Create Account"
                disabled={!dirty || !isValid || isSubmitting}
                onPress={(): void => handleSubmit()}
              />

              <Pressable
                onPress={(): void => {
                  onPressAlreadyHaveAccount();
                }}
                disabled={isSubmitting}
              >
                <Body textAlign="center" fontWeight="semibold" style={styles.alreadyHaveAccount}>
                  I already have an account.
                </Body>
              </Pressable>
            </>
          );
        }}
      </Formik>
    </Screen>
  );
}

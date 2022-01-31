import React, { useState, useEffect } from 'react';
import { Image, View } from 'react-native';
import { Formik } from 'formik';
import validator from 'validator';
import { useAuth } from '../../contexts/Auth';
import { Button, Input, Screen, TextLink } from '../../components';
import { BodySmall, Heading3 } from '../../components/Typography';
import {CustomerService} from '../../services';
import { RouteProp } from '@react-navigation/core';
import { RootStackParamList } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';
import config from '../../config/config';
import { removeValue } from '../../utils/asyncStorage';
import { styles } from './styles';
const logo = require('../../assets/images/logo.png');

interface LoginScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
  route: RouteProp<RootStackParamList, 'Login'>;
}

interface LoginFields {
  email: string;
  password: string;
}

export default function LoginScreen({ navigation, route }: LoginScreenProps): JSX.Element {
  const { setCustomer, ...auth } = useAuth();

  const [commonError, setCommonError] = useState<string>('');

  const initialValues: LoginFields = {
    email: '',
    password: '',
  };

  const allowSignup = config.application.allowSignup === 'true';

  const validateForm = (values: LoginFields): any => {
    const errors: any = {};

    if (validator.isEmpty(values.email, { ignore_whitespace: true })) {
      errors.email = 'Email is required.';
    } else if (!validator.isEmail(values.email)) {
      errors.email = 'Invalid email address.';
    }

    if (validator.isEmpty(values.password, { ignore_whitespace: true })) {
      errors.password = 'Password is required.';
    }

    return errors;
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      if (auth.accessToken !== '') {
        const customer = await CustomerService.getCustomer(auth.accessToken);
        if (customer) {
          setCustomer(customer);
        } else {
          removeValue({ storageKey: '@tokens' });
        }
      }
    };
    fetchCustomer();
  }, [auth, setCustomer]);

  const onSubmit = async (values: LoginFields): Promise<void> => {
    setCommonError('');

    try {
      const authData = await auth.login(values.email, values.password);

      if (!authData.success) {
        setCommonError(authData.message);
        return;
      }

      if (authData.data.require_new_password) {
        navigation.navigate('SetPassword');
        return;
      }
    } catch (err) {
      setCommonError('Something went wrong! Try again later');
    }
  };

  const gotoSignupScreen = () => {
    navigation.navigate('Signup');
  };

  const onPressForgotPassword = (): void => {
    navigation.navigate('ForgotPassword');
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
      <Heading3 textAlign="center">Login</Heading3>
      {!!route.params?.message && (
        <BodySmall textAlign="center" style={styles.message}>
          {route.params.message}
        </BodySmall>
      )}
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
        }) => (
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
                textContentType="password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
                errorText={touched.password && errors.password}
                editable={!isSubmitting}
                onSubmitEditing={(): void => handleSubmit()}
              />
            </View>
            <Button
              title="Login"
              disabled={!dirty || !isValid || isSubmitting}
              onPress={(): void => handleSubmit()}
            />

            <View style={styles.links}>
              {allowSignup && (
                <TextLink onPress={(): void => gotoSignupScreen()}>
                  I need to create an account
                </TextLink>
              )}

              <TextLink
                onPress={(): void => {
                  onPressForgotPassword();
                }}
                disabled={isSubmitting}
                style={styles.forgotAccount}
              >
                Forgot password
              </TextLink>
            </View>
          </>
        )}
      </Formik>
    </Screen>
  );
}

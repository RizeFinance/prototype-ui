import React, { useEffect } from 'react';
import { Image, StyleSheet, View, ActivityIndicator } from 'react-native';
import { TextLink, Screen } from '../../components';
import { Formik, FormikProps } from 'formik';
import { BodySmall, Heading3 } from '../../components/Typography';
import { useAuth } from '../../contexts/Auth';
import { EmailInput, CodeInput, PasswordValidation } from './Inputs';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
const logo = require('../../assets/images/logo.png');
import * as yup from 'yup';

import { machine } from './machine';
import { useMachine } from '@xstate/react';

export const passwordErrors = {
  min: 'be at least 10 characters',
  lowercase: 'have at least 1 lowercase letter',
  uppercase: 'have at least 1 uppercase letter',
  number: 'have at least 1 number',
  special: 'have at least 1 special character',
};

export const matchError = 'be matching';

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
  alreadyHaveAccount: {
    marginTop: 20,
  },
});

const initValues = {
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
};

export type IFormik = FormikProps<typeof initValues>;

interface IProps {
  navigation: StackNavigationProp<RootStackParamList, 'ForgotPassword'>;
}

const ForgotPasswordScreen = ({ navigation }: { navigation: IProps }): JSX.Element => {
  const { forgotPassword, confirmPassword, login } = useAuth();

  const [fetchState, sendToFetch] = useMachine(machine, {
    services: {
      fetchCode: (ctx) => forgotPassword(ctx.email),
      confirmPassword: ({ email, code, password }) => confirmPassword({ email, code, password }),
      login: ({ email, password }) => login(email, password),
    },
  });

  const onSubmit = async (values, actions): Promise<void> => {
    if (values.email !== '') {
      sendToFetch({ type: 'SUBMIT_EMAIL', email: values.email });
    }

    if (values.code !== '') {
      sendToFetch({ type: 'SUBMIT_CODE', code: values.code });
    }

    if (values.password !== '') {
      sendToFetch({ type: 'SUBMIT_PASSWORD', password: values.password });
    }

    if (!fetchState.matches('code')) {
      actions.resetForm();
      actions.validateForm();
    }
  };

  useEffect(() => {
    if (fetchState.matches('login.success')) {
      navigation.navigate('Accounts');
    }
  }, [fetchState, navigation]);

  const emailValidation = yup.object().shape({
    email: yup.string().email('Must be a valid email address').required('Email is Required'),
  });

  const codeValidation = yup.object().shape({
    code: yup.string().required('Code is Required'),
  });

  const passwordValidation = yup.object().shape({
    password: yup
      .string()
      .required(passwordErrors.min)
      .min(10, passwordErrors.min)
      .matches(/[a-z]/, passwordErrors.lowercase)
      .matches(/[A-Z]/, passwordErrors.uppercase)
      .matches(/[0-9]/, passwordErrors.number)
      .matches(/[-#!$@%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]/, passwordErrors.special), // eslint-disable-line

    confirmPassword: yup
      .string()
      .required(matchError)
      .equals([yup.ref('password')], matchError),
  });

  const currentValidationSchema = () => {
    switch (true) {
      case fetchState.matches('email'):
        return emailValidation;
      case fetchState.matches('code'):
        return codeValidation;
      case fetchState.matches('password'):
        return passwordValidation;
      default:
        return null;
    }
  };

  const validateForm = (values: typeof initValues): any => {
    try {
      currentValidationSchema().validateSync(values, {
        abortEarly: false,
      });
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

  const renderForm = (f: IFormik) => {
    if (fetchState.matches('code')) {
      return <CodeInput f={f} />;
    }

    if (fetchState.matches('email')) {
      return <EmailInput f={f} />;
    }

    if (fetchState.matches('password')) {
      return <PasswordValidation f={f} />;
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
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
      <Heading3 textAlign="center">Forgot Password?</Heading3>
      {!!fetchState.context.message && (
        <BodySmall textAlign="center" style={styles.message}>
          {fetchState.context.message}
        </BodySmall>
      )}
      <Formik
        initialValues={initValues}
        onSubmit={onSubmit}
        validate={validateForm}
        validateOnMount
      >
        {(f) => (
          <>
            {fetchState.matches('password.submitting' || 'login.showLoader') ? (
              <View style={{ marginVertical: 75 }}>
                <ActivityIndicator size="large" />
              </View>
            ) : (
              renderForm(f)
            )}
            <TextLink
              textAlign="center"
              style={styles.alreadyHaveAccount}
              onPress={handleBackToLogin}
              disabled={f.isSubmitting}
            >
              Back to Login
            </TextLink>
          </>
        )}
      </Formik>
    </Screen>
  );
};

export default ForgotPasswordScreen;

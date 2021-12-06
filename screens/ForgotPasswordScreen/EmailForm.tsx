import React from 'react';
import { Formik } from 'formik';
import { Button, Input, TextLink } from '../../components';
import { StyleSheet } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 35,
    marginBottom: 30,
  },
  alreadyHaveAccount: {
    marginTop: 20,
  },
});

interface Email {
  email: string;
}

export const EmailForm = ({ onSubmit }) => {
  const navigation = useNavigation();

  const validateForm = (values: Email): any => {
    const errors: any = {};

    if (validator.isEmpty(values.email, { ignore_whitespace: true })) {
      errors.email = 'Email is required.';
    } else if (!validator.isEmail(values.email)) {
      errors.email = 'Invalid email address.';
    }

    return errors;
  };

  const initValues = {
    email: '',
  };

  return (
    <Formik initialValues={initValues} onSubmit={onSubmit} validate={validateForm}>
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
          <Input
            label="Email"
            containerStyle={styles.inputContainer}
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
          <Button
            title="Request reset link"
            disabled={!dirty || !isValid || isSubmitting}
            onPress={(): void => handleSubmit()}
          />

          <TextLink
            textAlign="center"
            style={styles.alreadyHaveAccount}
            onPress={() => navigation.navigate('Login')}
            disabled={isSubmitting}
          >
            Back to Login
          </TextLink>
        </>
      )}
    </Formik>
  );
};

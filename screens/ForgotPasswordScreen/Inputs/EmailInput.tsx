import React from 'react';
import { Button, Input } from '../../../components';
import { StyleSheet } from 'react-native';
import { IFormik } from '../ForgotPasswordScreen';

const EmailInput = ({ f }: { f: IFormik }): JSX.Element => {
  return (
    <>
      <Input
        label="Email"
        containerStyle={styles.inputContainer}
        autoCapitalize={'none'}
        keyboardType="email-address"
        textContentType="emailAddress"
        onChangeText={f.handleChange('email')}
        onBlur={f.handleBlur('email')}
        value={f.values.email}
        errorText={f.touched.email ? f.errors.email : ''}
        editable={!f.isSubmitting}
        onSubmitEditing={(): void => f.handleSubmit()}
      />
      <Button
        title="Request reset link"
        disabled={!f.isValid || f.isSubmitting}
        onPress={() => f.handleSubmit()}
      />
    </>
  );
};

export default EmailInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 35,
    marginBottom: 30,
  },
  alreadyHaveAccount: {
    marginTop: 20,
  },
});

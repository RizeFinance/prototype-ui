import React from 'react';
import { Button, Input } from '../../../components';
import { StyleSheet } from 'react-native';
import { IFormik } from '../ForgotPasswordScreen';

const CodeInput = ({ f }: { f: IFormik }): JSX.Element => {
  return (
    <>
      <Input
        label="Code"
        containerStyle={styles.inputContainer}
        keyboardType="numeric"
        onChangeText={f.handleChange('code')}
        onBlur={f.handleBlur('code')}
        value={f.values.code}
        errorText={f.touched.code && f.errors.code}
        editable={!f.isSubmitting}
        onSubmitEditing={(): void => f.handleSubmit()}
      />
      <Button
        title="Submit Code"
        disabled={!f.isValid || f.isSubmitting}
        onPress={() => f.handleSubmit()}
      />
    </>
  );
};

export default CodeInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 35,
    marginBottom: 30,
  },
  alreadyHaveAccount: {
    marginTop: 20,
  },
});

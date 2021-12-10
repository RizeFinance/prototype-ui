import React, { useEffect } from 'react';
import { Input, Button } from '../../../components';
import { StyleSheet, View } from 'react-native';
import { BodySmall } from '../../../components/Typography';
import { passwordErrors, matchError } from '../ForgotPasswordScreen';
import { useField } from 'formik';
import CheckedCircle from '../../../assets/svg/CheckedCircle';
import XCircle from '../../../assets/svg/XCircle';
import { IFormik } from '../ForgotPasswordScreen';

const PasswordValidation = ({ f }: { f: IFormik }): JSX.Element => {
  const [, meta] = useField('password');
  const [, confirmMeta] = useField('confirmPassword');

  const { error } = meta;
  const { error: confirmError } = confirmMeta;

  const hasPasswordError = (message: string) => {
    if (error) {
      return error.includes(message);
    }
  };

  const hasMatchError = (message: string) => message && message !== '' && message === confirmError;

  useEffect(() => {
    const value = Object.values(passwordErrors);
    // @ts-expect-error password expects string, but this is string[]
    f.setErrors({ password: value, confirmPassword: matchError });
  }, []);

  return (
    <>
      <Input
        label="New Password"
        containerStyle={styles.inputContainer}
        autoCapitalize={'none'}
        onChangeText={f.handleChange('password')}
        secureTextEntry={true}
        value={f.values.password}
        editable={!f.isSubmitting}
        onSubmitEditing={(): void => f.handleSubmit()}
      />
      <View style={styles.passwordRulesSection}>
        <BodySmall fontWeight="semibold">Password must:</BodySmall>

        <View style={styles.ruleRow}>
          {hasPasswordError(passwordErrors.min) ? <XCircle /> : <CheckedCircle />}
          <BodySmall
            style={{ marginLeft: 5 }}
            color={hasPasswordError(passwordErrors.min) ? 'error' : 'body'}
            fontWeight={hasPasswordError(passwordErrors.min) ? 'semibold' : 'regular'}
          >
            {passwordErrors.min}
          </BodySmall>
        </View>

        <View style={styles.ruleRow}>
          {hasPasswordError(passwordErrors.lowercase) ? <XCircle /> : <CheckedCircle />}

          <BodySmall
            style={{ marginLeft: 5 }}
            color={hasPasswordError(passwordErrors.lowercase) ? 'error' : 'body'}
            fontWeight={hasPasswordError(passwordErrors.lowercase) ? 'semibold' : 'regular'}
          >
            {passwordErrors.lowercase}
          </BodySmall>
        </View>
        <View style={styles.ruleRow}>
          {hasPasswordError(passwordErrors.uppercase) ? <XCircle /> : <CheckedCircle />}
          <BodySmall
            style={{ marginLeft: 5 }}
            color={hasPasswordError(passwordErrors.uppercase) ? 'error' : 'body'}
            fontWeight={hasPasswordError(passwordErrors.uppercase) ? 'semibold' : 'regular'}
          >
            {passwordErrors.uppercase}
          </BodySmall>
        </View>
        <View style={styles.ruleRow}>
          {hasPasswordError(passwordErrors.number) ? <XCircle /> : <CheckedCircle />}
          <BodySmall
            style={{ marginLeft: 5 }}
            color={hasPasswordError(passwordErrors.number) ? 'error' : 'body'}
            fontWeight={hasPasswordError(passwordErrors.number) ? 'semibold' : 'regular'}
          >
            {passwordErrors.number}
          </BodySmall>
        </View>
        <View style={styles.ruleRow}>
          {hasPasswordError(passwordErrors.special) ? <XCircle /> : <CheckedCircle />}
          <BodySmall
            style={{ marginLeft: 5 }}
            color={hasPasswordError(passwordErrors.special) ? 'error' : 'body'}
            fontWeight={hasPasswordError(passwordErrors.special) ? 'semibold' : 'regular'}
          >
            {passwordErrors.special}
          </BodySmall>
        </View>
        <View style={styles.ruleRow}>
          {hasMatchError(matchError) ? <XCircle /> : <CheckedCircle />}
          <BodySmall
            style={{ marginLeft: 5 }}
            color={hasMatchError(matchError) ? 'error' : 'body'}
            fontWeight={hasMatchError(matchError) ? 'semibold' : 'regular'}
          >
            {matchError}
          </BodySmall>
        </View>
      </View>
      <Input
        label="Confirm Password"
        containerStyle={styles.inputContainer}
        autoCapitalize={'none'}
        onChangeText={f.handleChange('confirmPassword')}
        secureTextEntry={true}
        value={f.values.confirmPassword}
        editable={!f.isSubmitting}
        onSubmitEditing={(): void => f.handleSubmit()}
      />
      <Button
        title="Submit"
        disabled={!f.isValid || f.isSubmitting}
        onPress={() => f.handleSubmit()}
      />
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  passwordRulesSection: {
    marginVertical: 10,
  },
  ruleRow: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
});

export default PasswordValidation;

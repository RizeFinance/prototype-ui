import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Screen } from '../../components';
import { BodySmall, Heading3 } from '../../components/Typography';
import { useAuth } from '../../contexts/Auth';
import { EmailForm } from './EmailForm';
const logo = require('../../assets/images/logo.png');

const ForgotPasswordScreen = () => {
  const { forgotPassword } = useAuth();
  const [message, setMesage] = useState('');

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
  });

  const onSubmit = async (email: string): Promise<void> => {
    setMesage('');
    const result = await forgotPassword(email);
    if (result.success) {
      setMesage('The password reset link has now been sent to your email address.');
    } else {
      setMesage('Failed to send reset link to your email address.');
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
      <Heading3 textAlign="center">Forgot Password?</Heading3>
      {!!message && (
        <BodySmall textAlign="center" style={styles.message}>
          {message}
        </BodySmall>
      )}

      <EmailForm onSubmit={(email) => onSubmit(email)} />
    </Screen>
  );
};

export default ForgotPasswordScreen;

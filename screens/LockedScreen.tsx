import React from 'react';
import { Screen } from '../components';
import { StyleSheet, View } from 'react-native';
import { Body, Heading3 } from '../components/Typography';

const LockedScreen = (): JSX.Element => {
  return (
    <Screen>
      <View
        style={{
          alignSelf: 'center',
        }}
      >
        <Heading3 style={styles.heading} textAlign="center">
          Your account is locked.
        </Heading3>
        <Body style={styles.body}>Please contact customer support for additional help.</Body>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  body: {
    textAlign: 'center',
  },
  heading: {
    marginBottom: 40,
    fontSize: 23,
  },
});

export default LockedScreen;

import React from 'react';
import { Screen, Checkbox, Button, Heading3, BodySmall, Body } from '../../../components';
import { View, StyleSheet} from 'react-native';

const PatriotAct = () => {
  return (
    <View style={styles.content}>
      <Body fontWeight="semibold" style={styles.title}>
        Important Information About Procedures for Opening a New Account
      </Body>

      <Body style={{ marginBottom: 25 }}>
        To help the government fight the funding of terrorism and money laundering activities,
        Federal law requires all financial institutions to obtain, verify, and record information
        that identifies each person who opens an account.
      </Body>

      <Body fontWeight="semibold" style={{ marginBottom: 5 }}>
        What this means for you:
      </Body>
      <Body>
        When you open an account, we will ask for your name, address, date of birth, and other
        information that will allow us to identify you. We may also ask to see your driver&apos;s
        license or other identifying documents.
      </Body>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    marginBottom: 25,
    flex: 2,
  },
  title: {
    textAlign: 'center', 
    marginTop: 50, 
    marginBottom: 25
  }
})

import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Screen, Checkbox } from '../components';
import { Body, Heading3 } from '../components/Typography';
import { StackNavigationProp } from '@react-navigation/stack';
import { MessageStatus, RootStackParamList } from '../types';
import { useAuth } from '../contexts/Auth';
import config from '../config/config';
import Message, { useMessage } from '../components/Message';

interface CustomerTypeScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'ÇustomerType'>;
}

enum CustomerType {
  Individual = 'primary',
  SoleProprietor = 'sole_proprietor',
}

export default function SignupScreen({ navigation }: CustomerTypeScreenProps): JSX.Element {
  const { userName, createCustomer } = useAuth();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [customerType, setCustomerType] = useState<CustomerType | null>(null);
  const { message: alert, setMessage } = useMessage();

  const isBusiness = customerType === CustomerType.SoleProprietor;
  const isIndividual = customerType === CustomerType.Individual;

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      justifyContent: 'space-between',
    },
    subCopy: {
      marginTop: 40,
      marginBottom: 20,
    },
    topContent: {
      justifyContent: 'space-between',
    },
  });

  useEffect(() => {
    if (!userName) navigation.navigate('Login');
  }, []);

  const onSubmit = async (): Promise<void> => {
    if (!userName || !customerType) return;
    setLoading(true);
    try {
      await createCustomer(userName, customerType, config.application.defaultProductUid);
    } catch (err) {
      setMessage({
        status: MessageStatus.ERROR,
        copy: 'Something went wrong! Reach out to our Support Team',
      });
    }
  };

  useEffect(() => {
    const isValid = isBusiness || isIndividual;
    setDisabled(!isValid);
  }, [isBusiness, isIndividual]);

  return (
    <Screen style={styles.container}>
      <View>
        <Heading3 textAlign="center">Account Type</Heading3>
        <Message message={alert} />
        <Body style={styles.subCopy}>I am signing up for an account as a:</Body>
        <Checkbox
          checked={isIndividual}
          onChange={(checked): void => setCustomerType(checked ? CustomerType.Individual : null)}
        >
          <Body>Individual</Body>
        </Checkbox>
        <Checkbox
          checked={isBusiness}
          onChange={(checked): void =>
            setCustomerType(checked ? CustomerType.SoleProprietor : null)
          }
        >
          <Body>Sole Proprietor</Body>
        </Checkbox>
      </View>
      <Button
        title="Continue"
        onPress={onSubmit}
        disabled={disabled}
        loading={loading}
        style={{
          marginTop: 20,
        }}
      />
    </Screen>
  );
}

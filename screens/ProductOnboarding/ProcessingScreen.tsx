import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Screen } from '../../components';
import { Heading3, Heading4 } from '../../components/Typography';
import { useAuth } from '../../contexts/Auth';
import { useAccounts } from '../../contexts/Accounts';
import CustomerService from '../../services/CustomerService';
import config from '../../config/config';
import { find } from 'lodash';

export default function ProcessingScreen(): JSX.Element {
  const navigation = useNavigation();

  const { accessToken, customerProducts } = useAuth();
  const { liabilityAccounts, refetchAccounts } = useAccounts();

  const brokerageUid = config.application.brokerageProductUid;

  let timeout = null;

  const styles = StyleSheet.create({
    container: {
      marginTop: 100,
    },
    heading: {
      marginVertical: 24,
    },
  });

  useEffect(() => {
    const newAccount = find(liabilityAccounts, {
      synthetic_account_category: 'target_yield_account',
    });
    if (newAccount) navigation.navigate('Accounts');
  }, [customerProducts, liabilityAccounts]);

  const refreshAccountsPeriodically = async (): Promise<void> => {
    await refetchAccounts();
    timeout = setTimeout(() => {
      refreshAccountsPeriodically();
    }, 5000);
  };

  useEffect(() => {
    const verificationCheck = async (): Promise<void> => {
      try {
        await CustomerService.verifyCustomer(accessToken);
        await CustomerService.createCustomerProduct(accessToken, brokerageUid);
      } catch (err) {
        throw new Error(err);
      }

      refreshAccountsPeriodically();
    };

    verificationCheck();

    return (): void => clearTimeout(timeout);
  }, []);

  return (
    <Screen style={styles.container}>
      <ActivityIndicator size="large" />
      <Heading3 textAlign="center" style={styles.heading}>
        We&apos;re processing your application.
      </Heading3>
      <Heading4 textAlign="center">This should only take a few moments.</Heading4>
    </Screen>
  );
}

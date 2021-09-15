import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Screen } from '../components';
import { Heading3, Heading4 } from '../components/Typography';
import { useAuth } from '../contexts/Auth';
import CustomerService from '../services/CustomerService';
import config from '../config/config';

export default function ProcessingApplicationScreen(): JSX.Element {
  const { accessToken, refreshCustomer, customer } = useAuth();

  let timeout = null;

  const styles = StyleSheet.create({
    container: {
      marginTop: 100,
    },
    heading: {
      marginVertical: 24,
    },
  });

  const refreshCustomerPeriodically = async (): Promise<void> => {
    if (customer.kyc_status === 'approved') return;
    await refreshCustomer();
    timeout = setTimeout(() => {
      refreshCustomerPeriodically();
    }, 15000);
  };

  useEffect(() => {
    const verificationCheck = async (): Promise<void> => {
      if (customer.status === 'initiated') {
        await CustomerService.createCustomerProduct(
          accessToken,
          config.application.defaultProductUid
        );
      }

      refreshCustomerPeriodically();
    };

    verificationCheck();

    return (): void => clearTimeout(timeout);
  }, [customer]);

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

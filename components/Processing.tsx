import React, { useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Screen, Heading3, Heading4 } from '.';
import { useAuth } from '../contexts';
import { CustomerService } from '../services';
import config from '../config/config';

const Processing = () => {
  const { accessToken, refreshCustomer, customer } = useAuth();

  const timeout = useRef<NodeJS.Timeout | null>(null);

  const styles = StyleSheet.create({
    container: {
      marginTop: 100,
    },
    heading: {
      marginVertical: 24,
    },
  });

  const refreshCustomerPeriodically = useCallback(async (): Promise<void> => {
    if (customer.status === 'active') return;
    await refreshCustomer();
    timeout.current = setTimeout(() => {
      refreshCustomerPeriodically();
    }, 15000);
  }, [customer, refreshCustomer]);

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

    return (): void => clearTimeout(timeout.current);
  }, [customer, accessToken, refreshCustomerPeriodically, timeout]);

  return (
    <Screen style={styles.container}>
      <ActivityIndicator size="large" />
      <Heading3 textAlign="center" style={styles.heading}>
        We&apos;re processing your application.
      </Heading3>
      <Heading4 textAlign="center">This should only take a few moments.</Heading4>
    </Screen>
  );
};

export default Processing;

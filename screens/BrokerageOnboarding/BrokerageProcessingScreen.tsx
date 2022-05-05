import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Screen } from '../../components';
import { Heading3, Heading4, Heading5 } from '../../components/Typography';
import { useAuth } from '../../contexts/Auth';
import { useAccounts } from '../../contexts/Accounts';
import CustomerService from '../../services/CustomerService';
import config from '../../config/config';
import { find } from 'lodash';
import { AccountCategory } from '../../types';

export default function BrokerageProcessingScreen(): JSX.Element {
  const navigation = useNavigation();

  const { accessToken, customerProducts } = useAuth();
  const { liabilityAccounts, refetchAccounts } = useAccounts();

  const [errors, setErrors] = useState();
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
      synthetic_account_category: AccountCategory.TARGET_YEILD_ACCOUNT,
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
        setErrors(err);
      }

      refreshAccountsPeriodically();
    };

    verificationCheck();

    return (): void => clearTimeout(timeout);
  }, []);

  return (
    <Screen style={styles.container}>
      {!errors ? (
        <>
          <ActivityIndicator size="large" />
          <Heading3 textAlign="center" style={styles.heading}>
            We&apos;re processing your application.
          </Heading3>
          <Heading4 textAlign="center">This should only take a few moments.</Heading4>
        </>
      ) : (
        <>
          <Heading3 textAlign="center" style={styles.heading}>
            Something went wrong...
          </Heading3>
          <Heading5 textAlign="center">
            We could not process your application for the Brokerage product at this time.
          </Heading5>
        </>
      )}
    </Screen>
  );
}

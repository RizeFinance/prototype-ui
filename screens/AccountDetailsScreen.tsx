import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HorizontalLine, Screen, TextLink, TransactionList } from '../components';
import { Body, Heading3, Heading5 } from '../components/Typography';
import { RootStackParamList } from '../types';
import { useAccounts } from '../contexts/Accounts';
import { useDebitCards } from '../contexts/DebitCards';
import { RouteProp } from '@react-navigation/core';
import utils from '../utils/utils';
import { find } from 'lodash';

interface AccountsScreenProps {
  route: RouteProp<RootStackParamList, 'AccountDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'AccountDetails'>;
}

export default function AccountsScreen({ navigation, route }: AccountsScreenProps): JSX.Element {
  const { liabilityAccounts, refetchAccounts } = useAccounts();
  const { debitCards, refetchDebitCards } = useDebitCards();

  const account = liabilityAccounts.find((x) => x.uid === route.params?.accountUid);

  const styles = StyleSheet.create({
    heading: {
      marginTop: 24,
      marginBottom: 32,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    column: {
      flex: 1,
    },
    columnHeading: {
      marginBottom: 4,
    },
    historyHeading: {
      marginBottom: 16,
    },
  });

  useEffect(() => {
    refetchDebitCards();
    navigation.setOptions({
      headerLeft: () => <TextLink onPress={() => navigation.goBack()}>&lt; Accounts</TextLink>,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await refetchAccounts();
    });

    return unsubscribe;
  }, [navigation]);

  const associatedDebitCard = find(debitCards, { synthetic_account_uid: account.uid });

  return (
    <Screen withoutHeader useScrollView>
      <Heading3 textAlign="center" style={styles.heading}>
        {account?.name}
      </Heading3>
      <View style={styles.row}>
        <View style={styles.column}>
          <Body fontWeight="bold" style={styles.columnHeading}>
            Available Balance
          </Body>
          <Heading5>{utils.formatCurrency(account.net_usd_available_balance)}</Heading5>
        </View>
        <View style={styles.column}>
          <Body fontWeight="bold" style={styles.columnHeading}>
            Current Balance
          </Body>
          <Heading5>{utils.formatCurrency(account.net_usd_balance)}</Heading5>
        </View>
      </View>
      {associatedDebitCard && (
        <View style={styles.row}>
          <View style={styles.column}>
            <Body fontWeight="bold" style={styles.columnHeading}>
              Associated Debit Card
            </Body>
            <Heading5>**** **** **** {associatedDebitCard.card_last_four_digit}</Heading5>
          </View>
        </View>
      )}
      <HorizontalLine style={{ marginVertical: 40 }} />
      <Heading5 fontWeight="bold" textAlign="center" style={styles.historyHeading}>
        Transaction History
      </Heading5>
      <TransactionList syntheticAccountUid={account.uid} />
    </Screen>
  );
}

import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  HorizontalLine,
  Screen,
  TextLink,
  Body,
  Heading3,
  Heading5,
  TransactionListItem,
  useThemeColor,
} from '../components';

import { RootStackParamList } from '../types';
import { useAccounts, useDebitCards, useAuth, AccountType } from '../contexts';
import { RouteProp } from '@react-navigation/core';
import utils from '../utils/utils';
import { find } from 'lodash';
import { Transaction } from '../models';
import { TransactionService } from '../services';

export default function AccountsScreen({ navigation, route }: AccountsScreenProps): JSX.Element {
  const { liabilityAccounts, refetchAccounts } = useAccounts();
  const { debitCards, refetchDebitCards } = useDebitCards();
  const { accessToken } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const account = liabilityAccounts.find((x) => x.uid === route.params?.accountUid);

  useEffect(() => {
    const loadTransactions = async (): Promise<void> => {
      const transactionList = await TransactionService.getTransactions(
        accessToken,
        100,
        0,
        account.uid
      );
      setTransactions(
        transactionList.data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
    };
    loadTransactions();
  }, [accessToken, account.uid]);

  const gray = useThemeColor('gray');

  const styles = StyleSheet.create({
    heading: {
      marginTop: 24,
      marginBottom: 32,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 30,
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
    assetRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    assetQuantity: {
      color: gray,
    },
  });

  useEffect(() => {
    refetchDebitCards();
    navigation.setOptions({
      headerLeft: () => <TextLink onPress={() => navigation.goBack()}>&lt; Accounts</TextLink>,
    });
  }, [navigation, refetchDebitCards]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await refetchAccounts();
    });

    return unsubscribe;
  }, [navigation, refetchAccounts]);

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

      {account.synthetic_account_category === AccountType.target_yield_account && (
        <>
          {account.asset_balances?.map((asset) => {
            <Body fontWeight="bold" style={{ marginBottom: 10 }}>
              Asset Breakdown
            </Body>;
            return (
              <View key={asset.asset_type}>
                <View style={styles.assetRow}>
                  <Body>{asset.asset_type}</Body>
                  <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                    <Body style={styles.assetQuantity}>
                      {!asset.debit && `${asset.asset_quantity} |`}{' '}
                    </Body>
                    <Body fontWeight="bold">{utils.formatCurrency(asset.current_usd_value)}</Body>
                  </View>
                </View>
              </View>
            );
          })}
        </>
      )}
      <HorizontalLine style={{ marginVertical: 40 }} />

      {associatedDebitCard && (
        <>
          <View>
            <View style={styles.column}>
              <Body fontWeight="bold" style={styles.columnHeading}>
                Associated Debit Card
              </Body>
              {/* not plural due to typo in middleware */}
              <Heading5>**** **** **** {associatedDebitCard.card_last_four_digit}</Heading5>
            </View>
          </View>
          <HorizontalLine style={{ marginVertical: 40 }} />
        </>
      )}

      <Heading5 fontWeight="bold" textAlign="center" style={styles.historyHeading}>
        Transaction History
      </Heading5>
      <>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <View key={index}>
              <TransactionListItem transaction={transaction} />
              {transactions.length !== index + 1 && <HorizontalLine />}
            </View>
          ))
        ) : (
          <Body style={{ textAlign: 'center' }}>No Transactions Yet</Body>
        )}
      </>
    </Screen>
  );
}

interface AccountsScreenProps {
  route: RouteProp<RootStackParamList, 'AccountDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'AccountDetails'>;
}

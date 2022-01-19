import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Transaction } from '../models';
import utils from '../utils/utils';
import { Body } from './Typography';
import moment from 'moment';
import { startCase } from 'lodash';

const TransactionListItem = ({ transaction }: { transaction: Transaction }) => {
  return (
    <>
      <Body style={styles.description}>{transaction.description}</Body>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Body fontStyle={transaction.settled_at ? 'regular' : 'italic'}>
            {transaction.settled_at
              ? moment(transaction.settled_at).format('M/DD/YY')
              : startCase(transaction.status)}
          </Body>
        </View>
        <View style={styles.rightColumn}>
          <Body>
            {transaction.net_asset === 'positive'
              ? '+'
              : transaction.net_asset === 'negative'
              ? '-'
              : ''}
            {utils.formatCurrency(transaction.us_dollar_amount)}
          </Body>
        </View>
      </View>
    </>
  );
};

export default TransactionListItem;

const styles = StyleSheet.create({
  description: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

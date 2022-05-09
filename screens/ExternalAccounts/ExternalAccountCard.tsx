import React from 'react';
import { View } from 'react-native';
import { Heading5, Body, TextLink } from '../../components';
import { SyntheticAccount } from '../../models';
import { AccountCard as styles } from './styles';

interface AccountCard {
  account: SyntheticAccount;
  onHandleArchive: () => void;
}

const AccountCard = ({ account, onHandleArchive }: AccountCard) => {
  return (
    <View style={styles.cardContainer}>
      <Heading5 fontWeight="bold">{account.name}</Heading5>

      <View style={styles.cardDetails}>
        <View style={styles.detail}>
          <Body fontWeight="semibold">Account</Body>
          <Body>{account.account_number || account.account_number_last_four || 'Pending'}</Body>
        </View>

        <View style={styles.detail}>
          <Body fontWeight="semibold">Routing</Body>
          <Body>{account.routing_number || 'Pending'}</Body>
        </View>
      </View>

      <TextLink style={styles.link} onPress={onHandleArchive}>
        Archive Account
      </TextLink>
    </View>
  );
};

export default AccountCard;

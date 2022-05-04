import React, { useEffect } from 'react';
import { Button, Screen, TextLink } from '../../components';
import { Body, Heading3, Heading5 } from '../../components/Typography';
// import PlaidLink from '../../components/PlaidLink';
// import { useAccounts } from '../../contexts/Accounts';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/core';
import { RootStackParamList } from '../../types';
import { ConnectScreen as styles } from './styles';

interface ConnectAccountScreenProps {
  route: RouteProp<RootStackParamList, 'ConnectAccount'>;
  navigation: StackNavigationProp<RootStackParamList, 'ConnectAccount'>;
}

const ConnectAccountScreen = ({ navigation }: ConnectAccountScreenProps): JSX.Element => {
  // const { linkToken } = useAccounts();
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TextLink onPress={() => navigation.navigate('ExternalAccounts')}>
          &lt; External Accounts
        </TextLink>
      ),
    });
  }, [navigation]);

  return (
    <Screen withoutHeader>
      <Heading3 textAlign="center" style={styles.heading}>
        Connect Account
      </Heading3>
      <Heading5 textAlign="center" fontWeight="semibold">
        Select account type to add:
      </Heading5>
      <Heading5 textAlign="center" fontWeight="bold" style={styles.heading}>
        Two-Way Transfer Account
      </Heading5>
      <Body>
        A two-way transfer account can be used to transfer money in and out of your other accounts
        with Rize.
      </Body>
      <Body style={styles.heading}>Things to Consider:</Body>
      <Body style={styles.list}>
        <Body style={styles.bullet}>{'\u2022'}</Body>
        You must prove that you have access to the bank account in order to connect to it.
      </Body>
      <Body style={styles.list}>
        <Body style={styles.bullet}>{'\u2022'}</Body>
        Over your lifetime as a customer with Rize, only 6 bank accounts can be connected.
      </Body>
      <Body style={styles.list}>
        <Body style={styles.bullet}>{'\u2022'}</Body>
        You cannot remove / archive an account until after 30 days from the initial connection.
      </Body>
      {/* <PlaidLink title="Connect Two-way Transfer Account" linkToken={linkToken} /> */}
      <Heading5 textAlign="center" fontWeight="bold" style={styles.heading}>
        One-Way Outgoing Transfer Account
      </Heading5>
      <Body style={styles.list}>
        A One-way Outgoing Transfer account can receive money from an account at Rize. Money cannot
        be transferred from a One-way Outgoing Transfer Account to an account at Rize.
      </Body>
      <Button
        title="Connect One-way Outgoing Transfer Account"
        onPress={() => navigation.push('ConnectOneWay')}
      />
    </Screen>
  );
};

export default ConnectAccountScreen;

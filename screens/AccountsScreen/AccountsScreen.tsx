import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screen, Button, Body, Heading3, Heading4, TextLink } from '../../components';
import { RootStackParamList } from '../../types';
import { useAccounts } from '../../contexts/Accounts';
import { SyntheticAccount } from '../../models';
import utils from '../../utils/utils';
import styles from './styles';
import OpenBrokerageButton from '../BrokerageOnboarding/OpenBrokerageButton';
import { isEmpty } from 'lodash';

interface AccountsScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Accounts'>;
}

type AccountInfoProps = {
  account: SyntheticAccount;
};

export default function AccountsScreen({ navigation }: AccountsScreenProps): JSX.Element {
  const { liabilityAccounts, refetchAccounts } = useAccounts();
  const [isLoading, setIsLoading] = useState(false);

  let accountTimeout;

  const onPressAccountName = (account: SyntheticAccount): void => {
    navigation.navigate('AccountDetails', {
      accountUid: account.uid,
    });
  };

  useEffect(() => {
    refreshAccountsPeriodically();
    return () => clearTimeout(accountTimeout);
  }, []);

  const AccountInfo = ({ account }: AccountInfoProps): JSX.Element => {
    return (
      <View style={styles.accountInfo}>
        <TextLink
          textAlign="center"
          style={styles.accountName}
          onPress={(): void => onPressAccountName(account)}
          fontType={Heading4}
        >
          {account.name}
        </TextLink>
        <Body fontWeight="semibold" textAlign="center">
          {utils.formatCurrency(account.net_usd_available_balance)}
        </Body>
      </View>
    );
  };

  const refreshAccountsPeriodically = async (): Promise<void> => {
    const { data: accounts } = await refetchAccounts();
    const readyAccounts = accounts.filter((account) => account.liability);
    if (!isEmpty(readyAccounts)) {
      setIsLoading(false);
      return;
    }

    accountTimeout = setTimeout(() => {
      refreshAccountsPeriodically();
    }, 5000);
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Heading3 textAlign="center" style={styles.loading}>
          We&apos;re processing your account.
        </Heading3>
      </View>
    );
  }

  return (
    <>
      <Screen withoutHeader>
        <Heading3 textAlign="center" style={styles.heading}>
          Accounts
        </Heading3>

        {!isEmpty(liabilityAccounts) ? (
          <>
            {liabilityAccounts.map((account, idx) => (
              <AccountInfo key={idx} account={account} />
            ))}
          </>
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
            <Heading3 textAlign="center" style={styles.loading}>
              We&apos;re processing your accounts.
            </Heading3>
          </View>
        )}
      </Screen>

      {!isEmpty(liabilityAccounts) && (
        <View style={styles.btnContainer}>
          <OpenBrokerageButton accounts={liabilityAccounts} />
          <Button
            style={styles.button}
            title="Open Additional Account"
            onPress={() => navigation.navigate('AccountsSetup')}
          />
        </View>
      )}
    </>
  );
}

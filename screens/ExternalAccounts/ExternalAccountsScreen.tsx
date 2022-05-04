import React, { useEffect, useState } from 'react';
import { Screen, HorizontalLine, Button } from '../../components';
import { Body, Heading3, Heading4, Heading5 } from '../../components/Typography';
import { ActivityIndicator, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useAccounts } from '../../contexts/Accounts';
import { AccountsScreen as styles } from './styles';
import AccountCard from './ExternalAccountCard';
import { isEmpty } from 'lodash';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, MessageStatus, MessageState } from '../../types';
interface ExternalAccountsScreenProps {
  route: RouteProp<RootStackParamList, 'ExternalAccounts'>;
  navigation: StackNavigationProp<RootStackParamList, 'ExternalAccounts'>;
}

const ExternalAccountsScreen = ({
  route,
  navigation,
}: ExternalAccountsScreenProps): JSX.Element => {
  const { externalAccounts, refetchAccounts, archiveAccount, isLoading } = useAccounts();
  const [message, setMessage] = useState<MessageState>({});

  const status = route.params?.status;
  const copy = route.params?.copy;

  useEffect(() => {
    refetchAccounts();
  }, []);

  useEffect(() => {
    status && setMessage({ status, copy });
  }, [route.params]);

  const twoWayTransferAccount = externalAccounts.find(
    (account) => account.synthetic_account_category === 'plaid_external'
  );

  const oneWayTransferAccounts = externalAccounts.filter(
    (account) => account.synthetic_account_category === 'outbound_ach'
  );

  const handleArchiveAccount = async (accountUid: string) => {
    try {
      await archiveAccount(accountUid);
      setMessage({ status: MessageStatus.SUCCESS, copy: 'Account Archive Successful.' });
    } catch {
      setMessage({ status: MessageStatus.ERROR, copy: 'Account Archive Failed.' });
    }
  };

  return (
    <Screen>
      <Heading3 textAlign="center">External Accounts</Heading3>
      {message.status && (
        <Body color={message.status} textAlign="center" fontWeight="semibold" style={styles.status}>
          {message.copy}
        </Body>
      )}

      <View style={styles.ctaContainer}>
        {twoWayTransferAccount && (
          <>
            <Heading5 textAlign="center">Two-way Transfer Account</Heading5>
            <AccountCard
              account={twoWayTransferAccount}
              onHandleArchive={() =>
                navigation.navigate('ArchiveExternalAccount', {
                  accountUid: twoWayTransferAccount.uid,
                })
              }
            />
            {!isEmpty(oneWayTransferAccounts) && <HorizontalLine style={{ marginBottom: 50 }} />}
          </>
        )}

        {!isEmpty(oneWayTransferAccounts) && (
          <>
            {isLoading ? (
              <View style={styles.loading}>
                <ActivityIndicator size="large" />
                <Heading4 textAlign="center" style={styles.loading}>
                  Archiving Account
                </Heading4>
              </View>
            ) : (
              <>
                <Heading5 textAlign="center">One-way Outgoing Transfer Accounts</Heading5>
                {oneWayTransferAccounts.map((account, index) => (
                  <AccountCard
                    key={index}
                    account={account}
                    onHandleArchive={() => handleArchiveAccount(account.uid)}
                  />
                ))}
              </>
            )}
          </>
        )}

        <Button title="Connect Account" onPress={() => navigation.navigate('ConnectAccount')} />
      </View>
    </Screen>
  );
};

export default ExternalAccountsScreen;

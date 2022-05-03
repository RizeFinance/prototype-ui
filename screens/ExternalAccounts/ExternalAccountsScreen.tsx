import React, { useEffect, useState } from 'react';
import { Screen, TextLink, HorizontalLine, Button } from '../../components';
import { Body, Heading3, Heading5 } from '../../components/Typography';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAccounts } from '../../contexts/Accounts';
import { AccountsScreen as styles } from './styles';
import { SyntheticAccount } from '../../models';
import { isEmpty } from 'lodash';

interface AccountCard {
  account: SyntheticAccount;
  onHandleArchive: () => void;
}

enum MessageStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}
interface MessageState {
  status?: MessageStatus;
  copy?: string;
}

export default function ExternalAccountsScreen(): JSX.Element {
  const navigation = useNavigation();
  const { externalAccounts, refetchAccounts, archiveAccount, isLoading } = useAccounts();
  const [message, setMessage] = useState<MessageState>({});
  useEffect(() => {
    refetchAccounts();
  }, []);

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

  const AccountCard = ({ account, onHandleArchive }: AccountCard) => {
    return (
      <View style={styles.cardContainer}>
        <Heading5 fontWeight="bold">{account.name}</Heading5>

        <View style={styles.cardDetails}>
          <View style={styles.detail}>
            <Body fontWeight="semibold">Account</Body>
            <Body>{account.account_number || account.account_number_last_four}</Body>
          </View>

          <View style={styles.detail}>
            <Body fontWeight="semibold">Routing</Body>
            <Body>{account.routing_number}</Body>
          </View>
        </View>

        <TextLink disabled={isLoading} style={styles.link} onPress={onHandleArchive}>
          Archive Account
        </TextLink>
      </View>
    );
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
            <HorizontalLine style={{ marginBottom: 50 }} />
          </>
        )}

        {!isEmpty(oneWayTransferAccounts) && (
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

        <Button title="Connect Account" onPress={() => navigation.navigate('ConnectAccount')} />
      </View>
    </Screen>
  );
}

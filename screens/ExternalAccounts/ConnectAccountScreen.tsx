import React, { useEffect, useState } from 'react';
import { Button, Screen, TextLink } from '../../components';
import { Body, Heading3, Heading5 } from '../../components/Typography';
import PlaidLink, { PlaidAccount } from '../../components/PlaidLink';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/core';
import { RootStackParamList, MessageStatus, AccountCategory } from '../../types';
import { ConnectScreen as styles } from './styles';
import AccountCard from './ExternalAccountCard';
import { useAccounts } from '../../contexts/Accounts';
import { useAuth } from '../../contexts/Auth';
import { capitalize, find, get, isEmpty } from 'lodash';
import { AccountService } from '../../services';
import { View, ActivityIndicator } from 'react-native';

interface ConnectAccountScreenProps {
  route: RouteProp<RootStackParamList, 'ConnectAccount'>;
  navigation: StackNavigationProp<RootStackParamList, 'ConnectAccount'>;
}

const ConnectAccountScreen = ({ navigation }: ConnectAccountScreenProps): JSX.Element => {
  const [selectableAccounts, setSelectableAccounts] = useState<PlaidAccount[]>([]);
  const [publicToken, setPublicToken] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { accessToken } = useAuth();
  const { poolUids, linkToken, externalAccounts, refetchAccounts, fetchLinkToken } = useAccounts();

  useEffect(() => {
    refetchAccounts();
    fetchLinkToken();
  }, []);

  const twoWayTransferAccount = externalAccounts.find(
    (account) => account.synthetic_account_category === 'plaid_external'
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TextLink onPress={() => navigation.navigate('ExternalAccounts')}>
          &lt; External Accounts
        </TextLink>
      ),
    });
  }, [navigation]);

  const ExternalAccountForm = (): JSX.Element => {
    const onCreateAccount = async (account: PlaidAccount): Promise<void> => {
      setIsLoading(true);

      try {
        // Get the synthetic account type
        const { data: types } = await AccountService.getSyntheticAccountTypes(accessToken);
        const externalType = find(types, {
          synthetic_account_category: AccountCategory.PLAID_EXTERNAL,
        });

        if (!externalType) {
          throw new Error('Unable to create account.');
        }
        // Create the synthetic account
        await AccountService.createSyntheticAccount({
          accessToken,
          syntheticAccountTypeUid: externalType.uid,
          poolUid: poolUids[0],
          name: account.name,
          accountId: account.id,
          publicToken,
        });

        refreshAccountsPeriodically();
        navigation.navigate('ExternalAccounts', {
          status: MessageStatus.SUCCESS,
          copy: 'Account successfully connected.',
        });
      } catch (err) {
        const status = get(err, ['data', 'errors', 0, 'detail']);
        navigation.navigate('ExternalAccounts', {
          status: MessageStatus.ERROR,
          copy: `Account failed to connect. ${status}`,
        });
        setIsLoading(false);
        setSelectableAccounts([]);
        throw err;
      }
    };

    const refreshAccountsPeriodically = async (): Promise<void> => {
      const accounts = await refetchAccounts();

      const readyAccounts = accounts.filter(
        (account) =>
          account.synthetic_account_category === AccountCategory.PLAID_EXTERNAL &&
          !!account.routing_number
      );
      if (!isEmpty(readyAccounts)) {
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        refreshAccountsPeriodically();
      }, 5000);
    };

    if (isEmpty(selectableAccounts)) return <></>;

    return (
      <>
        <Heading5 textAlign="center" style={styles.heading}>
          Select account from the available accounts:
        </Heading5>
        {selectableAccounts.map((account, index) => (
          <TextLink
            textAlign="center"
            style={{ marginBottom: 20 }}
            onPress={(): void => {
              onCreateAccount(account);
            }}
            key={index}
          >
            {account.name}: {capitalize(account.subtype)}
          </TextLink>
        ))}
      </>
    );
  };

  const onHandleSuccess = (publicToken: string, metadata: { accounts: PlaidAccount[] }) => {
    setPublicToken(publicToken);
    setSelectableAccounts(metadata.accounts);
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

  if (!isEmpty(selectableAccounts))
    return (
      <Screen withoutHeader>
        <Heading3 textAlign="center" style={styles.heading}>
          Connect Account
        </Heading3>
        <ExternalAccountForm />
      </Screen>
    );

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
      {twoWayTransferAccount ? (
        <>
          <Body style={{ marginTop: 20 }}>
            You can only have one connected Two-way Transfer Account. To connect a new Two-way
            Transfer Account you must first achive your existing account.
          </Body>
          <AccountCard
            account={twoWayTransferAccount}
            onHandleArchive={() =>
              navigation.navigate('ArchiveExternalAccount', {
                accountUid: twoWayTransferAccount.uid,
              })
            }
          />
        </>
      ) : (
        <>
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
        </>
      )}

      {linkToken && (
        <PlaidLink
          title="Connect Two-way Transfer Account"
          linkToken={linkToken}
          onSuccess={onHandleSuccess}
          disabled={!!twoWayTransferAccount}
        />
      )}

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
        style={{ marginTop: 20 }}
      />
    </Screen>
  );
};

export default ConnectAccountScreen;

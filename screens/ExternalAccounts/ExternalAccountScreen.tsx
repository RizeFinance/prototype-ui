import React, { useState, useEffect } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { Button, Screen, TextLink } from '../../components';
import { Body, Heading3, Heading5 } from '../../components/Typography';
import { useAccounts } from '../../contexts/Accounts';
import { SyntheticAccount } from '../../models';
import PlaidLink from '../../components/PlaidLink';
import { useAuth } from '../../contexts/Auth';
import { AccountService } from '../../services';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/core';
import { RootStackParamList } from '../../types';
import { AccountScreen as styles } from './styles';
import { capitalize, isEmpty } from 'lodash';

interface ExternalAccountProps {
  route: RouteProp<RootStackParamList, 'ExternalAccount'>;
  navigation: StackNavigationProp<RootStackParamList, 'ExternalAccount'>;
}

const ExternalAccountScreen = ({ navigation, route }: ExternalAccountProps): JSX.Element => {
  const { externalAccounts, poolUids, refetchAccounts, linkToken, fetchLinkToken } = useAccounts();
  const { accessToken } = useAuth();
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [showFailedMessage, setShowFailedMessage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [publicToken, setPublicToken] = useState<string>(null);
  const [selectableAccounts, setSelectableAccounts] = useState<SyntheticAccount[]>([]);

  const archiveStatus = route.params?.archiveStatus;
  const archiveNote = route.params?.archiveNote;

  useEffect(() => {
    refetchAccounts();
    fetchLinkToken();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TextLink onPress={() => navigation.push('ExternalAccounts')}>
          &lt; External Accounts
        </TextLink>
      ),
    });
  }, [navigation]);

  const renderExternalAccountDetails = (externalAccount: SyntheticAccount): JSX.Element => {
    return (
      <View style={styles.detailsSection}>
        <Heading5 textAlign="center" style={styles.heading}>
          {externalAccount.name}
        </Heading5>
        <View style={styles.row}>
          <View style={styles.col}>
            <Body fontWeight="semibold">Checking Number</Body>
            <Body>**** **** **** {externalAccount.account_number_last_four}</Body>
          </View>
          <View style={styles.col}>
            <Body fontWeight="semibold">Routing Number</Body>
            <Body>{externalAccount.routing_number}</Body>
          </View>
        </View>
        <View>
          <Body textAlign="center" style={styles.contactSupport}>
            <Button
              title="Archive Bank Account"
              onPress={() =>
                navigation.navigate('ArchiveExternalAccount', {
                  accountUid: externalAccount.uid,
                })
              }
            />
          </Body>
        </View>
      </View>
    );
  };

  const renderArchiveOutcome = () => {
    const success = archiveStatus === 'success';

    return (
      <Body
        color={success ? 'success' : 'error'}
        textAlign="center"
        fontWeight="semibold"
        style={styles.connectStatusMessage}
      >
        Account Archive {success ? 'Successful' : 'Failed'}.{'\n'} {!success && archiveNote}
      </Body>
    );
  };

  const renderCreateExternalAccountForm = (): JSX.Element => {
    const onCreateAccount = async (account): Promise<void> => {
      setShowFailedMessage(false);
      setIsLoading(true);

      try {
        // Get the synthetic account type
        const types = await AccountService.getSyntheticAccountTypes(accessToken);
        const externalType = types.data.find(
          (x) => x.synthetic_account_category === 'plaid_external'
        );

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
        setShowSuccessMessage(true);
      } catch (err) {
        setShowFailedMessage(true);
        setIsLoading(false);
        throw err;
      }
    };

    const refreshAccountsPeriodically = async (): Promise<void> => {
      const { data: accounts } = await refetchAccounts();

      const readyAccounts = accounts.filter(
        (account) =>
          account.synthetic_account_category === 'plaid_external' && !!account.routing_number
      );
      if (!isEmpty(readyAccounts)) {
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        refreshAccountsPeriodically();
      }, 5000);
    };

    const onHandleSuccess = (publicToken, metadata) => {
      setPublicToken(publicToken);
      setSelectableAccounts(metadata.accounts);
    };

    if (selectableAccounts?.length >= 1) {
      return (
        <>
          <Heading5 textAlign="center" style={styles.heading}>
            Select an Account
          </Heading5>
          {selectableAccounts.map((account, index) => (
            <Pressable
              onPress={(): void => {
                onCreateAccount(account);
              }}
              key={index}
            >
              <View key={index} style={styles.accountContainer}>
                <Body style={styles.accountName}>
                  {account.name}: {capitalize(account.subtype)}
                </Body>
              </View>
            </Pressable>
          ))}
        </>
      );
    }

    return (
      <>
        {linkToken ? (
          <PlaidLink linkToken={linkToken} onSuccess={onHandleSuccess} />
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
            <Heading3 textAlign="center" style={styles.loading}>
              We&apos;re retrieving your accounts.
            </Heading3>
          </View>
        )}
      </>
    );
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
    <Screen withoutHeader>
      <Heading3 textAlign="center" style={styles.heading}>
        External Account
      </Heading3>

      {!showSuccessMessage && !showFailedMessage && archiveStatus && renderArchiveOutcome()}

      {showSuccessMessage && (
        <Body
          color="success"
          textAlign="center"
          fontWeight="semibold"
          style={styles.connectStatusMessage}
        >
          Account successfully connected.
        </Body>
      )}
      {showFailedMessage && (
        <Body
          color="error"
          textAlign="center"
          fontWeight="semibold"
          style={styles.connectStatusMessage}
        >
          Account failed to connect.
        </Body>
      )}
      {externalAccounts &&
        externalAccounts.length > 0 &&
        renderExternalAccountDetails(externalAccounts[0])}
      {!externalAccounts || (externalAccounts.length === 0 && renderCreateExternalAccountForm())}
    </Screen>
  );
};

export default ExternalAccountScreen;

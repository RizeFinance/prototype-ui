import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
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
import { capitalize, isEmpty, get } from 'lodash';

interface ExternalAccountProps {
  route: RouteProp<RootStackParamList, 'ExternalAccount'>;
  navigation: StackNavigationProp<RootStackParamList, 'ExternalAccount'>;
}

interface PlaidAccount {
  subtype: string;
  name: string;
  id: string;
}

const PlaidExternal = 'plaid_external';

const ExternalAccountScreen = ({ navigation, route }: ExternalAccountProps): JSX.Element => {
  const { externalAccounts, poolUids, refetchAccounts, linkToken, fetchLinkToken } = useAccounts();
  const { accessToken } = useAuth();
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [showFailedMessage, setShowFailedMessage] = useState<boolean>(false);
  const [status, setStatus] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [publicToken, setPublicToken] = useState<string>(null);
  const [selectableAccounts, setSelectableAccounts] = useState<PlaidAccount[]>([]);

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
      setStatus(null);

      try {
        // Get the synthetic account type
        const types = await AccountService.getSyntheticAccountTypes(accessToken);
        const externalType = types.data.find((x) => x.synthetic_account_category === PlaidExternal);

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

        const status = get(err, ['data', 'errors', 0, 'detail']);
        setStatus(status);
        setIsLoading(false);
        setSelectableAccounts([]);
        throw err;
      }
    };

    const refreshAccountsPeriodically = async (): Promise<void> => {
      const { data: accounts } = await refetchAccounts();

      const readyAccounts = accounts.filter(
        (account) =>
          account.synthetic_account_category === PlaidExternal && !!account.routing_number
      );
      if (!isEmpty(readyAccounts)) {
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        refreshAccountsPeriodically();
      }, 5000);
    };

    const onHandleSuccess = (publicToken: string, metadata: any) => {
      setPublicToken(publicToken);
      setSelectableAccounts(metadata.accounts);
    };

    if (selectableAccounts?.length >= 1) {
      return (
        <>
          <Heading5 textAlign="center" style={styles.heading}>
            Select account from the avaliable accounts:
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

      {!selectableAccounts &&
        !showSuccessMessage &&
        !showFailedMessage &&
        archiveStatus &&
        renderArchiveOutcome()}

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
          Account failed to connect. {'\n'} {status}
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

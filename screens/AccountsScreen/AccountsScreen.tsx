import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screen, Button } from '../../components';
import { Body, Heading3, Heading4 } from '../../components/Typography';
import { RootStackParamList } from '../../types';
import { useAccounts } from '../../contexts/Accounts';
import { SyntheticAccount } from '../../models';
import TextLink from '../../components/TextLink';
import utils from '../../utils/utils';
import AddAccountModal from '../../modals/AddAccountModal';
import styles from './styles';
import { useAuth } from '../../contexts/Auth';
import AccountService from '../../services/AccountService';
import BrokerageOnboardingButton from './BrokerageOnboardingButton';
import { isEmpty } from 'lodash';

interface AccountsScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Accounts'>;
}

type AccountInfoProps = {
  account: SyntheticAccount;
};

export default function AccountsScreen({ navigation }: AccountsScreenProps): JSX.Element {
  const { liabilityAccounts, refetchAccounts } = useAccounts();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailedMessage, setShowFailedMessage] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const { accessToken } = useAuth();

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

  useEffect(() => {
    if (name.trim().length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name]);

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

  const createAccount = async () => {
    const syntheticAccountTypeUid = liabilityAccounts[0].synthetic_account_type_uid;
    const poolUid = liabilityAccounts[0].pool_uid;

    try {
      await AccountService.createSyntheticAccount({
        accessToken,
        name,
        syntheticAccountTypeUid,
        poolUid,
      });
      setShowModal(false);
      setShowSuccessMessage(true);
      refreshAccountsPeriodically();
    } catch (e) {
      setShowFailedMessage(true);
      setIsLoading(false);
      throw e;
    }
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
        {liabilityAccounts?.length > 0 ? (
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

        <AddAccountModal
          disabled={disabled}
          handleSubmit={createAccount}
          name={name}
          setName={setName}
          visible={showModal}
          setShowModal={setShowModal}
        />
      </Screen>
      <View style={styles.btnContainer}>
        <BrokerageOnboardingButton navigation={navigation} />
        <Button
          style={styles.button}
          title="Add Additional Account"
          onPress={() => setShowModal(true)}
        />
      </View>
    </>
  );
}

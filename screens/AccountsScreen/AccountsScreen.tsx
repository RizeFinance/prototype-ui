import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screen, Button } from '../../components';
import { Body, Heading3, Heading4 } from '../../components/Typography';
import { RootStackParamList } from '../../types';
import { useAccounts } from '../../contexts/Accounts';
import { useComplianceWorkflow } from '../../contexts/ComplianceWorkflow';
import { SyntheticAccount } from '../../models';
import TextLink from '../../components/TextLink';
import utils from '../../utils/utils';
import styles from './styles';
import config from '../../config/config';
import { isEmpty } from 'lodash';

interface AccountsScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Accounts'>;
}

type AccountInfoProps = {
  account: SyntheticAccount;
};

export default function AccountsScreen({ navigation }: AccountsScreenProps): JSX.Element {
  const { loadComplanceWorkflows } = useComplianceWorkflow();
  const { liabilityAccounts, refetchAccounts } = useAccounts();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage] = useState(false);
  const [showFailedMessage] = useState(false);

  let accountTimeout;

  const onPressAccountName = (account: SyntheticAccount): void => {
    navigation.navigate('AccountDetails', {
      accountUid: account.uid,
    });
  };

  const onPressOpenAccount = (): void => {
    navigation.navigate('AddAccount');
  };

  const getAccounts = async () => await refetchAccounts();

  useEffect(() => {
    (async () => {
      const brokerageProductUid = config.application.brokerageProductUid;

      if (brokerageProductUid) {
        await loadComplanceWorkflows({ product_uid: [brokerageProductUid] });
      }

      await getAccounts();
    })();

    return () => clearTimeout(accountTimeout);
  }, []);

  useEffect(() => {
    navigation.addListener('focus', getAccounts);

    return () => removeEventListener('focus', getAccounts);
  }, [navigation]);

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      </Screen>
      <View style={styles.btnContainer}>
        <Button
          style={styles.button}
          title="Open Additional Account"
          onPress={() => onPressOpenAccount()}
        />
      </View>
    </>
  );
}

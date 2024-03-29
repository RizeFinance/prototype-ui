import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/core';
import { Screen, TextLink, Button } from '../../components';
import { Body, Heading3 } from '../../components/Typography';
import { useAccounts } from '../../contexts';
import { View } from 'react-native';
import { ArchiveScreen as styles } from './styles';
import { RootStackParamList, MessageStatus } from '../../types';
import { get } from 'lodash';

interface ArchiveExternalAccountScreenProps {
  route: RouteProp<RootStackParamList, 'ArchiveExternalAccount'>;
  navigation: StackNavigationProp<RootStackParamList, 'ArchiveExternalAccount'>;
}

export default function ArchiveExternalAccountScreen({
  navigation,
  route,
}: ArchiveExternalAccountScreenProps): JSX.Element {
  const { liabilityAccounts, refetchAccounts, archiveAccount } = useAccounts();

  const accountUid = route.params?.accountUid;
  const externalAccount = liabilityAccounts.find((x) => x.uid === accountUid);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!externalAccount) {
      refetchAccounts();
    }
  }, [externalAccount]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TextLink onPress={() => navigation.navigate('ExternalAccounts')}>
          &lt; External Accounts
        </TextLink>
      ),
    });
  }, [navigation]);

  const onPressConfirm = async () => {
    setLoading(true);

    try {
      await archiveAccount(accountUid);
      navigation.navigate('ExternalAccounts', {
        status: MessageStatus.SUCCESS,
        copy: 'Account Archive Successful.',
      });
    } catch (err) {
      const apiError = get(
        err,
        ['data', 'errors', 0, 'detail'],
        'Something went wrong. Please contact us to resolve.'
      );

      navigation.navigate('ExternalAccounts', {
        status: MessageStatus.ERROR,
        copy: `Account Archive Failed. \n ${apiError}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <Heading3 textAlign="center">Archive Two-way Transfer Account?</Heading3>

      <Body style={styles.description}>
        Over your lifetime as a customer, only 5 accounts can be connected. You cannot archive an
        account until after 30 days from initial connection.
      </Body>

      <Body style={styles.warning}>Do you still want to archive your account?</Body>

      <View style={styles.ctaContainer}>
        <Button
          title="Yes, archive account"
          loading={loading}
          style={styles.button}
          onPress={onPressConfirm}
        />
        <TextLink
          textAlign={'center'}
          onPress={(): void => {
            navigation.navigate('ExternalAccounts');
          }}
        >
          No, return to view connected bank account.
        </TextLink>
      </View>
    </Screen>
  );
}

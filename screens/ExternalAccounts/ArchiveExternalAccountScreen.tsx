import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/core';
import { RootStackParamList } from '../../types';
import { Screen, TextLink, Button } from '../../components';
import { Body, Heading3 } from '../../components/Typography';
import { useAuth, useAccounts } from '../../contexts';
import { AccountService } from '../../services';
import { View } from 'react-native';
import { ArchiveScreen as styles } from './styles';
import { get } from 'lodash';

interface ArchiveExternalAccountScreenProps {
  route: RouteProp<RootStackParamList, 'ArchiveExternalAccount'>;
  navigation: StackNavigationProp<RootStackParamList, 'ArchiveExternalAccount'>;
}

export default function ArchiveExternalAccountScreen({
  navigation,
  route,
}: ArchiveExternalAccountScreenProps): JSX.Element {
  const { accessToken } = useAuth();
  const { liabilityAccounts, refetchAccounts } = useAccounts();

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
        <TextLink onPress={() => navigation.push('ExternalAccount')}>
          &lt; Connect Bank Account
        </TextLink>
      ),
    });
  }, [navigation]);

  const onPressConfirm = async () => {
    setLoading(true);

    try {
      await AccountService.archiveSyntheticAccount(accessToken, accountUid);
      await refetchAccounts();
      navigation.navigate('ExternalAccount', { archiveStatus: 'success' });
    } catch (err) {
      const archiveNote = get(
        err,
        ['data', 'errors', 0, 'detail'],
        'Something went wrong. Please contact us to resolve.'
      );

      navigation.navigate('ExternalAccount', { archiveStatus: 'failed', archiveNote });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <Heading3 textAlign="center">Archive Connected Bank Account?</Heading3>

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
            navigation.navigate('ExternalAccount');
          }}
        >
          No, return to view connected bank account.
        </TextLink>
      </View>
    </Screen>
  );
}

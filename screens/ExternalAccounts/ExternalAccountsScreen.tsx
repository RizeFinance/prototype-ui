import React from 'react';
import { Screen, TextLink } from '../../components';
import { Heading3 } from '../../components/Typography';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AccountsScreen as styles } from './styles';

export default function ExternalAccountsScreen(): JSX.Element {
  const navigation = useNavigation();

  return (
    <Screen>
      <Heading3 textAlign="center">External Accounts</Heading3>

      <View style={styles.ctaContainer}>
        <TextLink
          style={styles.link}
          textAlign={'center'}
          onPress={(): void => {
            navigation.navigate('ExternalAccount');
          }}
        >
          Connected Bank Account
        </TextLink>

        <TextLink
          style={styles.link}
          disabled={true}
          textAlign={'center'}
          onPress={(): void => {
            navigation.navigate('');
          }}
        >
          Outgoing-Only ACH Accounts
        </TextLink>
      </View>
    </Screen>
  );
}

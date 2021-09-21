import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/core';
import { RootStackParamList } from '../../types';
import { useDebitCards } from '../../contexts/DebitCards';
import { TextLink, Webview } from '../../components';
import { Heading3 } from '../../components/Typography';
import config from '../../config/config';

interface PinSetScreenProps {
  route: RouteProp<RootStackParamList, 'PinSet'>;
  navigation: StackNavigationProp<RootStackParamList, 'PinSet'>;
}

export default function PinSetScreen({ navigation, route }: PinSetScreenProps): JSX.Element {
  const { pinSetToken, loadPinSetToken } = useDebitCards();
  const [debitCardUid] = useState(route.params?.debitCardUid);

  useEffect(() => {
    loadPinSetToken(debitCardUid);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <TextLink onPress={() => navigation.goBack()}>&lt; Debit Card</TextLink>,
    });
  }, []);

  const styles = StyleSheet.create({
    heading: {
      marginBottom: 25,
    },
    webview: {
      marginTop: 200,
    },
  });

  const pinSetUrl = config.application.debitCardServiceUrl + `?token=${pinSetToken}`;

  return (
    <Screen>
      <Heading3 textAlign="center" style={styles.heading}>
        Set Pin
      </Heading3>
      {pinSetToken && <Webview uri={pinSetUrl} style={styles.webview} height={400} />}
    </Screen>
  );
}

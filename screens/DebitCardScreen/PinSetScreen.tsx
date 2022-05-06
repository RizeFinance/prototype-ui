import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { useDebitCards } from '../../contexts/DebitCards';
import { TextLink, Webview } from '../../components';
import { Heading3 } from '../../components/Typography';
import config from '../../config/config';
interface PinSetScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'PinSet'>;
}

export default function PinSetScreen({ navigation }: PinSetScreenProps): JSX.Element {
  const { pinSetToken, loadPinSetToken, activeCard } = useDebitCards();

  useEffect(() => {
    loadPinSetToken(activeCard.uid);
  }, [activeCard]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <TextLink onPress={handleBackButton}>&lt; Debit Card</TextLink>,
    });
  }, []);

  const handleBackButton = () => {
    navigation.navigate('DebitCard');
  };

  const styles = StyleSheet.create({
    heading: {
      marginBottom: 25,
    },
  });

  const pinSetUrl = config.application.debitCardServiceUrl + `?token=${pinSetToken}`;

  return (
    <Screen>
      <Heading3 textAlign="center" style={styles.heading}>
        Set Pin
      </Heading3>
      <Webview uri={pinSetUrl} height={300} width={510} />
    </Screen>
  );
}

import React from 'react';
import { View } from 'react-native';
import styles from './styles';
import { Screen } from '../../components';
import { Heading3, Body } from '../../components/Typography';

export default function UnableOpenBrokerageAccountScreen(): JSX.Element {
  return (
    <Screen useScrollView>
      <Heading3 textAlign="center" style={styles.heading}>
        We’re unable to open an account for you at this time
      </Heading3>
      <View style={styles.content}>
        <Body>
          Based on the investment objectives you have selected, this investment product would not be
          suitable or in your best interest. At this time, we do not offer an alternative product.
          You may consider seeking advice from a financial professional on investments that may be
          more appropriate for you.
        </Body>
      </View>
    </Screen>
  );
}

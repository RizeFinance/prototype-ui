import * as React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View } from 'react-native';
import { Button, Screen } from '../../components';
import { Body, BodySmall, Heading3 } from '../../components/Typography';
import { BrokerageProductType } from '../../contexts/BrokerageWorkflow';
import { RootStackParamList } from '../../types';
import styles from './styles';

interface BrokerageOverviewScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'BrokerageOverview'>;
}

export default function BrokerageOverviewScreen({
  navigation,
}: BrokerageOverviewScreenProps): JSX.Element {
  const onContinue = async (): Promise<void> => {
    navigation.navigate('ConfirmPII', { productType: BrokerageProductType });
  };

  return (
    <Screen useScrollView>
      <Heading3 textAlign="center" style={styles.heading}>
        Enable Target Yield Brokerage Account
      </Heading3>

      <BodySmall textAlign="center">Scroll to the bottom of the document to accept.</BodySmall>

      <Body>&nbsp;</Body>
      <Body>&nbsp;</Body>

      <View style={styles.content}>
        <Body>
          As part of our fiduciary duty, we must ensure that our advice is suitable in view of your
          financial situation, investment temperament, and investment objectives. This questionnaire
          helps our firm determine your investment strategy, so that you have the opportunity to
          achieve your financial goals.
        </Body>

        <Body>&nbsp;</Body>

        <Body>
          Please answer these questions as honestly as you can. If your financial situation,
          investment temperament, and/or your investment objectives change at any point during our
          relationship, you must let us know immediately so that we can alter your investment
          strategy accordingly.
        </Body>

        <Body>&nbsp;</Body>

        <Body>
          This product is designed to provide a target annualized yield of 3% with the aim to offer
          you an attractive yield over banking deposits or money market funds, while minimizing
          exposure to certain market functionalities. If you are looking for an investment product
          that provides high returns, you should consult with an investment advisor who can help you
          find a product that best fits your needs.
        </Body>
      </View>

      <Body>&nbsp;</Body>
      <Body>&nbsp;</Body>

      <Button style={styles.button} title="Continue" onPress={onContinue} />
    </Screen>
  );
}

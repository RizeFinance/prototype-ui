import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import { Button, Input, Screen, TextLink } from '../components';
import { Body, Heading3 } from '../components/Typography';
import DebitCardService from '../services/DebitCardService';
import { useAuth } from '../contexts/Auth';
import { RouteProp } from '@react-navigation/core';
import * as Yup from 'yup';

interface DebitCardActivationScreenProps {
  route: RouteProp<RootStackParamList, 'DebitCardActivation'>;
  navigation: StackNavigationProp<RootStackParamList, 'DebitCardActivation'>;
}

type DebitCardActivationFields = {
  cardLastFourDigits: string;
  cvv: string;
  cardExpiry: string;
};

export default function DebitCardActivationScreen({
  navigation,
  route,
}: DebitCardActivationScreenProps): JSX.Element {
  const { accessToken } = useAuth();

  const [showFailedMessage, setShowFailedMessage] = useState<boolean>(false);
  const debitCardUid = route.params?.debitCardUid;
  const styles = StyleSheet.create({
    heading: {
      marginTop: 24,
      marginBottom: 24,
      textAlign: 'center',
    },
    formGroup: {
      marginVertical: 10,
    },
    submitButton: {
      marginTop: 30,
    },
    input: {
      marginVertical: 8,
    },
    failMessage: {
      textAlign: 'center',
      fontWeight: '600',
    },
  });

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <TextLink onPress={() => navigation.goBack()}>&lt; Debit Card</TextLink>,
    });
  }, []);

  const initialValues: DebitCardActivationFields = {
    cardLastFourDigits: '',
    cvv: '',
    cardExpiry: '',
  };

  const activationValidationSchema = Yup.object().shape({
    cardLastFourDigits: Yup.string()
      .required('Last 4 Digits is required.')
      .matches(/^\d{4}$/, {
        excludeEmptyString: true,
        message: 'Card number must be exactly four digits.',
      }),
    cvv: Yup.string()
      .required('CVV is required')
      .matches(/^\d{3,4}$/, {
        excludeEmptyString: true,
        message: 'CVV must be three or four digits.',
      }),
    cardExpiry: Yup.string()
      .required('Card Expiration is required.')
      .matches(/^\d{4}-\d{2}$/, {
        excludeEmptyString: true,
        message: 'Card Expiration must be in YYYY-MM format.',
      }),
  });

  const onSubmit = async (values: DebitCardActivationFields): Promise<void> => {
    setShowFailedMessage(false);
    try {
      await DebitCardService.activateDebitCard(
        accessToken,
        debitCardUid,
        values.cardLastFourDigits,
        values.cvv,
        values.cardExpiry
      );
      navigation.navigate('DebitCard', {
        activated: true,
      });
    } catch {
      setShowFailedMessage(true);
    }
  };

  return (
    <Screen withoutHeader>
      <Heading3 style={styles.heading}>Activate Debit Card</Heading3>
      {showFailedMessage && (
        <Body color="error" style={styles.failMessage}>
          Activation failed
        </Body>
      )}
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={activationValidationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
          isSubmitting,
          dirty,
          touched,
        }) => (
          <View style={styles.formGroup}>
            <Input
              label="Last 4 Digits of Card"
              keyboardType="numeric"
              value={values.cardLastFourDigits}
              onChangeText={handleChange('cardLastFourDigits')}
              onBlur={handleBlur('cardLastFourDigits')}
              errorText={!touched.cardLastFourDigits ? '' : errors.cardLastFourDigits}
              containerStyle={styles.input}
            />
            <Input
              label="CVV"
              keyboardType="numeric"
              value={values.cvv}
              onChangeText={handleChange('cvv')}
              onBlur={handleBlur('cvv')}
              errorText={!touched.cvv ? '' : errors.cvv}
              containerStyle={styles.input}
            />
            <Input
              label="Card Expiration"
              value={values.cardExpiry}
              onChangeText={handleChange('cardExpiry')}
              onBlur={handleBlur('cardExpiry')}
              errorText={!touched.cardExpiry ? '' : errors.cardExpiry}
              containerStyle={styles.input}
            />
            <Button
              title="Submit"
              disabled={!dirty || !isValid || isSubmitting}
              onPress={(): void => handleSubmit()}
              style={styles.submitButton}
            />
          </View>
        )}
      </Formik>
    </Screen>
  );
}

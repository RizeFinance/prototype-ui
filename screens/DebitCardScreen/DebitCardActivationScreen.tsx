import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import { Button, Input, Screen, TextLink, Body, Heading3, MaskedInput } from '../../components';
import DebitCardService from '../../services/DebitCardService';
import { useAuth, useDebitCards } from '../../contexts';
import { RootStackParamList } from '../../types';
import * as Yup from 'yup';
import { parse, isValid, isFuture } from 'date-fns';

const initialValues: ICardValues = {
  cardLastFourDigits: '',
  cvv: '',
  cardExpiry: '',
};

export default function DebitCardActivationScreen({
  navigation,
}: DebitCardActivationScreenProps): JSX.Element {
  const { accessToken } = useAuth();
  const { activeCard, refetchDebitCards } = useDebitCards();

  const [showFailedMessage, setShowFailedMessage] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <TextLink onPress={() => navigation.goBack()}>&lt; Debit Card</TextLink>,
    });
  }, []);

  const onSubmit = async (values: ICardValues): Promise<void> => {
    const dateArray = values.cardExpiry.split('/');
    const month = dateArray[0];
    const year = dateArray[1];
    setShowFailedMessage(false);
    try {
      await DebitCardService.activateDebitCard(
        accessToken,
        activeCard.uid,
        values.cardLastFourDigits,
        values.cvv,
        `${year}-${month}`
      );
      navigation.navigate('PinSet');
    } catch {
      setShowFailedMessage(true);
    } finally {
      refetchDebitCards();
    }
  };

  return (
    <Screen withoutHeader>
      <Heading3 style={styles.heading}>Activate Card</Heading3>
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
              label="Last 4 Digits"
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
            <MaskedInput
              label="Expiration"
              type={'datetime'}
              options={{
                format: 'MM/YYYY',
              }}
              onChangeText={handleChange('cardExpiry')}
              onBlur={handleBlur('cardExpiry')}
              errorText={!touched.cardExpiry ? '' : errors.cardExpiry}
              containerStyle={styles.input}
              placeholder="MM/YYYY"
              value={values.cardExpiry}
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
declare module 'yup' {
  interface StringSchema {
    validateCardExpiry(message: string): StringSchema;
  }
}

Yup.addMethod(Yup.string, 'validateCardExpiry', function (errorMessage) {
  return this.test('validateCardExpiry', errorMessage, function (value) {
    const { path, createError } = this;
    const parsedDate = parse(value, 'MM/yyyy', new Date());
    const isDateValid = isValid(parsedDate) && isFuture(parsedDate);
    return isDateValid ? true : createError({ path, message: errorMessage });
  });
});

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
    .validateCardExpiry('A valid card expiration is required.'),
});

interface DebitCardActivationScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'DebitCardActivation'>;
}

interface ICardValues {
  cardLastFourDigits: string;
  cvv: string;
  cardExpiry: string;
}

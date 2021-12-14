import { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Pressable, StyleSheet } from 'react-native';
import { Screen, Button } from '../components';
import { RootStackParamList } from '../types';
import { Heading3, Body } from '../components/Typography';
import { useThemeColor } from '../components/Themed';
import CustomerService from '../services/CustomerService';
import { useComplianceWorkflow, ProductType } from '../contexts/ComplianceWorkflow';
import { useAuth } from '../contexts/Auth';
import { get } from 'lodash';

interface ConfirmPIIScreenProps {
  route: RouteProp<RootStackParamList, 'ConfirmPII'>;
  navigation: StackNavigationProp<RootStackParamList, 'ConfirmPII'>;
}

export default function ConfirmPIIScreen({
  route,
  navigation,
}: ConfirmPIIScreenProps): JSX.Element {
  const { evaluateCurrentStep } = useComplianceWorkflow();
  const { accessToken, customer } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const params = get(route, ['params', 'fieldValues'], {});
  const productType = get(route, ['params', 'productType'], ProductType.Checking);
  const data = { ...customer, ...params };

  const gray = useThemeColor('gray');
  const primary = useThemeColor('primary');
  const error = useThemeColor('error');

  const styles = StyleSheet.create({
    editButton: {
      textDecorationLine: 'underline',
      textDecorationColor: primary,
      color: primary,
      marginTop: 20,
    },
  });

  const onPressEditButton = () => {
    navigation.navigate('PII');
  };

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);

    try {
      if (productType === ProductType.Brokerage) {
        await evaluateCurrentStep();
        return;
      }

      await CustomerService.updateCustomer(accessToken, customer.email, {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        suffix: data.suffix,
        phone: data.phone.replace(/\D/g, ''),
        ssn: data.ssn,
        dob: data.dob,
        address: {
          street1: data.street1,
          street2: data.street2,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
        },
      }).then(
        () => {
          navigation.navigate('BankingDisclosures');
        },
        (errors) => {
          const errorString = errors.map((error) => {
            return error.extra ? `${error.detail}. ${error.extra},` : `${error.detail}. `;
          });
          setErrorText(errorString);
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen useScrollView>
      <Heading3 textAlign="center">Confirm Your Personal Information</Heading3>
      <Body>&nbsp;</Body>
      <Body>&nbsp;</Body>
      <Body fontWeight="semibold">First name</Body>
      <Body style={{ color: gray }}>{data.first_name}</Body>
      <Body>&nbsp;</Body>
      <Body fontWeight="semibold">Last name</Body>
      <Body style={{ color: gray }}>{data.last_name}</Body>
      <Body>&nbsp;</Body>
      <Body fontWeight="semibold">Date of Birth</Body>
      <Body style={{ color: gray }}>{data.dob}</Body>
      <Body>&nbsp;</Body>
      <Body fontWeight="semibold">Address</Body>
      <Body
        style={{ color: gray }}
      >{`${data.street1} ${data.street2}, ${data.city}, ${data.state} ${data.postal_code}`}</Body>
      <Body>&nbsp;</Body>
      <Body fontWeight="semibold">Phone Number</Body>
      <Body style={{ color: gray }}>{data.phone}</Body>
      <Body>&nbsp;</Body>
      <Body fontWeight="semibold">Social Security Number</Body>
      <Body style={{ color: gray }}>{data.ssn ?? '*** ** ****'}</Body>
      <Body>&nbsp;</Body>
      <Pressable
        onPress={(): void => {
          onPressEditButton();
        }}
        disabled={isSubmitting}
      >
        {productType === ProductType.Checking && (
          <Body textAlign="center" fontWeight="semibold" style={styles.editButton}>
            &#60; Edit Information
          </Body>
        )}
      </Pressable>
      <Button
        title="Confirm Information"
        onPress={(): Promise<void> => handleSubmit()}
        disabled={isSubmitting}
        style={{
          marginTop: 20,
        }}
      />
      <Body style={{ color: error }}>{errorText}</Body>
    </Screen>
  );
}

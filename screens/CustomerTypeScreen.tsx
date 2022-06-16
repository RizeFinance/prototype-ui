import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Screen, Checkbox } from '../components';
import { Body, Heading3 } from '../components/Typography';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/Auth';
import { useComplianceWorkflow } from '../contexts';
import config from '../config/config';

interface CustomerTypeScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'ÇustomerType'>;
}

enum CustomerType {
  Individual = 'unaffiliated',
  SoleProprieter = 'sole_proprietor',
}

export default function SignupScreen({ navigation }: CustomerTypeScreenProps): JSX.Element {
  const { userName, createCustomer, updateCustomer } = useAuth();
  const { createComplianceWorkflow, evaluateCurrentStep } = useComplianceWorkflow();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [customerType, setCustomerType] = useState(null);
  const [buisness, setBuisness] = useState(null);

  const isBuisness = customerType === CustomerType.SoleProprieter;
  const isIndividual = customerType === CustomerType.Individual;

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      justifyContent: 'space-between',
    },
    subCopy: {
      marginTop: 40,
      marginBottom: 20,
    },
    topContent: {
      justifyContent: 'space-between',
    },
  });

  useEffect(() => {
    if (!userName) navigation.navigate('Login');
  }, []);

  const onSubmit = async (): Promise<void> => {
    if (!userName || !customerType) return;
    setLoading(true);
    try {
      const newCustomer = await createCustomer(userName, customerType);
      if (isBuisness && buisness) {
        await updateCustomer(newCustomer.email, { business_name: buisness });
      }

      await createComplianceWorkflow(config.application.defaultProductUid);
      await evaluateCurrentStep();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const isValid = (isBuisness && buisness) || isIndividual;
    setDisabled(!isValid);
  }, [isBuisness, isIndividual, buisness]);

  return (
    <Screen style={styles.container}>
      <View>
        <Heading3 textAlign="center">Account Type</Heading3>
        <Body style={styles.subCopy}>I am signing up for an account as a:</Body>
        <Checkbox
          checked={isIndividual}
          onChange={(checked): void => setCustomerType(checked ? CustomerType.Individual : null)}
        >
          <Body>Individual</Body>
        </Checkbox>
        <Checkbox
          checked={isBuisness}
          onChange={(checked): void =>
            setCustomerType(checked ? CustomerType.SoleProprieter : null)
          }
        >
          <Body>Sole Proprietor</Body>
        </Checkbox>
        {isBuisness && (
          <Input
            label="Buisness Name"
            placeholder="Buisness Name"
            defaultValue={buisness}
            onChangeText={(value: string) => setBuisness(value?.trim())}
          />
        )}
      </View>
      <Button
        title="Continue"
        onPress={onSubmit}
        disabled={disabled}
        loading={loading}
        style={{
          marginTop: 20,
        }}
      />
    </Screen>
  );
}

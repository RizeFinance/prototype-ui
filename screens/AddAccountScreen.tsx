import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import { View, StyleSheet } from 'react-native';
import { Screen, Input, Dropdown, Button } from '../components';
import { Body } from '../components/Typography';
import { RootStackParamList } from '../types';
import * as Yup from 'yup';
import AccountService from '../services/AccountService';
import { useAuth } from '../contexts/Auth';
import { useAccounts } from '../contexts/Accounts';
import { capitalize } from 'lodash';

interface AddAccountScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'AddAccount'>;
}

type AddAccountFields = {
  accountName: string;
  accountType: string;
};

export default function AddAccountScreen({ navigation }: AddAccountScreenProps): JSX.Element {
  const styles = StyleSheet.create({
    errorMessage: {
      color: 'rgb(211, 71, 93)',
      fontSize: 14,
      fontWeight: 'bold',
      marginLeft: '8px',
    },
  });
  const [errorMessage, setErrorMessage] = useState<string>();
  const { liabilityAccounts, accountTypes } = useAccounts();
  const { accessToken } = useAuth();
  const placeholderText = 'Select Type Of Account';
  const createAccount = async (name, syntheticAccountTypeUid) => {
    const poolUid = liabilityAccounts[0].pool_uid;

    await AccountService.createSyntheticAccount({
      accessToken,
      name,
      syntheticAccountTypeUid,
      poolUid,
    });
    navigation.navigate('Accounts');
  };

  const types = accountTypes.map((type) => {
    return { label: capitalize(type.name), value: type.uid };
  });
  const initialValues: AddAccountFields = {
    accountName: '',
    accountType: '',
  };

  const addAccountValidationSchema = Yup.object().shape({
    accountName: Yup.string().required('Account name is required.'),
    accountType: Yup.string().required('Account type is required.'),
  });

  const onSubmit = async (values: AddAccountFields): Promise<void> => {
    if (values.accountType === placeholderText) {
      setErrorMessage('Select an account type.');
    } else {
      setErrorMessage('');
      createAccount(values.accountName, values.accountType);
    }
  };

  return (
    <Screen withoutHeader>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={addAccountValidationSchema}
      >
        {({ handleChange, handleSubmit, dirty, isValid, isSubmitting, values }) => (
          <View>
            <Dropdown
              label="Type Of Account"
              placeholder={placeholderText}
              items={types}
              onChange={handleChange('accountType')}
            />
            {errorMessage && <Body style={styles.errorMessage}>{errorMessage}</Body>}
            <Input
              label="Name Your New Account"
              value={values.accountName}
              onChangeText={handleChange('accountName')}
            />
            <Button
              title="Submit"
              onPress={() => handleSubmit()}
              disabled={!dirty || !isValid || isSubmitting}
            />
          </View>
        )}
      </Formik>
    </Screen>
  );
}

import { Formik, useFormikContext, Field } from 'formik';
import React, { useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Button, DatePickerInput, Input, Screen, Dropdown, MaskedInput } from '../components';
import { Heading3 } from '../components/Typography';
import * as Yup from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';
import { PIIFields, RootStackParamList } from '../types';
import moment from 'moment';
import states from '../constants/States';
import { useAuth } from '../contexts/Auth';
import formatStringByPattern from 'format-string-by-pattern';

function FetchPreviousValues({ navigation }: PIIScreenProps): JSX.Element {
  const { refreshCustomer } = useAuth();

  const { setFieldValue } = useFormikContext<PIIScreenFields>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const updatedCustomer = await refreshCustomer();

      if (updatedCustomer && updatedCustomer?.details?.first_name) {
        const details = updatedCustomer.details;

        setFieldValue('first_name', details.first_name ?? '');
        setFieldValue('middle_name', details.middle_name ?? '');
        setFieldValue('last_name', details.last_name ?? '');
        setFieldValue('suffix', details.suffix ?? '');
        setFieldValue('dob', details.dob ? new Date(details.dob) : undefined);
        setFieldValue('street1', details.address.street1 ?? '');
        setFieldValue('street2', details.address.street2 ?? '');
        setFieldValue('city', details.address.city ?? '');
        setFieldValue('state', details.address.state ?? '');
        setFieldValue('postal_code', details.address.postal_code ?? '');
        setFieldValue(
          'phone',
          details.phone ? formatStringByPattern('(999) 999-9999', details.phone) : ''
        );
      }
    });

    return unsubscribe;
  }, [navigation]);

  return <></>;
}

interface PIIScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'PII'>;
}

type PIIScreenFields = Omit<PIIFields, 'dob'> & {
  dob?: Date;
};

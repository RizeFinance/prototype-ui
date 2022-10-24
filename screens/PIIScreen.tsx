import { Formik, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { Button, DatePickerInput, Input, Screen, Dropdown } from '../components';
import { Heading3, Body } from '../components/Typography';
import * as Yup from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';
import { PIIFields, RootStackParamList } from '../types';
import IMask from 'imask';
import { parse, isDate } from 'date-fns';
import states from '../constants/States';
import { useAuth } from '../contexts/Auth';
import formatStringByPattern from 'format-string-by-pattern';
import { set } from 'lodash';
interface PIIScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'PII'>;
}

function parseDateString(value, originalValue) {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, 'MM-dd-yyyy', new Date());
  return parsedDate;
}

function FetchPreviousValues({ navigation }: PIIScreenProps): JSX.Element {
  const { refreshCustomer } = useAuth();
  const { setFieldValue } = useFormikContext<PIIFields>();

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

export default function PIIScreen({ navigation }: PIIScreenProps): JSX.Element {
  const { customer } = useAuth();
  const [cursor, setCursor] = useState(0);
  const [textLen, setTextLen] = useState(0);
  const styles = StyleSheet.create({
    heading: {
      marginBottom: 10,
    },
    formGroup: {
      marginVertical: 10,
    },
    submitButton: {
      marginTop: 30,
    },
  });

  const initialValues: PIIFields = {
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    dob: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    postal_code: '',
    phone: '',
    ssn: '',
  };

  const maxDob = new Date();
  maxDob.setFullYear(maxDob.getFullYear() - 18);
  const minDob = new Date();
  minDob.setFullYear(minDob.getFullYear() - 130);
  const initSchema = {
    first_name: Yup.string().required('First Name is required.'),
    last_name: Yup.string().required('Last Name is required.'),
    suffix: Yup.string().max(30, 'Invalid Suffix'),
    dob: Yup.date()
      .transform(parseDateString)
      .required('Date of Birth is required.')
      .min(minDob, 'You must enter a valid Date of Birth')
      .max(maxDob, 'You should be at least 18 years old.')
      .typeError('You must enter a valid Date of Birth'),
    street1: Yup.string().required('Address is required.'),
    city: Yup.string().required('City is required.'),
    state: Yup.string().required('State is required.'),
    postal_code: Yup.string()
      .required('Zip Code is required.')
      .min(5, 'Invalid Zip Code.')
      .max(5, 'Invalid Zip Code.')
      .matches(/^\d+$/, 'Invalid Zip Code.'),
    phone: Yup.string()
      .required('Phone Number is required.')
      .max(14, 'Invalid Phone Number.')
      .matches(/\(\d{3}\) \d{3}-\d{4}/, 'Invalid Phone Number.'),
    ssn: Yup.string()
      .required('SSN is required.')
      .max(11, 'Invalid Social Security Number.')
      .matches(/\d{3}-\d{2}-\d{4}/, 'Invalid Social Security Number.'),
  };

  if (customer.type === 'sole_proprietor') {
    set(initSchema, 'business_name', Yup.string().required('Business Name is required.'));
  }

  const piiSchema = Yup.object().shape(initSchema);

  const onSubmit = async (values: PIIFields): Promise<void> => {
    navigation.navigate('ConfirmPII', {
      fieldValues: {
        ...values,
      },
    });
  };

  return (
    <Screen useScrollView>
      <Heading3 textAlign="center" style={styles.heading}>
        Enter Your Personal Information
      </Heading3>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={piiSchema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
          values,
          errors,
          isValid,
          isSubmitting,
          dirty,
          touched,
        }) => (
          <>
            <FetchPreviousValues navigation={navigation} />
            <View style={styles.formGroup}>
              {customer.type === 'sole_proprietor' && (
                <Input
                  label="Business Name"
                  placeholder="Business Name"
                  onChangeText={handleChange('business_name')}
                  onBlur={handleBlur('business_name')}
                  value={values.business_name}
                  errorText={!touched.business_name ? '' : errors.business_name}
                  editable={!isSubmitting}
                />
              )}
              <Body>&nbsp;</Body>
              <Input
                label="First Name"
                placeholder="First Name"
                onChangeText={handleChange('first_name')}
                onBlur={handleBlur('first_name')}
                value={values.first_name}
                errorText={!touched.first_name ? '' : errors.first_name}
                editable={!isSubmitting}
              />
              <Input
                label="Middle Name (optional)"
                placeholder="Middle Name"
                onChangeText={handleChange('middle_name')}
                onBlur={handleBlur('middle_name')}
                value={values.middle_name}
                errorText={!touched.middle_name ? '' : errors.middle_name}
                editable={!isSubmitting}
              />
              <Input
                label="Last Name"
                placeholder="Last Name"
                onChangeText={handleChange('last_name')}
                onBlur={handleBlur('last_name')}
                value={values.last_name}
                errorText={!touched.last_name ? '' : errors.last_name}
                editable={!isSubmitting}
              />
              <Input
                label="Suffix (optional)"
                placeholder="Suffix"
                onChangeText={handleChange('suffix')}
                onBlur={handleBlur('suffix')}
                value={values.suffix}
                errorText={!touched.suffix ? '' : errors.suffix}
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.formGroup}>
              {Platform.OS === 'web' ? (
                <>
                  <Input
                    label="Date of Birth"
                    placeholder="MM-DD-YYYY"
                    onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
                      const masked = IMask.createMask({
                        mask: '00-00-0000',
                        lazy: true,
                        overwrite: true,
                      });
                      const value = masked.resolve(e.target.value);

                      //deleting a character
                      if (textLen > value.length) {
                        setCursor((prevState) => {
                          return prevState;
                        });
                        // moved the cursor and adding characters
                      } else if (cursor !== textLen) {
                        setCursor((prevState) => {
                          return prevState + 1;
                        });
                      } else {
                        setCursor(value.length);
                      }
                      setTextLen(value.length);
                      setFieldValue('dob', value);
                    }}
                    selection={{ start: cursor, end: cursor }}
                    onSelectionChange={(
                      e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
                    ) => {
                      setCursor(e.target.selectionStart);
                    }}
                    onBlur={handleBlur('dob')}
                    value={values.dob}
                    errorText={(!touched.dob as boolean) ? '' : (errors.dob as string)}
                    editable={!isSubmitting}
                  />
                </>
              ) : (
                <DatePickerInput
                  label="Date of Birth"
                  placeholder="Month/Date/Year"
                  errorText={(!touched.dob as boolean) ? '' : (errors.dob as string)}
                  value={values.dob}
                  onChange={(date: Date) => {
                    setFieldValue('dob', date);
                    setFieldTouched('dob', true, false);
                  }}
                />
              )}
            </View>

            <View style={styles.formGroup}>
              <Input
                label="Physical Address"
                placeholder="Address"
                onChangeText={handleChange('street1')}
                onBlur={handleBlur('street1')}
                value={values.street1}
                errorText={!touched.street1 ? '' : errors.street1}
                editable={!isSubmitting}
              />
              <Input
                placeholder="Apt, Unit, ETC"
                onChangeText={handleChange('street2')}
                onBlur={handleBlur('street2')}
                value={values.street2}
                errorText={!touched.street2 ? '' : errors.street2}
                editable={!isSubmitting}
              />
              <Input
                placeholder="City"
                onChangeText={handleChange('city')}
                onBlur={handleBlur('city')}
                value={values.city}
                errorText={!touched.city ? '' : errors.city}
                editable={!isSubmitting}
              />
              <Dropdown
                items={states}
                value={values.state}
                placeholder="State"
                onChange={handleChange('state')}
                inputStyle={{ fontSize: 16 }}
              />
              <Input
                placeholder="Zip Code"
                onChangeText={handleChange('postal_code')}
                onBlur={handleBlur('postal_code')}
                value={values.postal_code}
                errorText={!touched.postal_code ? '' : errors.postal_code}
                editable={!isSubmitting}
                maxLength={5}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Input
                label="Phone Number"
                placeholder="(xxx) xxx-xxxx"
                onChangeText={(e) => {
                  const value = formatStringByPattern('(999) 999-9999', e);
                  setFieldValue('phone', value);
                }}
                multiline={true}
                onBlur={handleBlur('phone')}
                value={values.phone}
                errorText={!touched.phone ? '' : errors.phone}
                editable={!isSubmitting}
                maxLength={14}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Input
                label="Social Security Number"
                placeholder="xxx-xx-xxxx"
                onChangeText={(e) => {
                  const value = formatStringByPattern('999-99-9999', e);
                  setFieldValue('ssn', value);
                }}
                multiline={true}
                onBlur={handleBlur('ssn')}
                value={values.ssn}
                errorText={!touched.ssn ? '' : errors.ssn}
                editable={!isSubmitting}
                maxLength={11}
                keyboardType="number-pad"
              />
            </View>

            <Button
              title="Submit Information"
              disabled={!dirty || !isValid || isSubmitting}
              onPress={(): void => handleSubmit()}
              style={styles.submitButton}
            />
          </>
        )}
      </Formik>
    </Screen>
  );
}

import React, { useState } from 'react';
import { useFormik } from 'formik';
import { StyleSheet, View, Platform } from 'react-native';
import {
  Button,
  DatePickerInput,
  Input,
  Dropdown,
  Heading3,
  ConfirmationInfo,
} from '../../../components';
import * as Yup from 'yup';
import states from '../../../constants/States';
import formatStringByPattern from 'format-string-by-pattern';
import { isEmpty, isEqual } from 'lodash';

interface IPIIForm {
  handleFormSubmit: (values: CustomerDetails) => void;
  customer: CustomerDetails | NewCustomerDetails;
}

export interface CustomerDetails {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  phone: string;
  ssn: string;
  dob: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  postal_code: string;
}

export type NewCustomerDetails = Exclude<CustomerDetails, 'ssn_last_four'> & { ssn: string };

const PIIForm = ({ handleFormSubmit, customer }: IPIIForm) => {
  const [showConfirm, setShowConfirm] = useState(() => !isEmpty(customer.last_name));

  const initValues = {
    first_name: isEmpty(customer.first_name) ? '' : customer.first_name,
    middle_name: isEmpty(customer.middle_name) ? '' : customer.middle_name,
    last_name: isEmpty(customer.last_name) ? '' : customer.last_name,
    suffix: isEmpty(customer.suffix) ? '' : customer.suffix,
    dob: isEmpty(customer.dob) ? '' : customer.dob,
    street1: isEmpty(customer.street1) ? '' : customer.street1,
    street2: isEmpty(customer.street2) ? '' : customer.street2,
    city: isEmpty(customer.city) ? '' : customer.city,
    state: isEmpty(customer.state) ? '' : customer.state,
    postal_code: isEmpty(customer.postal_code) ? '' : customer.postal_code,
    phone: isEmpty(customer.phone) ? '' : formatStringByPattern('(999) 999-9999', customer.phone),
    ssn: '',
  };

  // const { ssn, ...valuesToUpdate } = initValues;

  // const updatedValues = { ...valuesToUpdate, ssn_last_four: `***-**-${customer.ssn_last_four}` };

  const formik = useFormik({
    initialValues: initValues,
    onSubmit: (values) => handleFormSubmit(values),
    validationSchema: isEmpty(customer.last_name) ? piiSchema : editableInfoSchema,
  });

  const {
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    values,
    errors,
    isValid,
    isSubmitting,
    dirty,
    touched,
    initialValues,
    handleSubmit,
  } = formik;

  const hasBeenUpdated = !isEqual(initialValues, values);

  return (
    <>
      {!showConfirm && (
        <Heading3 textAlign="center" style={styles.heading}>
          {isEmpty(customer.last_name)
            ? 'Enter Your Personal Information'
            : 'Update Your Personal Information'}
        </Heading3>
      )}
      <>
        {showConfirm ? (
          <ConfirmationInfo
            customerInfo={values}
            setShowConfirm={setShowConfirm}
            hasBeenUpdated={hasBeenUpdated}
            handleSubmit={handleSubmit}
          />
        ) : (
          <>
            <View style={styles.formGroup}>
              <Input
                label="First Name"
                placeholder={'First Name'}
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
                <Input
                  label="Date of Birth"
                  placeholder="MM/DD/YYYY"
                  onChangeText={(e) => {
                    const value = formatStringByPattern('MM/DD/YYYY', e);
                    setFieldValue('dob', value);
                  }}
                  onBlur={handleBlur('dob')}
                  value={values.dob}
                  errorText={(!touched.dob as boolean) ? '' : (errors.dob as string)}
                  editable={!isSubmitting}
                />
              ) : (
                <DatePickerInput
                  label="Date of Birth"
                  placeholder="Month/Date/Year"
                  errorText={(!touched.dob as boolean) ? '' : (errors.dob as string)}
                  value={values.dob}
                  disabled={!isSubmitting}
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
                onChangeText={(text) => {
                  const value = formatStringByPattern('(999) 999-9999', text);
                  setFieldValue('phone', value);
                }}
                multiline={true}
                onBlur={handleBlur('phone')}
                value={formatStringByPattern('(999) 999-9999', values.phone)}
                errorText={!touched.phone ? '' : errors.phone}
                editable={!isSubmitting}
                maxLength={14}
                keyboardType="number-pad"
              />
            </View>

            {!customer.dob && (
              <View style={styles.formGroup}>
                <Input
                  label="Social Security Number"
                  placeholder="xxx-xx-xxxx"
                  onChangeText={(e) => {
                    const value = formatStringByPattern('999-99-9999', e);
                    setFieldValue('ssn', value);
                  }}
                  onBlur={handleBlur('ssn')}
                  value={values.ssn}
                  errorText={!touched.ssn ? '' : errors.ssn}
                  editable={!isSubmitting}
                  maxLength={11}
                  autoCapitalize={'none'}
                />
              </View>
            )}
            <Button
              style={{ marginTop: 30 }}
              title="Submit Information"
              disabled={!dirty || !isValid || isSubmitting}
              onPress={() => setShowConfirm(true)}
            />
          </>
        )}
      </>
    </>
  );
};

export default PIIForm;

const maxDob = new Date();
maxDob.setFullYear(maxDob.getFullYear() - 18);

const editableInfoSchema = Yup.object().shape({
  first_name: Yup.string().required('First Name is required.'),
  last_name: Yup.string().required('Last Name is required.'),
  middle_name: Yup.string(),
  suffix: Yup.string(),
  phone: Yup.string()
    .required('Phone Number is required.')
    .max(14, 'Invalid Phone Number.')
    .matches(/\(\d{3}\) \d{3}-\d{4}/, 'Invalid Phone Number.'),
  street1: Yup.string().required('Address is required.'),
  city: Yup.string().required('City is required.'),
  state: Yup.string().required('State is required.'),
  postal_code: Yup.string()
    .required('Zip Code is required.')
    .min(5, 'Invalid Zip Code.')
    .max(5, 'Invalid Zip Code.')
    .matches(/^\d+$/, 'Invalid Zip Code.'),
});

const piiSchema = editableInfoSchema.shape({
  dob: Yup.date()
    .required('Date of Birth is required.')
    .max(maxDob, 'You should be at least 18 years old.')
    .typeError('You must enter a valid Date of Birth'),
  ssn: Yup.string()
    .required('SSN is required.')
    .max(11, 'Invalid Social Security Number.')
    .matches(/[0-9]{3}-[0-9]{2}-[0-9]{4}/, 'Invalid Social Security Number.'),
});

const styles = StyleSheet.create({
  heading: {
    marginBottom: 10,
  },
  formGroup: {
    marginVertical: 10,
  },
});

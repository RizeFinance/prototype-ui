import React, { useState, useRef } from 'react';
import { Formik } from 'formik';
import { StyleSheet, View, Platform } from 'react-native';
import {
  Button,
  DatePickerInput,
  Input,
  Screen,
  Dropdown,
  Body,
  MaskedInput,
  Heading3,
  TextLink,
} from '../../components';
import * as Yup from 'yup';
import { PIIFields, RootStackParamList } from '../../types';
import states from '../../constants/States';
import { ProductType } from '../../contexts';
import formatStringByPattern from 'format-string-by-pattern';
import { defaultColors } from '../../constants/Colors';
import { CustomerService } from '../../services';
import MaskInput, { createNumberMask, formatWithMask, Mask } from 'react-native-mask-input';
import { isEmpty } from 'lodash';
import ConfirmationInfo from './ConfirmationInfo';

interface IPIIForm {
  handleSubmit: any;
  customer: any;
  isLoading?: boolean;
}

const PIIForm = ({ handleSubmit, customer, isLoading }: IPIIForm) => {
  const [inEditMode, setInEditMode] = useState(false)

  const initialValues = {
    first_name: isEmpty(customer.first_name) ? '' : customer.first_name,
    middle_name: isEmpty(customer.first_name) ? '' : customer.middle_name,
    last_name: isEmpty(customer.last_name) ? '' : customer.last_name,
    suffix: isEmpty(customer.suffix) ? '' : customer.suffix,
    dob: undefined,
    street1: isEmpty(customer.street1) ? '' : customer.street1,
    street2: isEmpty(customer.street2) ? '' : customer.street2,
    city: isEmpty(customer.city) ? '' : customer.city,
    state: isEmpty(customer.state) ? '' : customer.state,
    postal_code: isEmpty(customer.postal_code) ? '' : customer.postal_code,
    phone: isEmpty(customer.phone) ? '' : customer.phone,
    ssn: '',
  };

  if (!isEmpty(customer.last_name) && !inEditMode) {
    return <ConfirmationInfo customerInfo={customer} setInEditMode={setInEditMode}  />;
  }


  return (
    <>
      <Heading3 textAlign="center" style={styles.heading}>
        {inEditMode && 'Update Your Personal Information'}
        {!isEmpty(customer.last_name) ? 'Confirm Your Personal Information' : 'Enter Your Personal Information'}
      </Heading3>

      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={inEditMode ? editableInfoSchema : piiSchema}>
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
        }) => {
          return (
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
                        editable={!inEditMode || isSubmitting && !isSubmitting}
                      />
                    ) : (
                      <DatePickerInput
                        label="Date of Birth"
                        placeholder="Month/Date/Year"
                        errorText={(!touched.dob as boolean) ? '' : (errors.dob as string)}
                        value={values.dob}
                        disabled={!inEditMode || isSubmitting && !isSubmitting}
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

                  <View style={styles.formGroup}>
                    <Input
                      label="Social Security Number"
                      placeholder="xxx-xx-xxxx"
                      onChangeText={(e) => {
                        const value = formatStringByPattern('999-99-9999', e);
                        setFieldValue('ssn', value);
                      }}
                      // multiline={true}
                      onBlur={handleBlur('ssn')}
                      value={values.ssn}
                      errorText={!touched.ssn ? '' : errors.ssn}
                      editable={!inEditMode || isSubmitting && !isSubmitting}
                      maxLength={11}
                      autoCapitalize={'none'}
                    />
                  </View>
            </>
          );
        }}
      </Formik>
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
})

const piiSchema = editableInfoSchema.shape({
  dob: Yup.date()
    .required('Date of Birth is required.')
    .max(maxDob, 'You should be at least 18 years old.')
    .typeError('You must enter a valid Date of Birth'),
  ssn: Yup.string()
    .required('SSN is required.')
    .max(11, 'Invalid Social Security Number.')
    .matches(/[A-Za-z0-9]{3}-[A-Za-z0-9]{2}-[A-Za-z0-9]{4}/, 'Invalid Social Security Number.')
});

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
  editButton: {
    textDecorationLine: 'underline',
    textDecorationColor: defaultColors.primary,
    color: defaultColors.primary,
    marginTop: 20,
  },
  content: {
    paddingHorizontal: 16,
    marginBottom: 25,
    flex: 2,
  },
  title: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 25,
  },
});

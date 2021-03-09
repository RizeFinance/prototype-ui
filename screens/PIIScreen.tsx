import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, DatePickerInput, Dropdown, Input, Screen } from '../components';
import { Heading3 } from '../components/Typography';
import states from '../constants/States';
import * as Yup from 'yup';
import StringMask from 'string-mask';
import utils from '../utils/utils';
import { StackNavigationProp } from '@react-navigation/stack';
import { PIIFields, RootStackParamList } from '../types';
import moment from 'moment';

interface PIIScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'PII'>;
}

type PIIScreenFields = Omit<PIIFields, 'dob'> & {
    dob?: Date;
}

export default function PIIScreen({ navigation }: PIIScreenProps): JSX.Element {
    const styles = StyleSheet.create({
        formGroup: {
            marginVertical: 10
        }
    });

    const initialValues: PIIScreenFields = {
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        dob: undefined,
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        ssn: '',
    };

    const maxDob = new Date();
    maxDob.setFullYear(maxDob.getFullYear() - 18);

    const piiSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required.'),
        lastName: Yup.string().required('Last Name is required.'),
        dob: Yup.date()
            .required('Date of Birth is required.')
            .max(maxDob, 'You should be at least 18 years old.'),
        address1: Yup.string().required('Address is required.'),
        city: Yup.string().required('City is required.'),
        state: Yup.string().required('State is required.'),
        zip: Yup.string()
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
            .matches(/[A-Za-z0-9]{3}-[A-Za-z0-9]{2}-[A-Za-z0-9]{4}/, 'Invalid Social Security Number.')
    });

    const phoneFormatter = new StringMask('(000) 000-0000');
    const ssnFormatter = new StringMask('AAA-AA-AAAA');

    const onSubmit = async (values: PIIScreenFields): Promise<void> => {
        navigation.navigate('ConfirmPII', {
            fieldValues: {
                ...values,
                dob: moment(values.dob).format('yyyy-MM-DD')
            }
        });
    };

    return (
        <Screen useScrollView>
            <Heading3 textAlign='center'>
                Enter Your Personal Information
            </Heading3>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={piiSchema}
            >
                {({ handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, values, errors, isValid, isSubmitting, dirty, touched }) => (
                    <>
                        <View style={styles.formGroup}>
                            <Input
                                label='First Name'
                                placeholder='First Name'
                                onChangeText={handleChange('firstName')}
                                onBlur={handleBlur('firstName')}
                                value={values.firstName}
                                errorText={!touched.firstName ? '' : errors.firstName}
                                editable={!isSubmitting}
                            />
                            <Input
                                label='Middle Name (optional)'
                                placeholder='Middle Name'
                                onChangeText={handleChange('middleName')}
                                onBlur={handleBlur('middleName')}
                                value={values.middleName}
                                errorText={!touched.middleName ? '' : errors.middleName}
                                editable={!isSubmitting}
                            />
                            <Input
                                label='Last Name'
                                placeholder='Last Name'
                                onChangeText={handleChange('lastName')}
                                onBlur={handleBlur('lastName')}
                                value={values.lastName}
                                errorText={!touched.lastName ? '' : errors.lastName}
                                editable={!isSubmitting}
                            />
                            <Input
                                label='Suffix (optional)'
                                placeholder='Suffix'
                                onChangeText={handleChange('suffix')}
                                onBlur={handleBlur('suffix')}
                                value={values.suffix}
                                errorText={!touched.suffix ? '' : errors.suffix}
                                editable={!isSubmitting}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <DatePickerInput
                                label='Date of Birth'
                                placeholder='Month/Date/Year'
                                errorText={!touched.dob as boolean ? '' : errors.dob as string}
                                onChange={(date: Date) => {
                                    setFieldValue('dob', date);
                                    setFieldTouched('dob', true, false);
                                }}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Input
                                label='Physical Address'
                                placeholder='Address'
                                onChangeText={handleChange('address1')}
                                onBlur={handleBlur('address1')}
                                value={values.address1}
                                errorText={!touched.address1 ? '' : errors.address1}
                                editable={!isSubmitting}
                            />
                            <Input
                                placeholder='Apt, Unit, ETC'
                                onChangeText={handleChange('address2')}
                                onBlur={handleBlur('address2')}
                                value={values.address2}
                                errorText={!touched.address2 ? '' : errors.address2}
                                editable={!isSubmitting}
                            />
                            <Input
                                placeholder='City'
                                onChangeText={handleChange('city')}
                                onBlur={handleBlur('city')}
                                value={values.city}
                                errorText={!touched.city ? '' : errors.city}
                                editable={!isSubmitting}
                            />
                            <Dropdown
                                placeholder='State'
                                items={states.map(x => ({
                                    label: x.name,
                                    value: x.code
                                }))}
                                onChange={(value) => {
                                    setFieldValue('state', value ?? '');
                                    setFieldTouched('state', true, false);
                                }}
                                errorText={!touched.state ? '' : errors.state}
                            />
                            <Input
                                placeholder='Zip Code'
                                onChangeText={handleChange('zip')}
                                onBlur={handleBlur('zip')}
                                value={values.zip}
                                errorText={!touched.zip ? '' : errors.zip}
                                editable={!isSubmitting}
                                maxLength={5}
                                keyboardType='number-pad'
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Input
                                label='Phone Number'
                                placeholder='(xxx) xxx-xxxx'
                                onTextInput={(e) => {
                                    if (e.nativeEvent.text) {
                                        let value = `${e.nativeEvent.previousText}${e.nativeEvent.text}`;
                                        value = value.replace(/\D/g,'');
                                        value = phoneFormatter.apply(value);

                                        setFieldValue('phone', value);
                                    } else {
                                        const value = utils.replaceAt(
                                            e.nativeEvent.previousText,
                                            e.nativeEvent.range.start,
                                            e.nativeEvent.range.end,
                                            ''
                                        );
                            
                                        setFieldValue('phone', value);
                                    }
                                }}
                                onBlur={handleBlur('phone')}
                                value={values.phone}
                                errorText={!touched.phone ? '' : errors.phone}
                                editable={!isSubmitting}
                                maxLength={14}
                                keyboardType='number-pad'
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Input
                                label='Social Security Number'
                                placeholder='xxx-xx-xxxx'
                                onTextInput={(e) => {
                                    if (e.nativeEvent.text) {
                                        let value = `${e.nativeEvent.previousText}${e.nativeEvent.text}`;
                                        value = value.replace(/[^A-Za-z0-9]+/g,'');
                                        value = ssnFormatter.apply(value);

                                        setFieldValue('ssn', value);
                                    } else {
                                        const value = utils.replaceAt(
                                            e.nativeEvent.previousText,
                                            e.nativeEvent.range.start,
                                            e.nativeEvent.range.end,
                                            ''
                                        );
                            
                                        setFieldValue('ssn', value);
                                    }
                                }}
                                onBlur={handleBlur('ssn')}
                                value={values.ssn}
                                errorText={!touched.ssn ? '' : errors.ssn}
                                editable={!isSubmitting}
                                maxLength={11}
                                autoCapitalize={'none'}
                            />
                        </View>

                        <Button
                            title='Submit Information'
                            disabled={!dirty || !isValid || isSubmitting}
                            onPress={(): void => handleSubmit()}
                            style={{
                                marginTop: 30
                            }}
                        />
                    </>
                )}
            </Formik>
        </Screen>
    );
}


import { Formik } from 'formik';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dropdown, Input, Screen } from '../components';
import { Heading3 } from '../components/Typography';

type TransferFields = {
    fromSyntheticAccountUid: string;
    toSyntheticAccountUid: string;
    amount: string;
}

export default function InitTransferScreen(): JSX.Element {
    const styles = StyleSheet.create({
        heading: {
            marginTop: 24,
            marginBottom: 24,
        },
        formGroup: {
            marginVertical: 10,
        },
        inputs: {
            marginVertical: 8,
        },
        submitButton: {
            marginTop: 30,
        },
    });

    const initialValues: TransferFields = {
        fromSyntheticAccountUid: '',
        toSyntheticAccountUid: '',
        amount: '',
    };

    // eslint-disable-next-line
    const onSubmit = async (values: TransferFields): Promise<void> => {
        // TODO: Implementation
    };

    return (
        <Screen withoutHeader>
            <Heading3 textAlign='center' style={styles.heading}>
                Transfer
            </Heading3>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, values, errors, isValid, isSubmitting, dirty, touched }) => (
                    <>
                        <View style={styles.formGroup}>
                            <Dropdown
                                label='From'
                                placeholder='Select Account'
                                items={[]}
                                value={values.fromSyntheticAccountUid}
                                onChange={(value) => {
                                    setFieldValue('fromSyntheticAccountUid', value ?? '');
                                    setFieldTouched('fromSyntheticAccountUid', true, false);
                                }}
                                errorText={!touched.fromSyntheticAccountUid ? '' : errors.fromSyntheticAccountUid}
                                containerStyle={styles.inputs}
                            />
                            <Dropdown
                                label='To'
                                placeholder='Select Account'
                                items={[]}
                                value={values.toSyntheticAccountUid}
                                onChange={(value) => {
                                    setFieldValue('toSyntheticAccountUid', value ?? '');
                                    setFieldTouched('toSyntheticAccountUid', true, false);
                                }}
                                errorText={!touched.toSyntheticAccountUid ? '' : errors.toSyntheticAccountUid}
                                containerStyle={styles.inputs}
                            />
                            <Input
                                label='Amount'
                                placeholder='$0'
                                onChangeText={handleChange('amount')}
                                onBlur={handleBlur('amount')}
                                value={values.amount}
                                errorText={!touched.amount ? '' : errors.amount}
                                editable={!isSubmitting}
                                keyboardType='numeric'
                                containerStyle={styles.inputs}
                            />
                        </View>
                        <Button
                            title='Send Transfer'
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
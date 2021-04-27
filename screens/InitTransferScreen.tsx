import React, { useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import { View, StyleSheet } from 'react-native';
import { Button, Dropdown, DropdownItem, Input, Screen } from '../components';
import { Heading3 } from '../components/Typography';
import { useAccounts } from '../contexts/Accounts';
import { RootStackParamList } from '../types';
import * as Yup from 'yup';
import TransferService from '../services/TransferService';
import { useAuth } from '../contexts/Auth';

interface InitTransferScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'InitTransfer'>;
}

type TransferFields = {
    fromSyntheticAccountUid: string;
    toSyntheticAccountUid: string;
    amount: string;
}

export default function InitTransferScreen({ navigation }: InitTransferScreenProps): JSX.Element {
    const { accessToken } = useAuth();
    const { refetchAccounts, liabilityAccounts, externalAccounts } = useAccounts();
    const syntheticAccounts = [...liabilityAccounts, ...externalAccounts]
        .map(x => ({
            label: x.name,
            value: x.uid
        } as DropdownItem));

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

    const transferValidationSchema = Yup.object().shape({
        fromSyntheticAccountUid: Yup.string().required('Source account is required.'),
        toSyntheticAccountUid: Yup.string().required('Destination account is required.'),
        amount: Yup.number().required('Amount is required.')
            .typeError('Invalid amount.')
            .moreThan(0, 'Amount should be greater than 0.'),
    });

    const onSubmit = async (values: TransferFields): Promise<void> => {
        await TransferService.initiateTransfer(
            accessToken,
            values.fromSyntheticAccountUid,
            values.toSyntheticAccountUid,
            parseFloat(values.amount)
        );
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            await refetchAccounts();
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <Screen withoutHeader>
            <Heading3 textAlign='center' style={styles.heading}>
                Transfer
            </Heading3>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={transferValidationSchema}
            >
                {({ handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, values, errors, isValid, isSubmitting, dirty, touched }) => (
                    <>
                        <View style={styles.formGroup}>
                            <Dropdown
                                label='From'
                                placeholder='Select Account'
                                items={syntheticAccounts}
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
                                items={syntheticAccounts}
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
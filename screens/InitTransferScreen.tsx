import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik, FormikHelpers } from 'formik';
import { View, StyleSheet } from 'react-native';
import { Button, Dropdown, DropdownItem, Input, Screen } from '../components';
import { Body, Heading3 } from '../components/Typography';
import { useAccounts } from '../contexts/Accounts';
import { RootStackParamList } from '../types';
import * as Yup from 'yup';
import TransferService from '../services/TransferService';
import { useAuth } from '../contexts/Auth';
import utils from '../utils/utils';
import { SyntheticAccount } from '../models';
import Reference from 'yup/lib/Reference';

interface InitTransferScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'InitTransfer'>;
}

type TransferFields = {
    fromSyntheticAccountUid: string;
    toSyntheticAccountUid: string;
    amount: string;
}

declare module 'yup' {
    interface StringSchema {
        validSourceBalance(liabilityAccounts: SyntheticAccount[], message: string): StringSchema;
    }
    interface NumberSchema {
        amountWithinSourceBalance(sourceSyntheticAccountUidRef: Reference<string>, liabilityAccounts: SyntheticAccount[], message: string): NumberSchema;
    }
}

Yup.addMethod(Yup.string, 'validSourceBalance', function (liabilityAccounts: SyntheticAccount[], message: string) {
    return this.test('validSourceBalance', message, function (value) {
        const liabilityAccount = liabilityAccounts.find(x => x.uid === value);

        if (liabilityAccount && parseFloat(liabilityAccount.net_usd_available_balance) <= 0) {
            return false;
        }

        return true;
    });
});

Yup.addMethod(Yup.number, 'amountWithinSourceBalance', function (sourceSyntheticAccountUidRef: Reference<string>, liabilityAccounts: SyntheticAccount[], message: string) {
    return this.test('amountWithinSourceBalance', message, function (value) {
        const liabilityAccount = liabilityAccounts.find(x => x.uid === this.resolve(sourceSyntheticAccountUidRef));

        if (liabilityAccount && value > parseFloat(liabilityAccount.net_usd_available_balance)) {
            return false;
        }

        return true;
    });
});

export default function InitTransferScreen({ navigation }: InitTransferScreenProps): JSX.Element {
    const { accessToken } = useAuth();
    const { refetchAccounts, liabilityAccounts, externalAccounts } = useAccounts();
    const syntheticAccounts = [...liabilityAccounts, ...externalAccounts]
        .map(x => ({
            label: x.name + (['plaid_external', 'external'].includes(x.synthetic_account_category) ? '' : ` (${utils.formatCurrency(x.net_usd_available_balance)})`),
            value: x.uid
        } as DropdownItem));

    
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
    const [showFailedMessage, setShowFailedMessage] = useState<boolean>(false);

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
        connectStatusMessage: {
            marginVertical: 8,
        },
    });

    const initialValues: TransferFields = {
        fromSyntheticAccountUid: '',
        toSyntheticAccountUid: '',
        amount: '',
    };

    const transferValidationSchema = Yup.object().shape({
        fromSyntheticAccountUid: Yup.string().required('Source account is required.')
            .validSourceBalance(liabilityAccounts, 'Source account doesn\'t have enough balance.'),
        toSyntheticAccountUid: Yup.string().required('Destination account is required.')
            .not([Yup.ref('fromSyntheticAccountUid'), null], 'Source should not be the same as the destination.'),
        amount: Yup.number().required('Amount is required.')
            .typeError('Invalid amount.')
            .moreThan(0, 'Amount should be greater than 0.')
            .amountWithinSourceBalance(
                Yup.ref<string>('fromSyntheticAccountUid'),
                liabilityAccounts,
                'Amount should not be greater than the source account\'s balance.'
            ),
    });

    useEffect(() => {
        refetchAccounts();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            await refetchAccounts();
        });

        return unsubscribe;
    }, [navigation]);

    const onSubmit = async (values: TransferFields, actions: FormikHelpers<TransferFields>): Promise<void> => {
        setShowFailedMessage(false);
        setShowSuccessMessage(false);

        try {
            await TransferService.initiateTransfer(
                accessToken,
                values.fromSyntheticAccountUid,
                values.toSyntheticAccountUid,
                values.amount,
            );

            setShowSuccessMessage(true);
            actions.resetForm();
        } catch {
            setShowFailedMessage(true);
        } finally {
            refetchAccounts();
        }
    };

    return (
        <Screen withoutHeader>
            <Heading3 textAlign='center' style={styles.heading}>
                Transfer
            </Heading3>
            {showSuccessMessage && (
                <Body
                    color='success'
                    textAlign='center'
                    fontWeight='semibold'
                    style={styles.connectStatusMessage}
                >
                    Transfer Successful.
                </Body>
            )}
            {showFailedMessage && (
                <Body
                    color='error'
                    textAlign='center'
                    fontWeight='semibold'
                    style={styles.connectStatusMessage}
                >
                    Transfer failed.
                </Body>
            )}
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
                                    if (value) {
                                        setFieldValue('fromSyntheticAccountUid', value);
                                        setFieldTouched('fromSyntheticAccountUid', true, false);
                                    }
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
                                    if (value) {
                                        setFieldValue('toSyntheticAccountUid', value);
                                        setFieldTouched('toSyntheticAccountUid', true, false);
                                    }
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
import { Formik } from 'formik';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Screen } from '../components';
import { Body, Heading3 } from '../components/Typography';
import { useAccounts } from '../contexts/Accounts';
import { SyntheticAccount } from '../models';
import * as Yup from 'yup';
import { useAuth } from '../contexts/Auth';
import AccountService from '../services/AccountService';

type CreateExternalAccountFields = {
    checkingNumber: string;
    routingNumber: string;
}

const ExternalAccountScreen = (): JSX.Element => {
    const { externalAccounts, poolUids, refetchAccounts } = useAccounts();
    const { accessToken } = useAuth();
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
    const [showFailedMessage, setShowFailedMessage] = useState<boolean>(false);

    const styles = StyleSheet.create({
        heading: {
            marginTop: 24,
            marginBottom: 24,
        },
        detailsSection: {
            marginTop: 24,
        },
        row: {
            flexDirection: 'row',
        },
        col: {
            flex: 1,
        },
        contactSupport: {
            marginTop: 48,
        },
        formGroup: {
            marginVertical: 10,
        },
        submitButton: {
            marginTop: 30,
        },
        connectStatusMessage: {
            marginVertical: 8,
        },
    });

    const renderExternalAccountDetails = (externalAccount: SyntheticAccount): JSX.Element => {
        return (
            <View style={styles.detailsSection}>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Body fontWeight='semibold'>Checking Number</Body>
                        <Body>{externalAccount.account_number}</Body>
                    </View>
                    <View style={styles.col}>
                        <Body fontWeight='semibold'>Routing Number</Body>
                        <Body>{externalAccount.routing_number}</Body>
                    </View>
                </View>
                <View>
                    <Body textAlign='center' style={styles.contactSupport}>
                        Please contact customer support if you need to update your account.
                    </Body>
                </View>
            </View>
        );
    };

    const renderCreateExternalAccountForm = (): JSX.Element => {
        const initialValues: CreateExternalAccountFields = {
            checkingNumber: '',
            routingNumber: '',
        };

        const externalAccountValidationSchema = Yup.object().shape({
            checkingNumber: Yup.string().required('Checking Number is required.')
                .min(9, 'Routing Number should have 9 characters.')
                .max(9, 'Routing Number should have 9 numbers.')
                .matches(/^\d+$/, 'Invalid Checking Number.'),
            routingNumber: Yup.string().required('Routing Number is required.')
                .min(8, 'Routing Number should have at least 8 numbers.')
                .matches(/^\d+$/, 'Invalid Routing Number.'),
        });

        const onSubmit = async (values: CreateExternalAccountFields): Promise<void> => {
            setShowFailedMessage(false);

            try {
                // Get the synthetic account type
                const types = await AccountService.getSyntheticAccountTypes(accessToken);
                const externalType = types.data.find(x => x.synthetic_account_category === 'external');

                // Create the synthetic account
                await AccountService.createSyntheticAccount(accessToken,
                    externalType.uid,
                    poolUids[0],
                    'External Account',
                    values.checkingNumber,
                    values.routingNumber
                );

                await refetchAccounts();

                setShowSuccessMessage(true);
            } catch {
                setShowFailedMessage(true);
            }
        };

        return (
            <>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={externalAccountValidationSchema}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, isSubmitting, dirty, touched }) => (
                        <>
                            <View style={styles.formGroup}>
                                <Input
                                    label='Checking Number'
                                    onChangeText={handleChange('checkingNumber')}
                                    onBlur={handleBlur('checkingNumber')}
                                    value={values.checkingNumber}
                                    errorText={!touched.checkingNumber ? '' : errors.checkingNumber}
                                    editable={!isSubmitting}
                                    maxLength={9}
                                    keyboardType='number-pad'
                                />
                                <Input
                                    label='Routing Number'
                                    onChangeText={handleChange('routingNumber')}
                                    onBlur={handleBlur('routingNumber')}
                                    value={values.routingNumber}
                                    errorText={!touched.routingNumber ? '' : errors.routingNumber}
                                    editable={!isSubmitting}
                                    keyboardType='number-pad'
                                />
                            </View>
                            <Button
                                title='Connect Account'
                                disabled={!dirty || !isValid || isSubmitting}
                                onPress={(): void => handleSubmit()}
                                style={styles.submitButton}
                            />
                        </>
                    )}
                </Formik>
            </>
        );
    };

    return (
        <Screen withoutHeader>
            <Heading3 textAlign='center' style={styles.heading}>
                External Account
            </Heading3>
            {showSuccessMessage && (
                <Body
                    color='success'
                    textAlign='center'
                    fontWeight='semibold'
                    style={styles.connectStatusMessage}
                >
                    Account successfully connected.
                </Body>
            )}
            {showFailedMessage && (
                <Body
                    color='error'
                    textAlign='center'
                    fontWeight='semibold'
                    style={styles.connectStatusMessage}
                >
                    Account failed to connect.
                </Body>
            )}
            {externalAccounts && externalAccounts.length > 0 && (
                renderExternalAccountDetails(externalAccounts[0])
            )}
            {!externalAccounts || externalAccounts.length === 0 && (
                renderCreateExternalAccountForm()
            )}
        </Screen>
    );
};

export default ExternalAccountScreen;
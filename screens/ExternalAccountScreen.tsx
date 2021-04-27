import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Screen } from '../components';
import { Body, Heading3 } from '../components/Typography';
import { useAccounts } from '../contexts/Accounts';
import { SyntheticAccount } from '../models';

type CreateExternalAccountFields = {
    checkingNumber: string;
    routingNumber: string;
}

const ExternalAccountScreen = (): JSX.Element => {
    const { externalAccounts } = useAccounts();

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

        // eslint-disable-next-line
        const onSubmit = async (values: CreateExternalAccountFields): Promise<void> => {
            // TODO: Implementation
        };

        return (
            <>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
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
                                />
                                <Input
                                    label='Routing Number'
                                    onChangeText={handleChange('routingNumber')}
                                    onBlur={handleBlur('routingNumber')}
                                    value={values.routingNumber}
                                    errorText={!touched.routingNumber ? '' : errors.routingNumber}
                                    editable={!isSubmitting}
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
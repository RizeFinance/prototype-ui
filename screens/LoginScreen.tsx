import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import Screen from '../components/Screen';
import { Heading3 } from '../components/Typography';
import { Formik } from 'formik';
import validator from 'validator';
import { useCustomer } from '../contexts/Customer';
import RizeClient from '../utils/rizeClient';
import { ComplianceWorkflow } from '@rize/rize-js/types/lib/core/compliance-workflow';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

const logo = require('../assets/images/logo.png');

interface LoginFields {
    email: string;
}

interface LoginScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'Login'>;
}

export default function LoginScreen({ navigation }: LoginScreenProps): JSX.Element {
    const { setCustomer } = useCustomer();
    const rize = RizeClient.getInstance();

    const initialValues: LoginFields = {
        email: ''
    };

    const styles = StyleSheet.create({
        logo: {
            height: 200,
            width: 200,
            marginTop: -30,
            marginBottom: -10
        },
        inputContainer: {
            marginTop: 35,
            marginBottom: 30,
        }
    });

    const validateForm = (values: LoginFields): any => {
        const errors: any = {};

        if (validator.isEmpty(values.email, { ignore_whitespace: true })) {
            errors.email = 'Email is required.';
        }
        else if (!validator.isEmail(values.email)) {
            errors.email = 'Invalid email address.';
        }

        return errors;
    };

    const createNewComplianceWorkflow = async (email: string): Promise<void> => {
        const newComplianceWorkflow = await rize.complianceWorkflow.create(
            new Date().getTime().toString(),
            email
        );
        const customer = await rize.customer.get(newComplianceWorkflow.customer.uid);

        await setCustomer(customer);

        navigation.navigate('Disclosures');
    };

    const renewComplianceWorkflow = async (workflow: ComplianceWorkflow): Promise<void> => {
        const newComplianceWorkflow = await rize.complianceWorkflow.renew(
            new Date().getTime().toString(),
            workflow.customer.uid,
            workflow.customer.email
        );
        const customer = await rize.customer.get(newComplianceWorkflow.customer.uid);

        await setCustomer(customer);

        navigation.navigate('Disclosures');
    };

    const redirectToCurrentStep = async (workflow: ComplianceWorkflow): Promise<void> => {
        if (workflow.summary.current_step === 1) {
            navigation.navigate('Disclosures');
        } else if (workflow.summary.current_step === 2) {
            // check if Patriot Act is not yet acknowledged
            if (!workflow.accepted_documents.find(x => x.external_storage_name === 'usa_ptrt_0')) {
                navigation.navigate('PatriotAct');
            } else {
                const customer = await rize.customer.get(workflow.customer.uid);

                // check if there are no customer details yet
                if (!customer.details.first_name) {
                    navigation.navigate('PII');
                } else {
                    navigation.navigate('BankingDisclosures');
                }
            }
        }
    };

    const onSubmit = async (values: LoginFields): Promise<void> => {
        const existingCustomers = await rize.customer.getList({
            email: values.email,
            include_initiated: true
        });

        if (existingCustomers.count === 0) {
            await createNewComplianceWorkflow(values.email);
        } else {
            const customer = existingCustomers.data[0];
            
            switch (customer.status) {
                case 'initiated': {
                    // check for the latest workflow of the customer
                    const latestWorkflow = await rize.complianceWorkflow.viewLatest(customer.uid);

                    if (latestWorkflow.summary.status === 'expired') {
                        await renewComplianceWorkflow(latestWorkflow);
                    } else {
                        await redirectToCurrentStep(latestWorkflow);
                    }

                    break;
                }
                case 'queued':
                case 'identity_verified':
                    navigation.navigate('ProcessingApplication');
                    break;
                case 'active':
                    navigation.navigate('Result', { status: 'approved' });
                    break;
                case 'manual_review':
                    navigation.navigate('Result', { status: 'manual_review' });
                    break;
                case 'rejected':
                    navigation.navigate('Result', { status: 'rejected' });
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <Screen useScrollView>
            <View style={{
                alignSelf: 'center'
            }}>
                <Image
                    source={logo}
                    resizeMode='contain'
                    resizeMethod='resize'
                    style={styles.logo}
                />
            </View>
            <Heading3 textAlign='center'>Create Account</Heading3>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validate={validateForm}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, isSubmitting, dirty }) => (
                    <>
                        <Input
                            label='Email'
                            containerStyle={styles.inputContainer}
                            autoCapitalize={'none'}
                            keyboardType='email-address'
                            textContentType='emailAddress'
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            errorText={errors.email}
                            editable={!isSubmitting}
                        />
                        <Button
                            title='Submit'
                            disabled={!dirty || !isValid || isSubmitting}
                            onPress={(): void => handleSubmit()}
                        />
                    </>
                )}
            </Formik>
        </Screen>
    );
}
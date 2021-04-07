import * as React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Button, Input, Screen } from '../components';
import { Body, BodySmall, Heading3 } from '../components/Typography';
import { Formik } from 'formik';
import validator from 'validator';
import { useThemeColor } from '../components/Themed';
import { useCustomer } from '../contexts/Customer';
import RizeClient from '../utils/rizeClient';
import { useComplianceWorkflow } from '../contexts/ComplianceWorkflow';
import { RouteProp } from '@react-navigation/core';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

const logo = require('../assets/images/logo.png');

interface LoginScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'ForgotPassword'>;
    route: RouteProp<RootStackParamList, 'Login'>;
}

interface LoginFields {
    email: string;
}

export default function LoginScreen({ navigation, route }: LoginScreenProps): JSX.Element {
    const { setCustomer } = useCustomer();
    const { setComplianceWorkflow } = useComplianceWorkflow();

    const rize = RizeClient.getInstance();

    const initialValues: LoginFields = {
        email: ''
    };

    const primary = useThemeColor('primary');

    const styles = StyleSheet.create({
        logo: {
            height: 200,
            width: 200,
            marginTop: -30,
            marginBottom: -10
        },
        message: {
            marginTop: 4,
        },
        inputContainer: {
            marginTop: 35,
            marginBottom: 30,
        },
        forgotAccount: {
            textDecorationLine: 'underline',
            textDecorationColor: primary,
            color: primary,
            marginTop: 20
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

        await setComplianceWorkflow(newComplianceWorkflow);
        await setCustomer(customer);
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

            await setCustomer(customer);
        }
    };

    const onPressForgotPassword = (): void => {
        navigation.navigate('ForgotPassword');
    };

    return (
        <Screen
            useScrollView
            bounces={false}
        >
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
            {!!route.params?.message &&
                <BodySmall textAlign='center' style={styles.message}>{route.params.message}</BodySmall>
            }
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
                            onSubmitEditing={(): void => handleSubmit()}
                        />
                        <Button
                            title='Submit'
                            disabled={!dirty || !isValid || isSubmitting}
                            onPress={(): void => handleSubmit()}
                        />
                        <Pressable onPress={(): void => { onPressForgotPassword(); }} disabled={isSubmitting}>
                            <Body textAlign='center' fontWeight='semibold' style={styles.forgotAccount}>Forgot password</Body>
                        </Pressable>
                    </>
                )}
            </Formik>
        </Screen>
    );
}

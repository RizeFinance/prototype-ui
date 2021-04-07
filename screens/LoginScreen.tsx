import * as React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import validator from 'validator';

import { useAuth } from '../contexts/Auth';
import { Button, Input, Screen } from '../components';
import { Body, BodySmall, Heading3 } from '../components/Typography';
import { useCustomer } from '../contexts/Customer';
import RizeClient from '../utils/rizeClient';
import { useThemeColor } from '../components/Themed';
import { useComplianceWorkflow } from '../contexts/ComplianceWorkflow';
import { RouteProp } from '@react-navigation/core';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

const logo = require('../assets/images/logo.png');

interface LoginScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'Login'>;
    route: RouteProp<RootStackParamList, 'Login'>;
}

interface LoginFields {
    email: string;
    password: string;
}

export default function LoginScreen({ navigation, route }: LoginScreenProps): JSX.Element {
    const auth = useAuth();
    const { setCustomer } = useCustomer();
    
    const rize = RizeClient.getInstance();
    const primary = useThemeColor('primary');
    
    const initialValues: LoginFields = {
        email: '',
        password: ''
    };

    const styles = StyleSheet.create({
        logo: {
            height: 200,
            width: 200,
            marginTop: -30,
            marginBottom: -50
        },
        emailInput: {
            marginTop: 10,
            marginBottom: 10,
        },
        passwordInput: {
            marginTop: 10,
        },
        message: {
            marginTop: 4,
        },
        inputContainer: {
            marginTop: 35,
            marginBottom: 30,
        },
        underline: {
            marginTop: 10,
            textDecorationLine: 'underline',
            textDecorationColor: primary
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

        if (validator.isEmpty(values.password, { ignore_whitespace: true })) {
            errors.password = 'Password is required.';
        }

        return errors;
    };

    const onSubmit = async (values: LoginFields): Promise<void> => {
        try {
            await auth.login(values.email, values.password);

            const existingCustomers = await rize.customer.getList({
                email: values.email,
                include_initiated: true
            });
    
            const customer = existingCustomers.data[0];
            console.log('customer: ', customer);
            await setCustomer(customer);
        } catch (err) {
            console.log(err);
        }
    };

    const gotoSignupScreen = () => {
        navigation.navigate('Signup');
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
            <Heading3 textAlign='center'>Login</Heading3>
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
                            containerStyle={styles.emailInput}
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
                        <Input
                            label='Password'
                            containerStyle={styles.passwordInput}
                            textContentType='password'
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry
                            errorText={errors.password}
                            editable={!isSubmitting}
                            onSubmitEditing={(): void => handleSubmit()}
                        />
                        <Button
                            title='Login'
                            disabled={!dirty || !isValid || isSubmitting}
                            onPress={(): void => handleSubmit()}
                        />
                        <Pressable onPress={(): void => gotoSignupScreen()}>
                            <Body textAlign='center' style={styles.underline}>
                                I need to create an account
                            </Body>
                        </Pressable>
                    </>
                )}
            </Formik>
        </Screen>
    );
}
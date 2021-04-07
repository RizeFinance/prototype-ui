import * as React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import validator from 'validator';

import { useAuth } from '../contexts/Auth';
import { Button, Input, Screen } from '../components';
import { Body, BodySmall, Heading3 } from '../components/Typography';
import { useCustomer } from '../contexts/Customer';
import { useThemeColor } from '../components/Themed';
import CustomerService from '../services/CustomerService';
import { RouteProp } from '@react-navigation/core';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';

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
    const primary = useThemeColor('primary');
    const [commonError, setCommonError] = useState<string>('');
    
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
        message: {
            marginTop: 4,
        },
        commonError: {
            marginTop: 4,
            marginBottom: -20,
        },
        inputContainer: {
            marginTop: 35,
            marginBottom: 30,
        },
        underline: {
            marginTop: 20,
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
        setCommonError('');
        const authData = await auth.login(values.email, values.password);
        
        if(!authData.success) {
            setCommonError(authData.message);
            return;
        }

        const customerResponse = await CustomerService.getCustomer(authData.data.accessToken);

        const customer = customerResponse.data;

        const rizeCustomer = {
            ...customer,
            uid: customer.rize_uid,
            external_uid: customer.uid
        };
        delete rizeCustomer.rize_uid;

        await setCustomer(rizeCustomer);
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
            {!!commonError &&
                <BodySmall color='error' textAlign='center' style={styles.commonError}>{commonError}</BodySmall>
            }
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validate={validateForm}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, isSubmitting, dirty, touched }) => (
                    <>
                        <View style={styles.inputContainer}>
                            <Input
                                label='Email'
                                autoCapitalize={'none'}
                                keyboardType='email-address'
                                textContentType='emailAddress'
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                errorText={touched.email && errors.email}
                                editable={!isSubmitting}
                                onSubmitEditing={(): void => handleSubmit()}
                            />
                            <Input
                                label='Password'
                                textContentType='password'
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry
                                errorText={touched.password && errors.password}
                                editable={!isSubmitting}
                                onSubmitEditing={(): void => handleSubmit()}
                            />
                        </View>
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
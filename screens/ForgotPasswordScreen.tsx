import * as React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Button, Input, Screen } from '../components';
import { Body, BodySmall, Heading3 } from '../components/Typography';
import { Formik } from 'formik';
import validator from 'validator';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useThemeColor } from '../components/Themed';
import { useAuth } from '../contexts/Auth';

const logo = require('../assets/images/logo.png');

interface ForgotPasswordScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'PII'>;
}

interface ForgotPasswordFields {
    email: string;
}

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps): JSX.Element {
    const { forgotPassword } = useAuth();

    const initialValues: ForgotPasswordFields = {
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
        alreadyHaveAccount: {
            textDecorationLine: 'underline',
            textDecorationColor: primary,
            color: primary,
            marginTop: 20
        }
    });

    const validateForm = (values: ForgotPasswordFields): any => {
        const errors: any = {};

        if (validator.isEmpty(values.email, { ignore_whitespace: true })) {
            errors.email = 'Email is required.';
        }
        else if (!validator.isEmail(values.email)) {
            errors.email = 'Invalid email address.';
        }

        return errors;
    };

    const onPressAlreadyHaveAccount = (): void => {
        navigation.navigate('Login');
    };

    const onSubmit = async (values: ForgotPasswordFields): Promise<void> => {
        const result = await forgotPassword(values.email);
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
            <Heading3 textAlign='center'>Forgot Password</Heading3>

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
                            title='Request reset link'
                            disabled={!dirty || !isValid || isSubmitting}
                            onPress={(): void => handleSubmit()}
                        />
                        <Pressable onPress={(): void => { onPressAlreadyHaveAccount(); }} disabled={isSubmitting}>
                            <Body textAlign='center' fontWeight='semibold' style={styles.alreadyHaveAccount}>Back to Login</Body>
                        </Pressable>
                    </>
                )}
            </Formik>
        </Screen>
    );
}

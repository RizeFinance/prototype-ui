import * as React from 'react';
import { Image, StyleSheet, View} from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import Screen from '../components/Screen';
import { Heading3 } from '../components/Typography';

const logo = require('../assets/images/logo.png');

export default function LoginScreen(): JSX.Element {
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

    return (
        <Screen>
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
            <Input
                label='Email'
                containerStyle={styles.inputContainer}
            />
            <Button
                title='Create Account'
                disabled={true}
            />
        </Screen>
    );
}
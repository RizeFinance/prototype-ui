import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Screen, TextLink } from '../components';
import { Heading4 } from '../components/Typography';

import { RouteProp } from '@react-navigation/core';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useThemeColor } from '../components/Themed';
import { ScrollView } from 'react-native-gesture-handler';
const logo = require('../assets/images/logo.png');

interface MenuScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'Login'>;
    route: RouteProp<RootStackParamList, 'Login'>;
}

export default function MenuScreen({ navigation }: MenuScreenProps): JSX.Element {    

    const primary = useThemeColor('primary');
    
    const styles = StyleSheet.create({
        logo: {
            height: 200,
            width: 200,
            marginTop: -75,
            marginBottom: -25,
        },
        menuContainer: {
            marginVertical: 16,
            alignSelf: 'center'
        },
        menuStyle: {
            marginBottom: 8,
            color: primary
        },
    });

    const onPressAccounts = (): void => {
        navigation.navigate('Accounts');
    };

    const onPressExternalAccounts = (): void => {
        navigation.navigate('ExternalAccount');
    };

    const onPressLogout = (): void => {
        console.log('Logout the app.');  // eslint-disable-line
    };

    return (
        <Screen withoutHeader>
            <ScrollView 
                style={{ flex: 1 }}
                bounces={false}
            >
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={logo}
                        resizeMode='contain'
                        resizeMethod='resize'
                        style={styles.logo}
                    />
                </View>
                <TextLink
                    textAlign='center'
                    style={styles.menuStyle}
                    onPress={(): void => onPressAccounts()}
                    fontType={Heading4}
                >
                    Accounts
                </TextLink>
                <TextLink
                    textAlign='center'
                    style={styles.menuStyle}
                    onPress={(): void => onPressExternalAccounts()}
                    fontType={Heading4}
                >
                    External Account
                </TextLink>
            </ScrollView>
            <View style={[styles.menuContainer]}>
                <TextLink
                    textAlign='center'
                    style={styles.menuStyle}
                    onPress={(): void => onPressLogout()}
                    fontType={Heading4}
                >
                    LOG OUT
                </TextLink>
            </View>
        </Screen>
    );
}

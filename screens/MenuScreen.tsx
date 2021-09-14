import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Screen, TextLink } from '../components';
import { Heading4, Heading5 } from '../components/Typography';

import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuth } from '../contexts/Auth';
const logo = require('../assets/images/logo.png');

interface MenuScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'Menu'>;
}

export default function MenuScreen({ navigation }: MenuScreenProps): JSX.Element {    
    const {customer, ...auth} = useAuth();

    const styles = StyleSheet.create({
        logo: {
            height: 200,
            width: 200,
            marginTop: -60,
            marginBottom: -40,
            marginRight: -16
        },
        menuContainer: {
            marginVertical: 16,
            alignSelf: 'center'
        },
        menuStyle: {
            marginVertical: 16
        },
    });

    const onPressAccounts = (): void => {
        navigation.navigate('Accounts');
    };

    const onPressExternalAccounts = (): void => {
        navigation.navigate('ExternalAccount');
    };

    const onPressTransfer = (): void => {
        navigation.navigate('InitTransfer');
    };

    const onPressDebitCard = (): void => {
        navigation.navigate('DebitCard');
    };

    const onPressStatments = (): void => {
        navigation.navigate('Statements');
    };

    const onPressAgreements = (): void => {
        navigation.navigate('Agreements');
    };

    const onPressLogout = (): void => {
        auth.logout();
        navigation.goBack();
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
                    onPress={onPressAccounts}
                    fontType={Heading4}
                >
                    Accounts
                </TextLink>
                <TextLink
                    textAlign='center'
                    style={styles.menuStyle}
                    onPress={onPressExternalAccounts}
                    fontType={Heading4}
                >
                    External Account
                </TextLink>
                <TextLink
                    textAlign='center'
                    style={styles.menuStyle}
                    onPress={onPressTransfer}
                    fontType={Heading4}
                >
                    Transfer
                </TextLink>
                <TextLink
                    textAlign='center'
                    style={styles.menuStyle}
                    onPress={onPressDebitCard}
                    fontType={Heading4}
                >
                    Debit Card
                </TextLink>
                <TextLink
                    textAlign='center'
                    style={styles.menuStyle}
                    onPress={onPressStatments}
                    fontType={Heading4}
                >
                    Statements
                </TextLink>
                <TextLink
                    textAlign='center'
                    style={styles.menuStyle}
                    onPress={onPressAgreements}
                    fontType={Heading4}
                >
                    Agreements
                </TextLink>
            </ScrollView>
            <View style={[styles.menuContainer]}>
                <TextLink
                    textAlign='center'
                    style={styles.menuStyle}
                    onPress={onPressLogout}
                    fontType={Heading5}
                >
                    LOG OUT
                </TextLink>
            </View>
        </Screen>
    );
}

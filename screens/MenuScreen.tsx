import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Screen, TextLink } from '../components';
import { Heading4, Heading5 } from '../components/Typography';

import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import { useComplianceWorkflow } from '../contexts/ComplianceWorkflow';
import { useAuth } from '../contexts/Auth';
import { useCustomer } from '../contexts/Customer';
const logo = require('../assets/images/logo.png');

interface MenuScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'Menu'>;
}

export default function MenuScreen({ navigation }: MenuScreenProps): JSX.Element {    
    const auth = useAuth();
    const customer = useCustomer();
    const complianceWorkflow = useComplianceWorkflow();

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
            marginVertical: 12
        },
    });

    const onPressAccounts = (): void => {
        navigation.navigate('Accounts');
    };

    const onPressExternalAccounts = (): void => {
        navigation.navigate('ExternalAccount');
    };

    const onPressLogout = async (): Promise<void> => {
        auth.logout();
        customer.resetState();
        await customer.refreshCustomer();
        complianceWorkflow.resetState();
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
                    onPress={(): Promise<void> => onPressLogout()}
                    fontType={Heading5}
                >
                            LOG OUT
                </TextLink>
            </View>
        </Screen>
    );
}

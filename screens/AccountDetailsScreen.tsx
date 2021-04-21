import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screen, TextLink } from '../components';
import { Body, Heading3, Heading4 } from '../components/Typography';
import { RootStackParamList } from '../types';
import { useAccounts } from '../contexts/Accounts';
import { RouteProp } from '@react-navigation/core';
import utils from '../utils/utils';

interface AccountsScreenProps {
    route: RouteProp<RootStackParamList, 'AccountDetails'>;
    navigation: StackNavigationProp<RootStackParamList, 'AccountDetails'>;
}

export default function AccountsScreen({ navigation, route }: AccountsScreenProps): JSX.Element {
    const { liabilityAccounts, refetchAccounts } = useAccounts();
    
    const account = liabilityAccounts.find(x => x.uid === route.params?.accountUid);

    const styles = StyleSheet.create({
        heading: {
            marginTop: 24,
            marginBottom: 32,
        },
        row: {
            flexDirection: 'row',
        },
        column: {
            flex: 1,
        },
        columnHeader: {
            marginBottom: 4,
        }
    });

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TextLink onPress={() => navigation.goBack()}>
                    &lt; Accounts
                </TextLink>
            )
        });
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            await refetchAccounts();
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <Screen withoutHeader>
            <Heading3 textAlign='center' style={styles.heading}>
                {account?.name}
            </Heading3>
            <View style={styles.row}>
                <View style={styles.column}>
                    <Body fontWeight='bold' style={styles.columnHeader}>
                        Available Balance
                    </Body>
                    <Heading4 fontWeight='semibold'>
                        {utils.formatCurrency(account.net_usd_available_balance)}
                    </Heading4>
                </View>
                <View style={styles.column}>
                    <Body fontWeight='bold' style={styles.columnHeader}>
                        Current Balance
                    </Body>
                    <Heading4 fontWeight='semibold'>
                        {utils.formatCurrency(account.net_usd_balance)}
                    </Heading4>
                </View>
            </View>
        </Screen>
    );
}
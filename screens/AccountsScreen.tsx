import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screen } from '../components';
import { Body, Heading3, Heading4 } from '../components/Typography';
import { RootStackParamList } from '../types';
import { useAccounts } from '../contexts/Accounts';
import { SyntheticAccount } from '../models';
import TextLink from '../components/TextLink';
import utils from '../utils/utils';

interface AccountsScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'Accounts'>;
}

type AccountInfoProps = {
    account: SyntheticAccount;
};

export default function AccountsScreen({ navigation }: AccountsScreenProps): JSX.Element {
    const { liabilityAccounts, refetchAccounts } = useAccounts();

    const styles = StyleSheet.create({
        heading: {
            marginTop: 24,
            marginBottom: 24,
        },
        accountInfo: {
            marginVertical: 16,
        },
        accountName: {
            marginBottom: 8,
        }
    });

    const onPressAccountName = (account: SyntheticAccount): void => {
        navigation.navigate('AccountDetails', {
            accountUid: account.uid
        });
    };

    useEffect(() => {
        (async () => {
            await refetchAccounts();
        })();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            await refetchAccounts();
        });

        return unsubscribe;
    }, [navigation]);

    const AccountInfo = ({ account }: AccountInfoProps): JSX.Element => {
        return (
            <View style={styles.accountInfo}>
                <TextLink
                    textAlign='center'
                    style={styles.accountName}
                    onPress={(): void => onPressAccountName(account)}
                    fontType={Heading4}
                >
                    {account.name}
                </TextLink>
                <Body fontWeight='semibold' textAlign='center'>{utils.formatCurrency(account.net_usd_available_balance)}</Body>
            </View>
        );
    };

    return (
        <Screen withoutHeader>
            <Heading3 textAlign='center' style={styles.heading}>
                Accounts
            </Heading3>
            {liabilityAccounts && liabilityAccounts.length > 0 && (
                <>
                    {liabilityAccounts.map((account, idx) => (
                        <AccountInfo key={idx} account={account} />
                    ))}
                </>
            )}
        </Screen>
    );
}
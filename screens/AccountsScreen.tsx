import React, { useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screen } from '../components';
import { Body, Heading3 } from '../components/Typography';
import { RootStackParamList } from '../types';
import { useAccounts } from '../contexts/Accounts';

interface AccountsScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'Accounts'>;
}

export default function AccountsScreen({ navigation }: AccountsScreenProps): JSX.Element {
    const { isLoading, liabilityAccounts, refetchAccounts } = useAccounts();

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

    return (
        <Screen>
            <Heading3 textAlign='center' style={{ marginTop: 100 }}>
                {isLoading ? 'Loading...' : 'Your application has been approved.'}
            </Heading3>
            {liabilityAccounts && liabilityAccounts.length > 0 && (
                <>
                    {liabilityAccounts.map((account, idx) => (
                        <Body key={idx}>{JSON.stringify(account)}</Body>
                    ))}
                </>
            )}
        </Screen>
    );
}
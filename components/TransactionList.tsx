import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '../contexts/Auth';
import { Transaction } from '../models';
import TransactionService from '../services/TransactionService';
import HorizontalLine from './HorizontalLine';
import TransactionListItem from './TransactionListItem';

export type TransactionListProps = {
    syntheticAccountUid?: string;
}

const TransactionList = (props: TransactionListProps): JSX.Element => {
    const { accessToken } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const styles = StyleSheet.create({
        hr: {
            marginVertical: 20,
        }
    });

    const loadTransactions = async (): Promise<void> => {
        const transactionList = await TransactionService.getTransactions(accessToken, props.syntheticAccountUid);
        setTransactions(transactionList.data);
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    return (
        <>
            {transactions.map((transaction, idx) => (
                <View key={idx}>
                    <TransactionListItem transaction={transaction} />
                    <HorizontalLine style={styles.hr} />
                </View>
            ))}
        </>
    );
};

export default TransactionList;
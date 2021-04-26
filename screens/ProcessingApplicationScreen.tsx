import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Screen } from '../components';
import { Heading3, Heading4 } from '../components/Typography';
import { useCustomer } from '../contexts/Customer';
import RizeClient from '../utils/rizeClient';

export default function ProcessingApplicationScreen(): JSX.Element {
    const { customer, refreshCustomer } = useCustomer();
    const rize = RizeClient.getInstance();

    let timeout = null;

    const styles = StyleSheet.create({
        container: {
            marginTop: 100,
        },
        heading: {
            marginVertical: 24,
        }
    });

    const refreshCustomerPeriodically = async (): Promise<void> => {
        await refreshCustomer();
        timeout = setTimeout(() => {
            refreshCustomerPeriodically();
        }, 15000);
    };

    useEffect(() => {
        const verificationCheck = async (): Promise<void> => {
            if (customer.status === 'initiated') {
                await rize.customer.verifyIdentity(customer.uid);
            }
    
            refreshCustomerPeriodically();
        };

        verificationCheck();

        return (): void => clearTimeout(timeout);
    }, []);

    return (
        <Screen style={styles.container}>
            <ActivityIndicator size='large' />
            <Heading3 textAlign='center' style={styles.heading}>
                We&apos;re processing your application.
            </Heading3>
            <Heading4 textAlign='center'>
                This should only take a few moments.
            </Heading4>
        </Screen>
    );
}
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { Screen } from '../components';
import { useCustomer } from '../contexts/Customer';
import RizeClient from '../utils/rizeClient';

export default function ProcessingApplicationScreen(): JSX.Element {
    const { customer, refreshCustomer } = useCustomer();
    const rize = RizeClient.getInstance();

    let timeout = null;

    const refreshCustomerPeriodically = async (): Promise<void> => {
        await refreshCustomer();
        timeout = setTimeout(() => {
            refreshCustomerPeriodically();
        }, 15000);
    };

    useEffect(() => {
        if(customer.status === 'initiated') {
            rize.customer.verifyIdentity(customer.uid);
        }

        refreshCustomerPeriodically();

        return (): void => clearTimeout(timeout);
    }, []);

    return (
        <Screen>
            <Text>Processing Application Screen</Text>
        </Screen>
    );
}
import React, { useEffect } from 'react';
import Checkbox from '../components/Checkbox';
import Screen from '../components/Screen';
import { Heading3, BodySmall, Body } from '../components/Typography';
// import RizeClient from '../utils/rizeClient';
import { useCustomer } from '../contexts/Customer';


export default function DisclosuresScreen(): JSX.Element {
    const { customer } = useCustomer();
    // const rize = RizeClient.getInstance();

    useEffect(() => {
        console.log('---> ', customer);
    }, []);

    return (
        <Screen>
            <Heading3 textAlign='center'>Rize Disclosures</Heading3>

            <Body>
                <Checkbox checked={false} /> I agree to Terms of Use
            </Body>

            <Body>
                <Checkbox checked={false} /> I agree to Privacy Policy
            </Body>

            <Body>
                <Checkbox checked={false} /> I agree to E-sign Disclosures and Agreement
            </Body>

            <BodySmall>By clicking &quotI Agree&quot I have read and agreed to the Terms of Use, Privacy Policy and E-sign Disclosures and Agreement.</BodySmall>
        </Screen>
    );
}


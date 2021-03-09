import { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Pressable, StyleSheet } from 'react-native';
import { Screen, Button } from '../components';
import { RootStackParamList } from '../types';
import { Heading3, Body } from '../components/Typography';
import { useThemeColor } from '../components/Themed';
import RizeClient from '../utils/rizeClient';
import { useCustomer } from '../contexts/Customer';

interface ConfirmPIIScreenProps {
    route: RouteProp<RootStackParamList, 'ConfirmPII'>;
    navigation: StackNavigationProp<RootStackParamList, 'PII'>;
}

export default function ConfirmPIIScreen({ route, navigation }: ConfirmPIIScreenProps): JSX.Element {
    const data = route.params.fieldValues;
    const { customer } = useCustomer();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const rize = RizeClient.getInstance();
    const gray = useThemeColor('gray');
    const primary = useThemeColor('primary');
    
    const styles = StyleSheet.create({
        editButton: {
            textDecorationLine: 'underline',
            textDecorationColor: primary,
            color: primary,
            marginTop: 20
        }
    });

    const onPressEditButton = () => {
        navigation.navigate('PII');
    };

    const handleSubmit = async (): Promise<void> => {
        setIsSubmitting(true);
        const updatedCustomer = await rize.customer.update(customer.uid, customer.email, {
            first_name: data.firstName,
            middle_name: data.middleName,
            last_name: data.lastName,
            suffix: data.suffix,
            phone: data.phone.replace(/\D/g,''),
            ssn: data.ssn,
            dob: data.dob,
            address: {
                street1: data.address1,
                street2: data.address2,
                city: data.city,
                state: data.state,
                postal_code: data.zip,
            },
        });

        if(updatedCustomer) {
            navigation.navigate('BankingDisclosures');
        }
    };
    
    return (
        <Screen useScrollView>
            <Heading3 textAlign='center'>Confirm Your Personal Information</Heading3>
            <Body>&nbsp;</Body>
            <Body>&nbsp;</Body>
            <Body fontWeight='semibold'>First name</Body>
            <Body style={{ color: gray}}>{data.firstName}</Body>
            <Body>&nbsp;</Body>
            <Body fontWeight='semibold'>Last name</Body>
            <Body style={{ color: gray}}>{data.lastName}</Body>
            <Body>&nbsp;</Body>
            <Body fontWeight='semibold'>Date of Birth</Body>
            <Body style={{ color: gray}}>{data.dob}</Body>
            <Body>&nbsp;</Body>
            <Body fontWeight='semibold'>Address</Body>
            <Body style={{ color: gray}}>{`${data.address1} ${data.address2}, ${data.city}, ${data.state} ${data.zip}`}</Body>
            <Body>&nbsp;</Body>
            <Body fontWeight='semibold'>Phone Number</Body>
            <Body style={{ color: gray}}>{data.phone}</Body>
            <Body>&nbsp;</Body>
            <Body fontWeight='semibold'>Social Security Number</Body>
            <Body style={{ color: gray}}>{data.ssn}</Body>
            <Body>&nbsp;</Body>
            <Pressable onPress={(): void => { onPressEditButton(); }} disabled={isSubmitting}>
                <Body textAlign='center' fontWeight='semibold' style={styles.editButton}>&#60; Edit Information</Body>
            </Pressable>
            <Button
                title='Confirm Information'
                onPress={(): Promise<void> => handleSubmit()}
                disabled={isSubmitting}
                style={{
                    marginTop: 20
                }}
            />
        </Screen>
    );
}


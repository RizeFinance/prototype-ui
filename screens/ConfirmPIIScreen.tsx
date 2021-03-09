import { RouteProp } from '@react-navigation/native';
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet } from 'react-native';
import { Screen, Button } from '../components';
import { RootStackParamList } from '../types';
import { Heading3, Body } from '../components/Typography';
import { useThemeColor } from '../components/Themed';
interface ConfirmPIIScreenProps {
    route: RouteProp<RootStackParamList, 'ConfirmPII'>;
}

export default function ConfirmPIIScreen({ route }: ConfirmPIIScreenProps): JSX.Element {
    const data = route.params.fieldValues;
    const gray = useThemeColor('gray');
    const primary = useThemeColor('primary');
    const navigation = useNavigation();

    const styles = StyleSheet.create({
        editButton: {
            textDecorationLine: 'underline',
            textDecorationColor: primary,
            color: primary
        }
    });

    const onPressEditButton = () => {
        navigation.navigate('PII');
    };

    const handleSubmit = () => {
        navigation.navigate('BankingDisclosures');
    };
    
    return (
        <Screen useScrollView>
            <Heading3 textAlign='center'>Confirm Your Personal Information</Heading3>
            <Body>&nbsp;</Body>
            <Body>&nbsp;</Body>
            <Body>First name</Body>
            <Body style={{ color: gray}}>{data.firstName}</Body>
            <Body>&nbsp;</Body>
            <Body>Last name</Body>
            <Body style={{ color: gray}}>{data.lastName}</Body>
            <Body>&nbsp;</Body>
            <Body>Date of Birth</Body>
            <Body style={{ color: gray}}>{data.dob}</Body>
            <Body>&nbsp;</Body>
            <Body>Address</Body>
            <Body style={{ color: gray}}>{`${data.address1} ${data.address2}, ${data.city}, ${data.state} ${data.zip}`}</Body>
            <Body>&nbsp;</Body>
            <Body>Phone Number</Body>
            <Body style={{ color: gray}}>{data.phone}</Body>
            <Body>&nbsp;</Body>
            <Body>Social Security Number</Body>
            <Body style={{ color: gray}}>{data.ssn}</Body>
            <Body>&nbsp;</Body>
            <Pressable onPress={(): void => { onPressEditButton(); }}>
                <Body textAlign='center' style={styles.editButton}>&#60; Edit Information</Body>
            </Pressable>
            <Button
                title='Confirm Information'
                onPress={(): void => handleSubmit()}
                style={{
                    marginTop: 30
                }}
            />
        </Screen>
    );
}


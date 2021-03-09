import * as React from 'react';
import { Screen } from '../components';
import { Heading3, Body } from '../components/Typography';
import { useThemeColor } from '../components/Themed';

export default function ConfirmPIIScreen(): JSX.Element {
    const gray = useThemeColor('gray');
    return (
        <Screen>
            <Heading3 textAlign='center'>Confirm Your Personal Information</Heading3>
            <Body>&nbsp;</Body>
            <Body>&nbsp;</Body>
            <Body>First name</Body>
            <Body style={{ color: gray}}>Jane</Body>
            <Body>&nbsp;</Body>
            <Body>Last name</Body>
            <Body style={{ color: gray}}>Jane</Body>
            <Body>&nbsp;</Body>
            <Body>Date of Birth</Body>
            <Body>09/05/87</Body>
            <Body>&nbsp;</Body>
            <Body>Address</Body>
            <Body>600 Penn</Body>
            <Body>&nbsp;</Body>
        </Screen>
    );
}


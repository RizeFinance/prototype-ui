import * as React from 'react';
import { Screen, Checkbox, Button } from '../components';
import { Heading3, Body, BodySmall } from '../components/Typography';
import { View, Pressable, StyleSheet } from 'react-native';
import { useThemeColor } from '../components/Themed';

export default function BankingDisclosuresScreen(): JSX.Element {

    const primary = useThemeColor('primary');

    const styles = StyleSheet.create({
        checkboxHolder: {
            marginBottom: 15
        },
        checkboxesContainer: {
            marginBottom: 40,
        },
        underline: {
            textDecorationLine: 'underline',
            textDecorationColor: primary
        },
        footer: {
            flex: 1,
            justifyContent: 'flex-end'
        }
    });

    const generateCheckBox = (message: string, disclosure: string): JSX.Element => {
        return (
            <View>
                <View style={styles.checkboxHolder}>
                    <Pressable>
                        <Checkbox checked={false}>
                            <Body>
                                {message} <Body style={styles.underline}>{disclosure}</Body>
                            </Body>
                        </Checkbox>
                    </Pressable>
                </View>
            </View>
        );
    };

    return (
        <Screen>
            <Heading3 textAlign='center'>Banking Disclosures</Heading3>
            <Body>&nbsp;</Body>
            <Body>&nbsp;</Body>

            <View style={styles.checkboxesContainer}>
                {generateCheckBox('I agree to ','Deposit Agreement and Disclosures')}
                {generateCheckBox('I consent to ','texts and phone calls.')}
            </View>

            <View style={styles.footer}>
                <BodySmall textAlign='center'>By clicking &quot;I Agree&quot; I am agreeing to the Deposit agreement and disclosure and to text and phone calls. </BodySmall>
                <BodySmall>&nbsp;</BodySmall>
                <Button
                    title='I Agree'
                />
            </View>
        </Screen>
    );
}


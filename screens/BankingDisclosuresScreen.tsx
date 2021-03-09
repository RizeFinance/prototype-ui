import React, { useEffect, useState } from 'react';
import { Screen, Checkbox, Button } from '../components';
import { Heading3, Body, BodySmall } from '../components/Typography';
import { View, Pressable, StyleSheet } from 'react-native';
import { useThemeColor } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { useComplianceWorkflow } from '../contexts/ComplianceWorkflow';
import { useCustomer } from '../contexts/Customer';
import RizeClient from '../utils/rizeClient';
import * as Network from 'expo-network';
import { ComplianceDocumentAcknowledgementRequest } from '@rize/rize-js/lib/core/compliance-workflow';

export default function BankingDisclosuresScreen(): JSX.Element {

    const [ termsAndConditions, setTermsAndConditions ] = useState<any>([]);

    const { complianceWorkflow, setComplianceWorkflow } = useComplianceWorkflow();

    const [ checkboxSelected, setCheckboxSelected ] = useState<boolean>(false);

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const primary = useThemeColor('primary');
    const depositAgreement = termsAndConditions.find(x => x.name === 'Deposit Agreement');

    const rize = RizeClient.getInstance();
    const navigation = useNavigation();

    const { customer } = useCustomer();
    
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

    useEffect(() => {
        setTermsAndConditions(complianceWorkflow.current_step_documents_pending);
    }, []);

    const handleSubmit = async (): Promise<void> => {
        setIsSubmitting(true);
        const ipAddress = await Network.getIpAddressAsync();
        const updatedComplianceWorkflow = await rize.complianceWorkflow.acknowledgeComplianceDocuments(
            complianceWorkflow.uid,
            customer.uid,
            ...termsAndConditions.map(doc => ({
                accept: 'yes',
                documentUid: doc.uid,
                ipAddress: ipAddress,
                userName: complianceWorkflow.customer.email,
            } as ComplianceDocumentAcknowledgementRequest ))
        );

        await setComplianceWorkflow(updatedComplianceWorkflow);

        navigation.navigate('ProcessingApplication');
    };

    const generateCheckBox = ( disclosure: string): JSX.Element => {
        return (
            <View>
                <View style={styles.checkboxHolder}>
                    <Pressable>
                        <Checkbox 
                            checked={false}
                            onChange={(checked): void => setCheckboxSelected(checked)}>
                            <Body>
                                I agree to <Body style={styles.underline}>{disclosure}</Body>
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
                {depositAgreement && generateCheckBox(depositAgreement.name)}
            </View>

            <View style={styles.footer}>
                <BodySmall textAlign='center'>By clicking &quot;I Agree&quot; I am agreeing to the Deposit agreement and disclosure and to text and phone calls. </BodySmall>
                <BodySmall>&nbsp;</BodySmall>
                <Button
                    title='I Agree'
                    disabled={!checkboxSelected || isSubmitting}
                    onPress={(): Promise<void> => handleSubmit()}
                />
            </View>
        </Screen>
    );
}


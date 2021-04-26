import React, { useEffect, useState } from 'react';
import { Screen, Checkbox, Button } from '../components';
import { Heading3, Body, BodySmall } from '../components/Typography';
import { View, Pressable, StyleSheet } from 'react-native';
import { useThemeColor } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';
import cloneDeep from 'lodash/cloneDeep';
import { ComplianceDocumentSelection, useComplianceWorkflow } from '../contexts/ComplianceWorkflow';
import { useCustomer } from '../contexts/Customer';
import RizeClient from '../utils/rizeClient';
import * as Network from 'expo-network';
import { ComplianceDocumentAcknowledgementRequest } from '@rizefinance/rize-js/lib/core/compliance-workflow';

export default function BankingDisclosuresScreen(): JSX.Element {

    const {
        complianceWorkflow,
        bankingDisclosures,
        setComplianceWorkflow,
        setBankingDisclosures,
        loadBankingDisclosures
    } = useComplianceWorkflow();

    const navigation = useNavigation();

    const { customer } = useCustomer();

    const [ checkboxSelected, setCheckboxSelected ] = useState<boolean>(false);

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const depositAgreement = bankingDisclosures.find(x => x.name === 'Deposit Agreement');

    const rize = RizeClient.getInstance();
    
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

    useEffect(() => {
        if (bankingDisclosures.length === 0) {
            loadBankingDisclosures();
        }
    }, []);

    useEffect(() => {
        const hasUnselectedBox = bankingDisclosures.find(doc => !doc.selected);
        setCheckboxSelected(!hasUnselectedBox);
    }, [bankingDisclosures]);

    const setDocSelected = (docIndex: number, selected: boolean): void => {
        const docsClone = cloneDeep(bankingDisclosures);
        docsClone[docIndex].selected = selected;
        setBankingDisclosures(docsClone);
    };
    
    const onPressButton = (link: string): void => {
        navigation.navigate('PDFReader', {
            url: link,
        });
    };


    const handleSubmit = async (): Promise<void> => {
        setIsSubmitting(true);

        try {
            const unacceptedDocs = bankingDisclosures.filter(x => !x.alreadyAccepted);

            if (unacceptedDocs.length > 0) {
                const ipAddress = await Network.getIpAddressAsync();
                const updatedComplianceWorkflow = await rize.complianceWorkflow.acknowledgeComplianceDocuments(
                    complianceWorkflow.uid,
                    customer.uid,
                    ...unacceptedDocs.map(doc => ({
                        accept: 'yes',
                        documentUid: doc.uid,
                        ipAddress: ipAddress,
                        userName: complianceWorkflow.customer.email,
                    } as ComplianceDocumentAcknowledgementRequest))
                );

                await setComplianceWorkflow(updatedComplianceWorkflow);
            }

            navigation.navigate('ProcessingApplication');
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateCheckBox = ( doc: ComplianceDocumentSelection, index: number): JSX.Element => {
        return (
            <View>
                <View style={styles.checkboxHolder}>
                    <Pressable onPress={(): void => { onPressButton(doc.compliance_document_url); }}>
                        <Checkbox 
                            checked={false}
                            onChange={(checked): void => setDocSelected(index, checked)}>
                            <Body>
                                I agree to <Body style={styles.underline}>{doc.name}</Body>
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
                {depositAgreement && generateCheckBox(depositAgreement,bankingDisclosures.indexOf(depositAgreement))}
            </View>

            <View style={styles.footer}>
                <BodySmall textAlign='center'>By clicking &quot;I Agree&quot; I am agreeing to the Deposit agreement and disclosure. </BodySmall>
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


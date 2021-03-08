import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import cloneDeep from 'lodash/cloneDeep';
import { Pressable, View, StyleSheet, } from 'react-native';
import * as Network from 'expo-network';
import { ComplianceDocumentAcknowledgementRequest, ComplianceWorkflow } from '@rize/rize-js/lib/core/compliance-workflow';

import Checkbox from '../components/Checkbox';
import { Screen } from '../components';
import { Heading3, BodySmall, Body } from '../components/Typography';
import Button from '../components/Button';
import { useThemeColor } from '../components/Themed';
import RizeClient from '../utils/rizeClient';
import { useCustomer } from '../contexts/Customer';
import { useComplianceWorkflow } from '../contexts/ComplianceWorkflow';

export default function DisclosuresScreen(): JSX.Element {
    const { complianceWorkflow, setComplianceWorkflow } = useComplianceWorkflow();

    const rize = RizeClient.getInstance();
    const navigation = useNavigation();
    
    const { customer } = useCustomer();
    const [termsAndConditions, setTermsAndConditions] = useState<any>([]);
    const [AllCheckBoxSelected, setAllCheckBoxSelected] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const termsOfUse = termsAndConditions.find(x => x.external_storage_name === 'eft_auth_0');
    const privacyPolicy = termsAndConditions.find(x => x.external_storage_name === 'e_comm_disc_0');
    const eSign = termsAndConditions.find(x => x.external_storage_name === 'e_sign_0');

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

    const onPressButton = (link: string, externalStorageName): void => {
        navigation.navigate('PDFReader', {
            url: link,
            filename: `${externalStorageName}.pdf`,
        });
    };

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

        navigation.navigate('PatriotAct');
    };

    const setDocSelected = (docIndex: number, selected: boolean): void => {
        const docsClone = cloneDeep(termsAndConditions);
        docsClone[docIndex].selected = selected;
        setTermsAndConditions(docsClone);
    };

    useEffect(() => {
        const hasUnselectedBox = termsAndConditions.find(doc => !doc.selected);
        setAllCheckBoxSelected(!hasUnselectedBox);
    }, [termsAndConditions]);

    useEffect(() => {
        setTermsAndConditions(complianceWorkflow.current_step_documents_pending);
    }, []);

    const renderDocumentCheckbox = (doc: ComplianceWorkflow, index: number): JSX.Element => {
        return (
            <View key={index}>
                <View style={styles.checkboxHolder}>
                    <Pressable onPress={(): void => { onPressButton(doc.compliance_document_url, doc.external_storage_name); }}>
                        <Checkbox
                            key={index}
                            checked={false}
                            onChange={(checked): void => setDocSelected(index, checked)}
                        >
                            <Body>
                                I agree to <Body style={styles.underline}>{doc.name}.</Body>
                            </Body>
                        </Checkbox>
                    </Pressable>
                </View>
            </View>
        );
    };

    return (
        <Screen>
            <Heading3 textAlign='center'>Rize Disclosures</Heading3>
            <Body>&nbsp;</Body>
            <Body>&nbsp;</Body>

            <View style={styles.checkboxesContainer}>
                {termsOfUse && renderDocumentCheckbox(termsOfUse, termsAndConditions.indexOf(termsOfUse))}
                {privacyPolicy && renderDocumentCheckbox(privacyPolicy, termsAndConditions.indexOf(privacyPolicy))}
                {eSign && renderDocumentCheckbox(eSign, termsAndConditions.indexOf(eSign))}
            </View>

            <View style={styles.footer}>
                <BodySmall textAlign='center'>By clicking &quot;I Agree&quot; I have read and agreed to the Terms of Use, Privacy Policy and E-sign Disclosures and Agreement.</BodySmall>
                <BodySmall>&nbsp;</BodySmall>
                <Button
                    title='I Agree'
                    disabled={!AllCheckBoxSelected || isSubmitting}
                    onPress={(): Promise<void> => handleSubmit()}
                />
            </View>
        </Screen>
    );
}


import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import cloneDeep from 'lodash/cloneDeep';
import Checkbox from '../components/Checkbox';
import { Screen } from '../components';
import { Pressable, View, StyleSheet, } from 'react-native';
import { Heading3, BodySmall, Body } from '../components/Typography';
import Button from '../components/Button';
import { useThemeColor } from '../components/Themed';
import RizeClient from '../utils/rizeClient';
import { useCustomer } from '../contexts/Customer';
import { ComplianceDocumentAcknowledgementRequest } from '@rize/rize-js/lib/core/compliance-workflow';


export default function DisclosuresScreen(): JSX.Element {
    const { customer } = useCustomer();
    const primary = useThemeColor('primary');
    const rize = RizeClient.getInstance();
    const navigation = useNavigation();
    const [termsAndConditions, setTermsAndConditions] = useState([]);
    const [workflowId, setWorkflowId] = useState<string>();
    const [AllCheckBoxSelected, setAllCheckBoxSelected] = useState(false);

    const styles = StyleSheet.create({
        heading: {
            marginTop: 40,
            marginBottom: 40,
        },
        checkboxHolder: {
            marginBottom: 15
        },
        checkboxesContainer: {
            marginBottom: 40,
        },
        underline: {
            borderBottomColor: primary,
            borderBottomWidth: 2,
        }
    });

    const onPressButton = (link: string, externalStorageName): void => {
        navigation.navigate('PDFReader', {
            url: link,
            filename: `${externalStorageName}.pdf`,
        });
    };

    const getComplianceWorkflow = async () => {
        const latestWorkflow = await rize.complianceWorkflow.viewLatest(customer.uid);
        setWorkflowId(latestWorkflow.uid);
        setTermsAndConditions(latestWorkflow.current_step_documents_pending);
    };

    const handleSubmit = async (): Promise<void> => {

        await rize.complianceWorkflow.acknowledgeComplianceDocuments(
            workflowId,
            customer.uid,
            ...termsAndConditions.map(doc => ({
                documentUid: doc.uid,
                accept: 'yes',
                userName: doc,
                ipAddress: doc
            } as ComplianceDocumentAcknowledgementRequest ))
        );

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
        getComplianceWorkflow();
    }, []);

    return (
        <Screen style={{ justifyContent: 'space-between' }}>
            <Heading3 style={styles.heading} textAlign='center'>Rize Disclosures</Heading3>

            <View style={styles.checkboxesContainer}>
                {termsAndConditions.map((doc, index) => (
                    <View key={index}>
                        <View style={styles.checkboxHolder}>
                            <Pressable onPress={(): void => { onPressButton(doc.compliance_document_url, doc.external_storage_name); }}>
                                <Checkbox
                                    key={index}
                                    checked={false}
                                    onChange={(checked): void => setDocSelected(index, checked)}
                                >
                                    <View style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <Body style={{ backgroundColor: 'red', flexShrink: 1 }}>I agree to</Body>
                                        <View style={styles.underline}>
                                            <Body>{doc.name}</Body>
                                        </View>
                                    </View>
                                </Checkbox>
                            </Pressable>
                        </View>
                    </View>
                ))}
            </View>

            <View style={{ alignSelf: 'flex-end' }}>
                <BodySmall>By clicking &quot;I Agree&quot; I have read and agreed to the Terms of Use, Privacy Policy and E-sign Disclosures and Agreement.</BodySmall>
                <Button
                    title='I Agree'
                    disabled={!AllCheckBoxSelected}
                    onPress={(): Promise<void> => handleSubmit()}
                />
            </View>
        </Screen>
    );
}


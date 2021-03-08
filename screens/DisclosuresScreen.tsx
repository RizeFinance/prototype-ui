import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Checkbox from '../components/Checkbox';
import Screen from '../components/Screen';
import { Pressable, View, StyleSheet, } from 'react-native';
import { Heading3, BodySmall, Body } from '../components/Typography';
import Button from '../components/Button';
import RizeClient from '../utils/rizeClient';
import { useCustomer } from '../contexts/Customer';


export default function DisclosuresScreen(): JSX.Element {
    const { customer } = useCustomer();
    const rize = RizeClient.getInstance();
    const navigation = useNavigation();
    const [termsAndConditions, setTermsAndConditions] = useState([]);

    const styles = StyleSheet.create({
        heading: {
            marginTop: 40,
            marginBottom: 24,
        },
        checkboxHolder: {
            marginBottom: 15
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
        setTermsAndConditions(latestWorkflow.current_step_documents_pending);
    };

    const handleSubmit = () => {
        console.log('handleSubmit');
    };

    const setDocSelected = (docIndex: number, selected: boolean): void => {
        const docsClone = cloneDeep(bankingDisclosures);
        docsClone[docIndex].selected = selected;

        setBankingDisclosures(docsClone);
    };

    useEffect(() => {
        getComplianceWorkflow();
    }, []);

    return (
        <Screen>
            <Heading3 style={styles.heading} textAlign='center'>Rize Disclosures</Heading3>

            {termsAndConditions.map((doc, index) => (
                <View key={index}>
                    <View style={styles.checkboxHolder}>
                        <Pressable onPress={(): void => { onPressButton(doc.compliance_document_url, doc.external_storage_name); }}>
                            <Checkbox
                                key={index}
                                checked={false}
                                onChange={(checked): void => setDocSelected(index, checked)}
                            >
                                <Body>{doc.name}</Body>
                            </Checkbox>
                        </Pressable>
                    </View>
                </View>
            ))}

            <BodySmall>By clicking &quot;I Agree&quot; I have read and agreed to the Terms of Use, Privacy Policy and E-sign Disclosures and Agreement.</BodySmall>

            <Button
                title='I Agree'
                disabled={true}
                onPress={(): void => handleSubmit()}
            />
        </Screen>
    );
}


import React, { useEffect, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { Pressable, View, StyleSheet } from 'react-native';
import * as Network from 'expo-network';
import { ComplianceDocumentAcknowledgementRequest } from '@rizefinance/rize-js/lib/core/compliance-workflow';
import { Screen, useThemeColor, Checkbox, Button } from '../components';
import { Heading3, BodySmall, Body } from '../components/Typography';
import { ComplianceDocumentSelection, useComplianceWorkflow } from '../contexts/ComplianceWorkflow';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/Auth';
import ComplianceWorkflowService from '../services/ComplianceWorkflowService';

interface DisclosuresScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Disclosures'>;
}

export default function DisclosuresScreen({ navigation }: DisclosuresScreenProps): JSX.Element {
  const { complianceWorkflow, disclosures, setComplianceWorkflow, setDisclosures } =
    useComplianceWorkflow();

  const { accessToken } = useAuth();
  const [allCheckBoxSelected, setAllCheckBoxSelected] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const termsOfUse = disclosures.find((x) => x.external_storage_name === 'eft_auth_0');
  const privacyPolicy = disclosures.find((x) => x.external_storage_name === 'e_comm_disc_0');
  const eSign = disclosures.find((x) => x.external_storage_name === 'e_sign_0');

  const primary = useThemeColor('primary');

  const styles = StyleSheet.create({
    checkboxHolder: {
      marginBottom: 15,
    },
    checkboxesContainer: {
      marginBottom: 40,
    },
    underline: {
      textDecorationLine: 'underline',
      textDecorationColor: primary,
    },
    footer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
  });

  const onPressButton = (link: string): void => {
    navigation.navigate('PDFReader', {
      url: link,
    });
  };

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);

    try {
      const unacceptedDocs = disclosures.filter((x) => !x.alreadyAccepted);

      if (unacceptedDocs.length > 0) {
        const ipAddress = await Network.getIpAddressAsync();
        const updatedComplianceWorkflow = await ComplianceWorkflowService.acknowledgeDocuments(
          accessToken,
          unacceptedDocs.map(
            (doc) =>
              ({
                accept: 'yes',
                document_uid: doc.uid,
                ip_address: ipAddress,
                user_name: complianceWorkflow.customer.email,
              } as ComplianceDocumentAcknowledgementRequest)
          )
        );

        await setComplianceWorkflow(updatedComplianceWorkflow);
      }

      navigation.navigate('PatriotAct');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDocSelected = (docIndex: number, selected: boolean): void => {
    const docsClone = cloneDeep(disclosures);
    docsClone[docIndex].selected = selected;
    setDisclosures(docsClone);
  };

  useEffect(() => {
    const hasUnselectedBox = disclosures.find((doc) => !doc.selected);
    setAllCheckBoxSelected(!hasUnselectedBox);
  }, [disclosures]);

  const renderDocumentCheckbox = (doc: ComplianceDocumentSelection, index: number): JSX.Element => {
    return (
      <View key={index}>
        <View style={styles.checkboxHolder}>
          <Pressable
            onPress={(): void => {
              onPressButton(doc.compliance_document_url);
            }}
          >
            <Checkbox
              key={index}
              checked={doc.selected}
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
      <Heading3 textAlign="center">Rize Disclosures</Heading3>
      <Body>&nbsp;</Body>
      <Body>&nbsp;</Body>

      <View style={styles.checkboxesContainer}>
        {termsOfUse && renderDocumentCheckbox(termsOfUse, disclosures.indexOf(termsOfUse))}
        {privacyPolicy && renderDocumentCheckbox(privacyPolicy, disclosures.indexOf(privacyPolicy))}
        {eSign && renderDocumentCheckbox(eSign, disclosures.indexOf(eSign))}
      </View>

      <View style={styles.footer}>
        <BodySmall textAlign="center">
          By clicking &quot;I Agree&quot; I have read and agreed to the Terms of Use, Privacy Policy
          and E-sign Disclosures and Agreement.
        </BodySmall>
        <BodySmall>&nbsp;</BodySmall>
        <Button
          title="I Agree"
          disabled={!allCheckBoxSelected || isSubmitting}
          onPress={(): Promise<void> => handleSubmit()}
        />
      </View>
    </Screen>
  );
}

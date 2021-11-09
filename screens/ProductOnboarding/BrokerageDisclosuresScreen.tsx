import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Checkbox, Button } from '../../components';
import { Heading3, Body } from '../../components/Typography';
import {
  useComplianceWorkflow,
  ComplianceDocumentSelection,
} from '../../contexts/ComplianceWorkflow';
import { ComplianceDocumentAcknowledgementRequest } from '@rizefinance/rize-js/lib/core/compliance-workflow';
import ComplianceWorkflowService from '../../services/ComplianceWorkflowService';
import { useAuth } from '../../contexts/Auth';
import config from '../../config/config';
import { find, get } from 'lodash';
import * as Network from 'expo-network';

export default function BrokerageDisclosuresScreen(): JSX.Element {
  const navigation = useNavigation();

  const brokerageProductUid = config.application.brokerageProductUid;
  const { customerWorkflows, loadComplianceWorkflows, setComplianceWorkflow } =
    useComplianceWorkflow();
  const { accessToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      if (brokerageProductUid) {
        await loadComplianceWorkflows({ product_uid: [brokerageProductUid] });
      }
    })();
  }, []);

  const acceptedWorkflow = find(
    customerWorkflows,
    (workflow) => get(workflow, ['summary', 'status']) === 'accepted'
  );
  const inProgressWorkflow = find(
    customerWorkflows,
    (workflow) => get(workflow, ['summary', 'status']) === 'in_progress'
  );
  const brokerageAgreements = get(inProgressWorkflow, ['current_step_documents_pending']);

  useEffect(() => {
    if (acceptedWorkflow) navigation.navigate('ProcessingScreen');
  }, [acceptedWorkflow]);

  const styles = StyleSheet.create({
    heading: {
      marginBottom: 25,
    },
    container: {
      marginTop: 25,
    },
    checkboxHolder: {
      marginBottom: 15,
    },
    checkboxesContainer: {
      marginBottom: 40,
    },
    underline: {
      textDecorationLine: 'underline',
      textDecorationColor: 'gray',
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

  const DocumentCheckbox = ({
    doc,
    index,
  }: {
    doc: ComplianceDocumentSelection;
    index: number;
  }): JSX.Element => {
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
              checked={checked}
              onChange={(checked): void => setChecked(checked)}
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

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);

    try {
      const unacceptedDocs = inProgressWorkflow.current_step_documents_pending;
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
                user_name: inProgressWorkflow.customer.email,
              } as ComplianceDocumentAcknowledgementRequest)
          )
        );

        await setComplianceWorkflow(updatedComplianceWorkflow);

        if (updatedComplianceWorkflow.summary.status === 'accepted') {
          navigation.navigate('ProcessingScreen');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <Heading3 textAlign="center" style={styles.heading}>
        Brokerage Disclosures
      </Heading3>

      {brokerageAgreements?.map((doc, index) => (
        <DocumentCheckbox key={index} doc={doc} index={index} />
      ))}

      <Button
        title="I Agree"
        disabled={!checked || isSubmitting}
        onPress={(): Promise<void> => handleSubmit()}
      />
    </Screen>
  );
}

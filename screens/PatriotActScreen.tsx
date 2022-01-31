import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import { StyleSheet, View } from 'react-native';
import { Button, Screen } from '../components';
import { Body, BodySmall, Heading3 } from '../components/Typography';
import { useCompliance } from '../contexts/ComplianceWorkflow';
import { RootStackParamList } from '../types';
import * as Network from 'expo-network';
import { useAuth } from '../contexts/Auth';
import {ComplianceWorkflowService} from '../services';

interface PatriotActScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'PatriotAct'>;
}

export default function PatriotActScreen({ navigation }: PatriotActScreenProps): JSX.Element {
  const { complianceWorkflow, setComplianceWorkflow } = useCompliance();
  const { accessToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = StyleSheet.create({
    heading: {
      marginBottom: 4,
    },
    content: {
      paddingHorizontal: 16,
      marginBottom: 25,
      flex: 2,
    },
  });

  const onSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    if (complianceWorkflow) {
      const externalStorageName = 'usa_ptrt_0';

      // Check if the Patriot Act document is still in pending
      let patriotActDocument = complianceWorkflow.current_step_documents_pending.find(
        (x) => x.external_storage_name === externalStorageName
      );

      if (patriotActDocument) {
        const ipAddress = await Network.getIpAddressAsync();
        const updatedComplianceWorkflow = await ComplianceWorkflowService.acknowledgeDocuments(
          accessToken,
          {
            accept: 'yes',
            document_uid: patriotActDocument.uid,
            ip_address: ipAddress,
            user_name: complianceWorkflow.customer.email,
          }
        );

        await setComplianceWorkflow(updatedComplianceWorkflow);

        navigation.navigate('PII');
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        // Check if already accepted
        patriotActDocument = complianceWorkflow.accepted_documents.find(
          (x) => x.external_storage_name === externalStorageName
        );

        // If already accepted, redirect to next step
        if (patriotActDocument) {
          navigation.navigate('PII');
        }
      }
    }
  };

  return (
    <Screen>
      <View>
        <Heading3 textAlign="center" style={styles.heading}>
          USA Patriot Act Notice
        </Heading3>
      </View>

      <View style={styles.content}>
        <Body
          fontWeight="semibold"
          style={{ textAlign: 'center', marginTop: 50, marginBottom: 25 }}
        >
          Important Information About Procedures for Opening a New Account
        </Body>

        <Body style={{ marginBottom: 25 }}>
          To help the government fight the funding of terrorism and money laundering activities,
          Federal law requires all financial institutions to obtain, verify, and record information
          that identifies each person who opens an account.
        </Body>

        <Body fontWeight="semibold" style={{ marginBottom: 5 }}>
          What this means for you:
        </Body>
        <Body>
          When you open an account, we will ask for your name, address, date of birth, and other
          information that will allow us to identify you. We may also ask to see your driver&apos;s
          license or other identifying documents.
        </Body>
      </View>

      <View>
        <BodySmall textAlign="center" style={{ marginBottom: 20 }}>
          By clicking &quot;I Agree&quot; I am acknowledging that I have read and agree to the USA
          Patriot Act.
        </BodySmall>

        <Button
          title="I Agree"
          disabled={isSubmitting}
          loading={isSubmitting}
          onPress={() => onSubmit()}
        />
      </View>
    </Screen>
  );
}

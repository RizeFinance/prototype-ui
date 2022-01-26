import React, { useEffect, useState } from 'react';
import { cloneDeep, isEmpty, mapValues } from 'lodash';
import { Pressable, View, StyleSheet, ActivityIndicator } from 'react-native';
import * as Network from 'expo-network';
import { ComplianceDocumentAcknowledgementRequest } from '@rizefinance/rize-js/lib/core/compliance-workflow';
import { Screen, Checkbox, Button, Heading3, BodySmall, Body } from '../components';
import { ComplianceDocumentSelection, useCompliance, useAuth } from '../contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import ComplianceWorkflowService from '../services/ComplianceWorkflowService';
import { defaultColors } from '../constants/Colors';
import { Formik, Field } from 'formik';
import * as yup from 'yup';

const optionalRequiredSchema = yup.lazy((obj) => {
  return yup.object(
    mapValues(obj, () => {
      return yup.boolean().oneOf([true]).required();
    })
  );
});

export default function DisclosuresScreen({ navigation }: DisclosuresScreenProps): JSX.Element {
  const { complianceWorkflow, disclosures, setComplianceWorkflow, setDisclosures } =
    useCompliance();
  const { accessToken } = useAuth();

  const [step, setStep] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initValues, setInitValues] = useState<any>({});

  console.log(initValues, 'initValues');

  const onPressButton = (link: string): void => {
    navigation.navigate('PDFReader', {
      url: link,
    });
  };

  useEffect(() => {
    if (!isEmpty(complianceWorkflow)) {
      const initialValues = complianceWorkflow.current_step_documents_pending.reduce(
        (acc, curr) => {
          const key = curr['uid'];
          acc[key] = false;
          return acc;
        },
        {}
      );

      setInitValues(initialValues);
    }
  }, [complianceWorkflow]);

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

        setComplianceWorkflow(updatedComplianceWorkflow);
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

  const RenderAgreements = () => {
    return (
      <>
        <View style={styles.checkboxesContainer}>
          {complianceWorkflow.current_step_documents_pending.map((agreement) => {
            return (
              <View style={styles.checkboxHolder} key={agreement.external_storage_name}>
                <Field name="docs">
                  {({ field, form }) => {
                    console.log(form, 'form');
                    return (
                      <Checkbox
                        checked={field.value}
                        onChange={(value) => form.setFieldValue(agreement.uid, value)}
                      />
                    );
                  }}
                </Field>
                <Body>
                  I agree to <Body style={styles.underline}>{agreement.name}.</Body>
                </Body>
              </View>
            );
          })}
        </View>
      </>
    );
  };
  const PatriotAct = () => {
    return (
      <>
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
            Federal law requires all financial institutions to obtain, verify, and record
            information that identifies each person who opens an account.
          </Body>

          <Body fontWeight="semibold" style={{ marginBottom: 5 }}>
            What this means for you:
          </Body>
          <Body>
            When you open an account, we will ask for your name, address, date of birth, and other
            information that will allow us to identify you. We may also ask to see your
            driver&apos;s license or other identifying documents.
          </Body>
        </View>
      </>
    );
  };

  const renderTitle = (step) => {
    switch (step) {
      case '1':
        return 'Rize Disclosures';
      default:
        return 'Disclosures';
    }
  };

  if (!isEmpty(initValues)) {
    return (
      <Screen>
        <Heading3 textAlign="center" style={styles.heading}>
          {renderTitle(step)}
        </Heading3>

        <Formik
          initialValues={initValues}
          onSubmit={(values) => console.log(values, 'values form')}
          validationSchema={optionalRequiredSchema}
          validateOnMount
        >
          {(formik) => (
            <>
              <RenderAgreements />

              <View style={styles.footer}>
                <BodySmall textAlign="center">
                  By clicking &quot;I Agree&quot; I have read and agreed to the Terms of Use,
                  Privacy Policy and E-sign Disclosures and Agreement.
                </BodySmall>
                <Button
                  title="I Agree"
                  disabled={!formik.isValid || isSubmitting}
                  onPress={(): Promise<void> => handleSubmit()}
                />
              </View>
            </>
          )}
        </Formik>

        {/* <PatriotAct /> */}
      </Screen>
    );
  } else {
    return <ActivityIndicator size="large" />;
  }
}

const styles = StyleSheet.create({
  checkboxHolder: {
    marginBottom: 15,
    flexDirection: 'row',
  },
  checkboxesContainer: {
    marginBottom: 40,
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationColor: defaultColors.primary,
    cursor: 'pointer',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heading: {
    marginBottom: 25,
  },
  content: {
    paddingHorizontal: 16,
    marginBottom: 25,
    flex: 2,
  },
});

interface DisclosuresScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Disclosures'>;
}

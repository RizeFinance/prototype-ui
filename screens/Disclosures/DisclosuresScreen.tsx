import React from 'react';
import { isEmpty, mapValues } from 'lodash';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Screen, Button, Heading3, BodySmall, Body } from '../../components';
import { useCompliance, useAuth } from '../../contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { ComplianceWorkflowService, CustomerService } from '../../services';
import { Formik } from 'formik';
import * as yup from 'yup';
import PIIForm from './PIIForm';
import Processing from './Processing';
import moment from 'moment';
import AgreementCheckbox from './AgreementCheckbox';
import ConfirmationInfo from './ConfirmationInfo';

import useComplianceWorkflow from '../../hooks/useComplianceWorkflow';

export default function DisclosuresScreen({ navigation }: DisclosuresScreenProps): JSX.Element {
  const { accessToken, customer } = useAuth();

  const { currentStep, totalSteps, currentPendingDocs, submitAgreements, checkboxData, isLoading } =
    useComplianceWorkflow(customer.uid, accessToken);

  const handlePIISubmit = async (values) => {
    try {
      await CustomerService.updateCustomer(accessToken, customer.email, {
        first_name: values.first_name,
        middle_name: values.middle_name,
        last_name: values.last_name,
        suffix: values.suffix,
        phone: values.phone.replace(/\D/g, ''),
        ssn: values.ssn,
        dob: moment(values.dob).format('yyyy-MM-DD'),
        address: {
          street1: values.street1,
          street2: values.street2,
          city: values.city,
          state: values.state,
          postal_code: values.postal_code,
        },
      });
    } catch (err) {
      console.log(err, 'err in handlePIISubmit');
    }
  };

  const PatriotAct = () => {
    return (
      <>
        <Heading3 textAlign="center" style={styles.heading}>
          USA Patriot Act Notice
        </Heading3>
        <View style={styles.content}>
          <Body fontWeight="semibold" style={styles.title}>
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
        <AgreementCheckbox currentDocs={currentPendingDocs} />
      </>
    );
  };

  const renderTitle = () => {
    switch (currentStep) {
      case 1:
        return {
          title: 'Rize Disclosures',
          component: <AgreementCheckbox currentDocs={currentPendingDocs} />,
        };
      case 2:
        return {
          title: null,
          component: customer.last_name ? (
            <PatriotAct />
          ) : (
            <PIIForm
              isLoading={isLoading}
              handleSubmit={handlePIISubmit}
              customer={customer}
            />
          ),
        };
      case 3:
        return {
          title: customer.last_name ? null : 'Banking Disclosures',
          component: customer.last_name ? (
            <PIIForm handleSubmit={handlePIISubmit} customer={customer} />
          ) : (
            <AgreementCheckbox currentDocs={currentPendingDocs} />
          ),
        };
      default:
        return { title: '', component: null };
    }
  };

  const renderAgreement = () => {
    const agreementNames = currentPendingDocs.map((doc) => doc.name);
    const numNames = agreementNames.length;

    if (numNames === 1) return agreementNames[0];
    if (numNames === 2) return `${agreementNames[0]} and ${agreementNames[1]}`;
    if (numNames >= 3) {
      agreementNames[numNames - 1] = `and ${agreementNames[numNames - 1]} `;
      return agreementNames.join(', ');
    }
  };

  if (!isEmpty(checkboxData)) {
    return (
      <Screen>
        <Heading3 textAlign="center" style={styles.heading}>
          {renderTitle().title}
        </Heading3>

        <Formik
          initialValues={checkboxData}
          onSubmit={submitAgreements}
          validationSchema={optionalRequiredSchema}
          validateOnMount
        >
          {(formik) => (
            <>
              {renderTitle().component}

              <View>
                <BodySmall
                  textAlign="center"
                  style={{ marginBottom: 20, maxWidth: '40ch', alignSelf: 'center' }}
                >
                  {`By clicking "I Agree" I have read and agreed to the ${renderAgreement()} `}
                </BodySmall>
                <Button
                  title="I Agree"
                  disabled={!formik.isValid || isLoading}
                  onPress={formik.submitForm}
                  loading={isLoading}
                />
              </View>
            </>
          )}
        </Formik>
      </Screen>
    );
  } else {
    return <ActivityIndicator size="large" />;
  }
}

const styles = StyleSheet.create({
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
  title: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 25,
  },
});

const optionalRequiredSchema = yup.lazy((obj) => {
  return yup.object(
    mapValues(obj, () => {
      return yup.boolean().oneOf([true]).required();
    })
  );
});

interface DisclosuresScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Disclosures'>;
}

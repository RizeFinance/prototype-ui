import React from 'react';
import { isEmpty, mapValues } from 'lodash';
import { StyleSheet, ActivityIndicator } from 'react-native';
import {
  Screen,
  Heading3,
  BodySmall,
  Body,
  PIIForm,
  PatriotAct,
  AgreementCheckbox,
  Processing,
} from '../../components';
import { useAuth } from '../../contexts';
import { CustomerService } from '../../services';
import { Formik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import { defaultColors } from '../../constants/Colors';

import useComplianceWorkflow from '../../hooks/useComplianceWorkflow';

const DisclosuresScreen = () => {
  const { accessToken, customer } = useAuth();

  const {
    patriotAccepted,
    currentStep,
    error,
    setError,
    currentPendingDocs,
    submitAgreements,
    checkboxData,
    isLoading,
  } = useComplianceWorkflow();

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
      setError(err[0].title);
    }
  };

  const renderScreen = () => {
    switch (currentStep) {
      case 1:
        return {
          title: 'Rize Disclosures',
          component: <AgreementCheckbox currentDocs={currentPendingDocs} isLoading={isLoading} />,
        };
      case 2:
        return {
          title: null,
          component: patriotAccepted ? (
            <PIIForm handleSubmit={handlePIISubmit} customer={customer} />
          ) : (
            <PatriotAct currentPendingDocs={currentPendingDocs} />
          ),
        };
      case 3:
        return {
          title: 'Banking Disclosures',
          component: <AgreementCheckbox currentDocs={currentPendingDocs} isLoading={isLoading} />,
        };
      default:
        return { title: '', component: null };
    }
  };

  const processing = ['queued', 'identity_verified', 'under_review', 'initiated'];
  const unapproved = ['manual_review', 'rejected'];
  const newCustomer = ['initiated', 'in_progress'];

  if (processing.includes(customer.status)) {
    return <Processing />;
  }

  if (unapproved.includes(customer.status)) {
    return (
      <Screen withoutHeader>
        <Heading3 textAlign="center" style={{ marginTop: 100 }}>
          {"We're having issues with your account."}
        </Heading3>
        <Body textAlign="center" style={{ marginTop: 20 }}>
          {'Please contact customer support for additional help.'}
        </Body>
      </Screen>
    );
  }

  if (!isEmpty(checkboxData) && newCustomer.includes(customer.status)) {
    return (
      <Screen style={{ justifyContent: 'space-between' }}>
        {!isEmpty(renderScreen().title) && (
          <Heading3 textAlign="center" style={{ marginBottom: 50 }}>
            {renderScreen().title}
          </Heading3>
        )}

        <Formik
          initialValues={checkboxData}
          onSubmit={submitAgreements}
          validationSchema={optionalRequiredSchema}
          validateOnMount
        >
          {() => (
            <>
              {renderScreen().component}
              {!isEmpty(error) && (
                <BodySmall fontWeight="semibold" style={styles.errorText}>
                  {error}
                </BodySmall>
              )}
            </>
          )}
        </Formik>
      </Screen>
    );
  } else {
    return <ActivityIndicator size="large" />;
  }
};

export default DisclosuresScreen;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    marginBottom: 25,
  },
  title: {
    textAlign: 'center',
    marginBottom: 25,
  },
  errorText: {
    color: defaultColors.error,
    marginHorizontal: 8,
    marginTop: 4,
  },
});

const optionalRequiredSchema = yup.lazy((obj) => {
  return yup.object(
    mapValues(obj, () => {
      return yup.boolean().oneOf([true]).required();
    })
  );
});

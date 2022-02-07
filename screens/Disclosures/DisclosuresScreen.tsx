import React from 'react';
import { isEmpty, mapValues } from 'lodash';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import {
  Screen,
  Heading3,
  BodySmall,
  Body,
  PIIForm,
  PatriotAct,
  AgreementCheckbox,
} from '../../components';
import { useAuth, useCompliance } from '../../contexts';
import { CustomerService } from '../../services';
import { Formik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import { defaultColors } from '../../constants/Colors';

const DisclosuresScreen = () => {
  const { accessToken, customer, setCustomer } = useAuth();

  const {
    patriotAccepted,
    error,
    setError,
    currentPendingDocs,
    submitAgreements,
    checkboxData,
    complianceIsLoading,
    workflow,
  } = useCompliance();


  const handlePIISubmit = async (values) => {
    try {
      const response = await CustomerService.updateCustomer(accessToken, customer.email, {
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

      setCustomer(response)
    } catch (err) {
      setError(err[0].title || 'An error has occured. Please try again later.');
    }
  };


  const renderScreen = () => {
    switch (workflow.summary.current_step) {
      case 1:
        return {
          title: 'Rize Disclosures',
          component: (
            <AgreementCheckbox currentDocs={currentPendingDocs} isLoading={complianceIsLoading} />
          ),
        };
      case 2:
        return {
          title: null,
          component: patriotAccepted ? (
            <PIIForm handleFormSubmit={handlePIISubmit} customer={customer} />
          ) : (
            <PatriotAct currentPendingDocs={currentPendingDocs} isLoading={complianceIsLoading} />
          ),
        };
      case 3:
        return {
          title: customer.dob ? 'Banking Disclosures' : null,
          component: customer.dob ? (
            <AgreementCheckbox currentDocs={currentPendingDocs} isLoading={complianceIsLoading} />
          ) : (
            <PIIForm handleFormSubmit={handlePIISubmit} customer={customer} />
          ),
        };
      default:
        return {
          title: null,
          component: (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <ActivityIndicator size="large" />
            </View>
          ),
        };
    }
  };

  const processing = ['queued', 'identity_verified', 'under_review'];
  const unapproved = ['manual_review', 'rejected'];
  const newCustomer = ['initiated', 'in_progress'];

  const KYCStatus = {
    notApproved: ['manual_review', 'denied'],
    processing: ['under_review'],
  };

  const CustomerStatus = {
    newCustomer: ['initiated'],
    notApproved: ['manual_review', 'rejected'],
    processing: ['queued', 'identity_verified', 'under_review'],
  };

  if (!isEmpty(checkboxData)) {
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
          enableReinitialize
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

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
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

import React from 'react';
import { isEmpty, mapValues } from 'lodash';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Screen, Heading3, BodySmall, Body } from '../../components';
import { useAuth } from '../../contexts';
import { CustomerService } from '../../services';
import { Formik } from 'formik';
import * as yup from 'yup';
import PIIForm from './PIIForm';
import Processing from './Processing';
import moment from 'moment';
import AgreementCheckbox from './AgreementCheckbox';
import { defaultColors } from '../../constants/Colors';

import useComplianceWorkflow from '../../hooks/useComplianceWorkflow';

const DisclosuresScreen = () => {
  const { accessToken, customer } = useAuth();

  const { currentStep, error, currentPendingDocs, submitAgreements, checkboxData, isLoading } =
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
      <View style={{ flex: 1 }}>
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
        <AgreementCheckbox currentDocs={currentPendingDocs} isLoading={isLoading} />
      </View>
    );
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
          component: customer.last_name ? (
            <PatriotAct />
          ) : (
            <PIIForm isLoading={isLoading} handleSubmit={handlePIISubmit} customer={customer} />
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

  const processing = ['queued', 'identity_verified', 'under_review'];
  const unapproved = ['manual_review', 'rejected'];

  if (processing.includes(customer.status)) {
    return <Processing />;
  }

  if (unapproved.includes(customer.status)) {
    return (
      <Screen withoutHeader>
        <Heading3 textAlign="center" style={{ marginTop: 100 }}>
          {`We're having issues with your account.`}
        </Heading3>
        <Body textAlign="center" style={{ marginTop: 20 }}>
          {`Please contact customer support for additional help.`}
        </Body>
      </Screen>
    );
  }

  if (!isEmpty(checkboxData) && customer.status === 'initiated') {
    return (
      <Screen withoutHeader>
        {!isEmpty(renderScreen().title) && (
          <Heading3 textAlign="center" style={styles.heading}>
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
  heading: {
    // marginBottom: 25,
    // flex: 1,
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

import React, { useEffect, useState } from 'react';
import { isEmpty, mapValues } from 'lodash';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import * as Network from 'expo-network';
import { Screen, Checkbox, Button, Heading3, BodySmall, Body } from '../../components';
import { useCompliance, useAuth } from '../../contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import {ComplianceWorkflowService, CustomerService} from '../../services';
import { defaultColors } from '../../constants/Colors';
import { Formik, Field } from 'formik';
import * as yup from 'yup';
import PIIForm from './PIIForm'
import Processing from './Processing';
import moment from 'moment';

const optionalRequiredSchema = yup.lazy((obj) => {
  return yup.object(
    mapValues(obj, () => {
      return yup.boolean().oneOf([true]).required();
    })
  );
});

export default function DisclosuresScreen({ navigation }: DisclosuresScreenProps): JSX.Element {
  const { complianceWorkflow, disclosures, setComplianceWorkflow, setDisclosures, steps } =
    useCompliance();
  const { accessToken, customer } = useAuth();

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

  const handleSubmit = async (values, actions) => {
    const ip_address = await Network.getIpAddressAsync();

    // type ObjectKeys<T> = T extends object
    //   ? (keyof T)[]
    //   : T extends number
    //   ? []
    //   : T extends Array<any> | string
    //   ? string[]
    //   : never;

    // interface ObjectConstructor {
    //   keys<T>(o: T): ObjectKeys<T>;
    // }

    const documents = Object.keys(values).map((document_uid) => {
      return {
        accept: 'yes',
        document_uid,
        ip_address,
        user_name: complianceWorkflow.customer.email,
      };
    });

    console.log(documents, 'documents');

    setIsSubmitting(true);

    try {
      const updatedComplianceWorkflow = await ComplianceWorkflowService.acknowledgeDocuments(
        accessToken,
        documents
      );
      setComplianceWorkflow(updatedComplianceWorkflow);

      setIsSubmitting(false);
      actions.resetForm()
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);

    }
  };

  
  
  const showPIIForm =
  complianceWorkflow?.summary.current_step === 3 && customer.last_name !== '';

  const RenderAgreements = () => {
    return (
      <>
        {complianceWorkflow.summary.current_step === 2 && <PatriotAct />}
        {!showPIIForm && <PIIForm handlePIISubmit={handlePIISubmit} />}

        {showPIIForm && (
          <View style={styles.checkboxesContainer}>
            {complianceWorkflow.current_step_documents_pending.map((agreement) => {
              return (
                <View style={styles.checkboxHolder} key={agreement.external_storage_name}>
                  <Field name="docs">
                    {({ field, form }) => {
                      return (
                        <Checkbox
                          checked={field.value}
                          onChange={(value) => form.setFieldValue(agreement.uid, value)}
                        />
                      );
                    }}
                  </Field>
                  <Body>
                    I agree to the <Body style={styles.underline}>{agreement.name}.</Body>
                  </Body>
                </View>
              );
            })}
          </View>
        )}
      </>
    );
  };
  const PatriotAct = () => {
    return (
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
    );
  };

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
      console.log(err, 'err in handlePIISubmit')
    }
    
  }

  const renderTitle = () => {
    switch (complianceWorkflow.summary.current_step) {
      case 1:
        return 'Rize Disclosures';
      case 2:
        return 'USA Patriot Act Notice';
      case 3:
        return showPIIForm ? 'Banking Disclosures' : ''
      default:
        return 'Default';
    }
  };

  // if(steps === 3) {
  //   return <Processing />
  // }
  

  if (!isEmpty(initValues)) {
    return (
      <Screen>
        <Heading3 textAlign="center" style={styles.heading}>
          {renderTitle()}
        </Heading3>

        <Formik
          initialValues={initValues}
          onSubmit={handleSubmit}
          validationSchema={optionalRequiredSchema}
          validateOnMount
        >
          {(formik) => (
            <>
              <RenderAgreements />

              {showPIIForm && (
                <View style={styles.footer}>
                  <BodySmall textAlign="center" style={{marginBottom: 20}}>
                    By clicking &quot;I Agree&quot; I have read and agreed to the Terms of Use,
                    Privacy Policy and E-sign Disclosures and Agreement.
                  </BodySmall>
                  <Button
                    title="I Agree"
                    disabled={!formik.isValid || isSubmitting}
                    onPress={formik.submitForm}
                    loading={isSubmitting}
                  />
                </View>
              )}
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

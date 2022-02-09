import React, { useState, useMemo } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { Formik, useFormikContext } from 'formik';
import { Button, Screen, Input, Dropdown, Checkbox } from '../../components';
import { Body, Heading3, Heading5 } from '../../components/Typography';
import { useBrokerageWorkflow } from '../../contexts/BrokerageWorkflow';
import { RootStackParamList } from '../../types';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/Auth';
import styles from './styles';
import RequiredSteps from '../../constants/BrokerageSteps';
import CustomerService from '../../services/CustomerService';
import { find, merge, get, map, isEmpty } from 'lodash';

interface BrokerageProductQuestionsScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'BrokerageProductQuestions'>;
}

export default function ({ navigation }: BrokerageProductQuestionsScreenProps): JSX.Element {
  const { brokerageWorkflow, brokerageProduct } = useBrokerageWorkflow();
  const { accessToken } = useAuth();
  const [step, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const onContinue = async (): Promise<void> => {
  //   navigation.push('ConfirmPII', { productType: BrokerageProductType })
  // };

  const currentStep = useMemo(() => {
    const questions = [];
    const productRequirements = get(brokerageProduct, 'profile_requirements', []);
    const currentStepQuestions = get(RequiredSteps, [step, 'questions'], []);

    for (const stepQuestion of currentStepQuestions) {
      const associatedQuestion = find(productRequirements, {
        profile_requirement: stepQuestion.name,
      });
      if (!associatedQuestion) continue;

      const question = merge(stepQuestion, associatedQuestion);
      questions.push(question);
    }

    return { ...RequiredSteps[step], questions: currentStepQuestions };
  }, [step, brokerageProduct]);

  const InputLabel = ({ question }) => (
    <>
      <Heading5 style={styles.questionLabel}>{question.profile_requirement}</Heading5>
      <Heading5 style={styles.questionContext}>{question.context}</Heading5>
      {question.note && <Body style={styles.questionNote}>{question.note}</Body>}
    </>
  );
  const FormInput = ({ value, question, onChange, onBlur }) => {
    const responses = get(question, 'response_values', []);
    const { setFieldValue } = useFormikContext<any>();

    if (responses && responses.includes('yes')) {
      if (!value) setFieldValue(question.profile_requirement_uid, 'no');
      const checked = value === 'yes';
      return (
        <Checkbox
          checked={checked}
          onChange={(value) =>
            setFieldValue(question.profile_requirement_uid, value ? 'yes' : 'no')
          }
        >
          <Body>{question.profile_requirement}</Body>
        </Checkbox>
      );
    } else if (!isEmpty(responses)) {
      const items = responses.map((value) => ({
        label: value,
        value: value,
      }));

      return (
        <>
          <InputLabel question={question} />
          <Dropdown
            items={items}
            value={value}
            placeholder={question.placeholder || ''}
            onChange={onChange}
            onBlur={onBlur}
            inputStyle={styles.input}
          />
        </>
      );
    } else {
      return (
        <>
          <InputLabel question={question} />
          <Input
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            required={question.required}
            inputStyle={styles.input}
          />
        </>
      );
    }
  };
  const renderCurrentStepForm = () => {
    const onSubmit = async (values, { resetForm }) => {
      setLoading(true);
      const data = map(values, (value, index) => ({
        profile_requirement_uid: index,
        profile_response: value,
      }));

      try {
        await CustomerService.updateCustomerProfileAnswers(accessToken, data);
        setCurrentStep((prevCount) => prevCount + 1);
        resetForm();
      } catch (err) {
        const firstError = get(err, ['data', 'errors', 0, 'title'], 'Something went wrong!');
        setError(firstError);
      } finally {
        setLoading(false);
      }
    };

    const validationSchema = useMemo(() => {
      const newObj = {};
      for (const stepQuestion of currentStep.questions) {
        newObj[stepQuestion.profile_requirement_uid] = stepQuestion.required
          ? Yup.string().required()
          : Yup.string();
      }

      return Yup.object().shape(newObj);
    }, [currentStep]);

    if (!brokerageWorkflow) {
      return <ActivityIndicator size="large" color="black" />;
    }

    return (
      <>
        <Heading3 textAlign="center" style={styles.heading}>
          {currentStep.header}
        </Heading3>

        {currentStep.subHeader && (
          <Heading5 style={styles.subHeading}>{currentStep.subHeader}</Heading5>
        )}
        <Formik initialValues={{}} onSubmit={onSubmit} validationSchema={validationSchema}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            isValid,
            setFieldValue,
            isSubmitting,
            dirty,
          }) => (
            <>
              <View style={styles.questionsContainer}>
                {!isEmpty(currentStep.questions) &&
                  currentStep.questions.map((question, index) => {
                    return (
                      <View key={index} style={styles.inputContainer}>
                        <FormInput
                          value={values[question.profile_requirement_uid]}
                          question={question}
                          onChange={handleChange(question.profile_requirement_uid)}
                          onBlur={handleBlur(question.profile_requirement_uid)}
                          setFieldValue={setFieldValue}
                        />
                      </View>
                    );
                  })}
              </View>

              {error && (
                <Heading5 textAlign="center" style={styles.errorContainer}>
                  {error}
                </Heading5>
              )}
              <Button
                title="Continue"
                loading={loading}
                disabled={!dirty || !isValid || isSubmitting}
                onPress={(): void => handleSubmit()}
              />
            </>
          )}
        </Formik>
      </>
    );
  };
  return <Screen useScrollView>{renderCurrentStepForm()}</Screen>;
}

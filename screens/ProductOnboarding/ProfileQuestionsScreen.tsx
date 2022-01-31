import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import { Button, Input, Screen } from '../../components';
import { RootStackParamList } from '../../types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useProducts } from '../../contexts/Products';
import { useAuth } from '../../contexts/Auth';
import { Heading3, Heading5 } from '../../components/Typography';
import {CustomerService} from '../../services';
import config from '../../config/config';
import { get, find, map } from 'lodash';

interface ProfileQuestionsScreenProps {
  route: RouteProp<RootStackParamList, 'ConfirmPII'>;
  navigation: StackNavigationProp<RootStackParamList, 'ConfirmPII'>;
}

export default function ProfileQuestionsScreen({
  route,
  navigation,
}: ProfileQuestionsScreenProps): JSX.Element {
  const brokerageProductUid = config.application.brokerageProductUid;
  const productId = get(route, ['params', 'productId'], brokerageProductUid);

  const { accessToken } = useAuth();
  const { products, getProducts } = useProducts();

  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  const product = find(products, { uid: productId });

  const styles = StyleSheet.create({
    heading: {
      marginBottom: 25,
    },
    container: {
      marginTop: 25,
    },
    inputContainer: {
      marginTop: 35,
      marginBottom: 30,
    },
    errorContainer: {
      marginBottom: 30,
      color: 'red',
    },
  });

  const onSubmit = async (values: any): Promise<void> => {
    setError(null);

    const data = map(values, (value, index) => ({
      profile_requirement_uid: index,
      profile_response: value,
    }));

    try {
      await CustomerService.updateCustomerProfileAnswers(accessToken, data);
      navigation.navigate('BrokerageDisclosures');
    } catch (err) {
      const firstError = get(err, ['data', 'errors', 0, 'extra'], 'Something went wrong!');
      setError(firstError);
    }
  };

  if (!product) return null;

  const defaultValues = product.profile_requirements
    .map((question) => question.profile_requirement_uid)
    .reduce((a, v) => ({ ...a, [v]: '' }), {});

  return (
    <Screen>
      <Heading3 textAlign="center" style={styles.heading}>
        Complete Your Financial Profile
      </Heading3>
      <Formik initialValues={defaultValues} onSubmit={onSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          errors,
          isValid,
          isSubmitting,
          dirty,
          touched,
        }) => (
          <>
            <View style={styles.inputContainer}>
              {product &&
                product.profile_requirements.map((question, index) => {
                  return (
                    <Input
                      key={index}
                      label={question.profile_requirement}
                      onChangeText={handleChange(question.profile_requirement_uid)}
                      onBlur={handleBlur(question.profile_requirement_uid)}
                      errorText={
                        !touched[question.profile_requirement_uid]
                          ? ''
                          : errors[question.profile_requirement_uid]
                      }
                      containerStyle={styles.inputContainer}
                      required={true}
                    />
                  );
                })}
            </View>

            {error && (
              <Heading5 textAlign="center" style={styles.errorContainer}>
                {error}
              </Heading5>
            )}
            <Button
              title="Submit"
              disabled={!dirty || !isValid || isSubmitting}
              onPress={(): void => handleSubmit()}
            />
          </>
        )}
      </Formik>
    </Screen>
  );
}

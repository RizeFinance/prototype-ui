import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Button, Screen, TextLink, Input } from '../../components';
import { Body, Heading3 } from '../../components/Typography';
import { Formik } from 'formik';
import { useAccounts } from '../../contexts/Accounts';
import { useAuth } from '../../contexts/Auth';
import { AccountService } from '../../services';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/core';
import { MessageStatus, RootStackParamList } from '../../types';
import { ConnectOneWayScreen as styles } from './styles';
import { get } from 'lodash';
import * as Yup from 'yup';

interface ConnectOneWayScreenProps {
  route: RouteProp<RootStackParamList, 'ConnectAccount'>;
  navigation: StackNavigationProp<RootStackParamList, 'ConnectAccount'>;
}

type OneWayAccountFields = {
  nickname: string;
  accountNumber: string;
  routingNumber: string;
};

const OutboundACH = 'outbound_ach';

const ConnectOneWayScreen = ({ navigation }: ConnectOneWayScreenProps): JSX.Element => {
  const { poolUids, refetchAccounts } = useAccounts();
  const { accessToken } = useAuth();
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TextLink onPress={() => navigation.navigate('ConnectAccount')}>
          &lt; Connect Account
        </TextLink>
      ),
    });
  }, [navigation]);

  const initialValues: OneWayAccountFields = {
    nickname: '',
    accountNumber: '',
    routingNumber: '',
  };

  const connectOneWayValidationSchema = Yup.object().shape({
    nickname: Yup.string().required('Nickname is required.'),
    accountNumber: Yup.string()
      .required('Account Number is required.')
      .min(8, 'Account Numbers must be 8 characters or more')
      .max(21, 'Account Number must be less than 22 alphanumeric characters.')
      .matches(/^[a-zA-Z0-9]+$/g, {
        excludeEmptyString: true,
        message: 'Account Number must only have alphanumeric characters.',
      }),
    routingNumber: Yup.string()
      .required('Routing Number is required.')
      .min(9, 'Routing Number must be 9 characters')
      .max(9, 'Routing Number must be 9 characters')
      .matches(/^[a-zA-Z0-9]+$/g, {
        excludeEmptyString: true,
        message: 'Routing Number must only have alphanumeric characters.',
      }),
  });

  const onSubmit = async (values: any): Promise<void> => {
    try {
      const types = await AccountService.getSyntheticAccountTypes(accessToken);
      const outboundType = types.data.find((x) => x.synthetic_account_category === OutboundACH);
      //Create synthetic account
      await AccountService.createSyntheticAccount({
        accessToken: accessToken,
        syntheticAccountTypeUid: outboundType.uid,
        poolUid: poolUids[0],
        name: values.nickname,
        routingNumber: values.routingNumber,
        accountNumber: values.accountNumber,
      });
      await refetchAccounts();
      navigation.navigate('ExternalAccounts', {
        status: MessageStatus.SUCCESS,
        copy: 'Account successfully added.',
      });
    } catch (err) {
      const apiError = get(
        err,
        ['data', 'errors', 0, 'detail'],
        'Something went wrong. Please contact us to resolve.'
      );
      navigation.navigate('ExternalAccounts', {
        status: MessageStatus.ERROR,
        copy: `Account was not added. \n ${apiError}`,
      });
    }
  };

  return (
    <Screen withoutHeader>
      <Heading3 textAlign="center" style={styles.heading}>
        Connect One-way Outgoing Transfer Account
      </Heading3>
      <Body>
        A One-way Outgoing Transfer account can receive money from an account at Rize. Money cannot
        be transferred from a One-way Outgoing Transfer Account to an account at Rize.
      </Body>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={connectOneWayValidationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
          isSubmitting,
          dirty,
          touched,
        }) => (
          <View style={{ marginVertical: 10 }}>
            <Input
              label="Account Nickname"
              value={values.nickname}
              onChangeText={handleChange('nickname')}
              onBlur={handleBlur('nickname')}
              errorText={!touched.nickname ? '' : errors.nickname}
            />
            <Input
              label="Account Number"
              value={values.accountNumber}
              onChangeText={handleChange('accountNumber')}
              onBlur={handleBlur('accountNumber')}
              errorText={!touched.accountNumber ? '' : errors.accountNumber}
              maxLength={21}
            />
            <Input
              label="Routing Number"
              value={values.routingNumber}
              onChangeText={handleChange('routingNumber')}
              onBlur={handleBlur('routingNumber')}
              errorText={!touched.routingNumber ? '' : errors.routingNumber}
              maxLength={9}
            />
            <Button
              title="Connect ACH Account"
              disabled={!dirty || !isValid}
              loading={isSubmitting}
              onPress={(): void => handleSubmit()}
              style={styles.connect}
            />
          </View>
        )}
      </Formik>
    </Screen>
  );
};

export default ConnectOneWayScreen;

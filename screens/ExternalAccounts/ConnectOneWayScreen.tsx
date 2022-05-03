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
import { RootStackParamList } from '../../types';
import { ConnectScreen as styles } from './styles';
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
  const { poolUids } = useAccounts();
  const { accessToken } = useAuth();
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TextLink onPress={() => navigation.push('ConnectAccount')}>
          &lt; External Accounts
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
      .matches(/^[a-zA-Z0-9]{1,21}$/g, {
        excludeEmptyString: true,
        message: 'Account Number must be up to 21 alphanumeric characters.',
      }),
    routingNumber: Yup.string()
      .required('Routing Number is required.')
      .matches(/^[a-zA-Z0-9]{1,9}$/g, {
        excludeEmptyString: true,
        message: 'Routing Number must be up to 9 alphanumeric characters.',
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
    } catch {
      //
      console.error('Account creation failed');
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
            />
            <Input
              label="Routing Number"
              value={values.routingNumber}
              onChangeText={handleChange('routingNumber')}
              onBlur={handleBlur('routingNumber')}
              errorText={!touched.routingNumber ? '' : errors.routingNumber}
            />
            <Button
              title="Connect ACH Account"
              disabled={!dirty || !isValid || isSubmitting}
              onPress={(): void => handleSubmit()}
            />
          </View>
        )}
      </Formik>
    </Screen>
  );
};

export default ConnectOneWayScreen;

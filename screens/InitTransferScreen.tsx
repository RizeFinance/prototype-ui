import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik, FormikHelpers, Field } from 'formik';
import { View, StyleSheet } from 'react-native';
import { Button, Dropdown, DropdownItem, Screen, Checkbox, MaskedInput } from '../components';
import { Body, Heading3, BodySmall } from '../components/Typography';
import { useAccounts, AccountType, useAuth } from '../contexts';
import { RootStackParamList } from '../types';
import * as Yup from 'yup';
import TransferService from '../services/TransferService';
import utils from '../utils/utils';
import { SyntheticAccount, SyntheticAccountCategory, Transfer } from '../models';
import Reference from 'yup/lib/Reference';

interface InitTransferScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'InitTransfer'>;
}

type TransferFields = {
  fromSyntheticAccountUid: string;
  toSyntheticAccountUid: string;
  amount: string;
  checked: boolean;
};

declare module 'yup' {
  interface StringSchema {
    validSourceAndDestination(
      liabilityAccounts: SyntheticAccount[],
      sourceSyntheticAccountUidRef: Reference<string>,
      destinationSyntheticAccountUidRef: Reference<string>,
      message: string
    ): StringSchema;
  }
  interface StringSchema {
    validSourceBalance(liabilityAccounts: SyntheticAccount[], message: string): StringSchema;
  }
  interface NumberSchema {
    amountWithinSourceBalance(
      sourceSyntheticAccountUidRef: Reference<string>,
      liabilityAccounts: SyntheticAccount[],
      message: string
    ): NumberSchema;
  }
}

Yup.addMethod(
  Yup.string,
  'validSourceAndDestination',
  function (
    liabilityAccounts: SyntheticAccount[],
    sourceSyntheticAccountUidRef: Reference<string>,
    destinationSyntheticAccountUidRef: Reference<string>,
    message: string
  ) {
    return this.test('validSourceAndDestination', message, function () {
      const sourceAccount = liabilityAccounts.find(
        (x) => x.uid === this.resolve(sourceSyntheticAccountUidRef)
      );

      const destinationAccount = liabilityAccounts.find(
        (x) => x.uid === this.resolve(destinationSyntheticAccountUidRef)
      );

      if (
        sourceAccount?.synthetic_account_category === 'plaid_external' &&
        destinationAccount?.synthetic_account_category === 'outbound_ach'
      ) {
        return false;
      }

      return true;
    });
  }
);

Yup.addMethod(
  Yup.string,
  'validSourceBalance',
  function (liabilityAccounts: SyntheticAccount[], message: string) {
    return this.test('validSourceBalance', message, function (value) {
      const liabilityAccount = liabilityAccounts.find((x) => x.uid === value);

      if (liabilityAccount && parseFloat(liabilityAccount.net_usd_available_balance) <= 0) {
        return false;
      }

      return true;
    });
  }
);

Yup.addMethod(
  Yup.number,
  'amountWithinSourceBalance',
  function (
    sourceSyntheticAccountUidRef: Reference<string>,
    liabilityAccounts: SyntheticAccount[],
    message: string
  ) {
    return this.test('amountWithinSourceBalance', message, function (value) {
      const liabilityAccount = liabilityAccounts.find(
        (x) => x.uid === this.resolve(sourceSyntheticAccountUidRef)
      );

      if (liabilityAccount && value > parseFloat(liabilityAccount.net_usd_available_balance)) {
        return false;
      }

      return true;
    });
  }
);

interface AccountDropdownItem extends DropdownItem {
  category: SyntheticAccountCategory;
}

enum MessageStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}
interface MessageState {
  status?: MessageStatus;
  copy?: string;
}

export default function InitTransferScreen({ navigation }: InitTransferScreenProps): JSX.Element {
  const { accessToken } = useAuth();
  const { refetchAccounts, liabilityAccounts, externalAccounts } = useAccounts();

  const syntheticAccounts = [...liabilityAccounts, ...externalAccounts];
  const accountItems = syntheticAccounts.map(
    (account) =>
      ({
        label:
          account.name +
          (['plaid_external', 'external', 'outbound_ach'].includes(
            account.synthetic_account_category
          )
            ? ''
            : ` (${utils.formatCurrency(account.net_usd_available_balance)})`),
        value: account.uid,
        category: account.synthetic_account_category,
      } as AccountDropdownItem)
  );

  const eligibleSourceAccounts = accountItems.filter(
    (account) => account.category !== 'outbound_ach'
  );

  const eligibleDestinationAccounts = accountItems;

  const [message, setMessage] = useState<MessageState>({});
  const [loading, setLoading] = useState(false);

  const styles = StyleSheet.create({
    heading: {
      marginTop: 24,
      marginBottom: 24,
    },
    marginVertical10: {
      marginVertical: 10,
    },
    inputs: {
      marginVertical: 8,
    },
    submitButton: {
      marginTop: 30,
    },
    connectStatusMessage: {
      marginVertical: 8,
    },
  });

  const initialValues: TransferFields = {
    fromSyntheticAccountUid: '',
    toSyntheticAccountUid: '',
    amount: null,
    checked: false,
  };

  const isBrokerageAccount = (selectedUid) => {
    const account = liabilityAccounts.find(
      (liabilityAccount) => liabilityAccount.uid === selectedUid
    );
    return account && account.synthetic_account_category === AccountType.target_yield_account;
  };

  const transferValidationSchema = Yup.object().shape({
    fromSyntheticAccountUid: Yup.string()
      .required('Source account is required.')
      .validSourceBalance(liabilityAccounts, 'Source account does not have enough balance.'),
    toSyntheticAccountUid: Yup.string()
      .required('Destination account is required.')
      .validSourceAndDestination(
        syntheticAccounts,
        Yup.ref<string>('fromSyntheticAccountUid'),
        Yup.ref<string>('toSyntheticAccountUid'),
        'Cannot perform a transfer between two external accounts'
      )
      .not(
        [Yup.ref('fromSyntheticAccountUid'), null],
        'Source should not be the same as the destination.'
      ),
    amount: Yup.number()
      .required('Amount is required.')
      .typeError('Invalid amount.')
      .moreThan(0, 'Amount should be greater than 0.')
      .amountWithinSourceBalance(
        Yup.ref<string>('fromSyntheticAccountUid'),
        liabilityAccounts,
        'Amount should not be greater than the source account balance.'
      ),
    checked: Yup.boolean().when('toSyntheticAccountUid', (value, schema) => {
      if (isBrokerageAccount(value)) {
        return Yup.boolean().oneOf([true]).default(false).required();
      }
      return schema;
    }),
  });

  useEffect(() => {
    refetchAccounts();
  }, [refetchAccounts]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await refetchAccounts();
    });

    return unsubscribe;
  }, [navigation, refetchAccounts]);

  const handleSetMessage = (newTransfer?: Transfer, error?: Error): void => {
    const destinationAccount = syntheticAccounts.find(
      (account) => account.uid === newTransfer?.destination_synthetic_account_uid
    );
    const isDestinationExternal = ['external', 'plaid_external', 'outbound_ach'].includes(
      destinationAccount?.synthetic_account_category
    );

    if (error) {
      setMessage({ status: MessageStatus.ERROR, copy: 'Transfer Failed' });
    } else if (isDestinationExternal) {
      setMessage({
        status: MessageStatus.SUCCESS,
        copy: 'Transfer Successful \n It can take up to 3 business days for the transaction to settle in the destination account.',
      });
    } else if (destinationAccount) {
      setMessage({
        status: MessageStatus.SUCCESS,
        copy: 'Transfer Successful.',
      });
    } else {
      setMessage({});
    }

    return;
  };

  const onSubmit = async (
    values: TransferFields,
    actions: FormikHelpers<TransferFields>
  ): Promise<void> => {
    handleSetMessage();
    setLoading(true);
    try {
      const newTransfer = await TransferService.initiateTransfer(
        accessToken,
        values.fromSyntheticAccountUid,
        values.toSyntheticAccountUid,
        values.amount.toString()
      );

      handleSetMessage(newTransfer);
      setLoading(false);
    } catch (err) {
      handleSetMessage(undefined, err);
      setLoading(false);
    } finally {
      refetchAccounts();
      actions.resetForm();
    }
  };

  return (
    <Screen withoutHeader>
      <Heading3 textAlign="center" style={styles.heading}>
        Transfer
      </Heading3>
      {message.status && (
        <Body
          color={message.status}
          textAlign="center"
          fontWeight="semibold"
          style={styles.connectStatusMessage}
        >
          {message.copy}
        </Body>
      )}

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={transferValidationSchema}
      >
        {({
          handleBlur,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
          values,
          errors,
          isValid,
          isSubmitting,
          dirty,
          touched,
        }) => (
          <>
            <View style={styles.marginVertical10}>
              <Dropdown
                label="From"
                placeholder="Select Account"
                items={eligibleSourceAccounts}
                value={values.fromSyntheticAccountUid}
                onChange={(value) => {
                  if (value) {
                    setFieldValue('fromSyntheticAccountUid', value);
                    setFieldTouched('fromSyntheticAccountUid', true, false);
                  }
                }}
                errorText={!touched.fromSyntheticAccountUid ? '' : errors.fromSyntheticAccountUid}
                containerStyle={styles.inputs}
              />
              <Dropdown
                label="To"
                placeholder="Select Account"
                items={eligibleDestinationAccounts}
                value={values.toSyntheticAccountUid}
                onChange={(value) => {
                  if (value) {
                    setFieldValue('toSyntheticAccountUid', value);
                    setFieldTouched('toSyntheticAccountUid', true, false);
                  }
                }}
                errorText={!touched.toSyntheticAccountUid ? '' : errors.toSyntheticAccountUid}
                containerStyle={styles.inputs}
              />
              <Field name="amount">
                {({ field: { value, name }, form: { touched, errors, setFieldValue } }) => (
                  <>
                    <MaskedInput
                      label="Amount"
                      type={'money'}
                      options={{
                        precision: 2,
                        separator: '.',
                        delimiter: ',',
                        unit: '$',
                      }}
                      placeholder="$0.00"
                      value={value}
                      onChangeText={(_text: string, rawText: string) => {
                        setFieldValue(name, rawText);
                      }}
                      errorText={!touched.amount ? '' : errors.amount}
                      onBlur={handleBlur('amount')}
                    />
                  </>
                )}
              </Field>
            </View>

            {isBrokerageAccount(values.toSyntheticAccountUid) && (
              <Checkbox
                onChange={(value) => setFieldValue('checked', value)}
                checked={values.checked}
              >
                <BodySmall style={{ marginBottom: 10 }} fontWeight="semibold">
                  By proceeding with this transfer, I am acknowledging that as a consumer I am aware
                  that my brokerage account with YieldX:
                </BodySmall>
                <BodySmall fontWeight="semibold" style={styles.marginVertical10}>
                  &#8226; is NOT insured by the FDIC
                </BodySmall>
                <BodySmall fontWeight="semibold" style={styles.marginVertical10}>
                  &#8226;{' '}
                  {
                    'is NOT a desposit or other obligation and is NOT guaranteed by Lewis & Clark Bank, where my deposit account is held'
                  }
                </BodySmall>
                <BodySmall style={{ marginTop: 10 }} fontWeight="semibold">
                  &#8226; is subject to investment risks, including possible loss of the principal
                  investment
                </BodySmall>
              </Checkbox>
            )}
            <Button
              title="Send Transfer"
              disabled={!dirty || !isValid || isSubmitting}
              onPress={(): void => handleSubmit()}
              style={styles.submitButton}
              loading={loading}
            />
          </>
        )}
      </Formik>
    </Screen>
  );
}

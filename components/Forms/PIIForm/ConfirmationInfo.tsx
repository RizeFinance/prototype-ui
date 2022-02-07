import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Body, TextLink, Heading3, Button } from '../..';
import { defaultColors } from '../../../constants/Colors';
import { isEmpty } from 'lodash';
import moment from 'moment';

interface IConfirmationInfo {
  customerInfo: CustomerDetails | NewCustomerDetails;
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  hasBeenUpdated: boolean;
  handleSubmit: any;
}

const ConfirmationInfo = ({ customerInfo, setShowConfirm, hasBeenUpdated, handleSubmit }: IConfirmationInfo) => {

  if (isEmpty(customerInfo)) {
    return <ActivityIndicator size="large" />;
  } else {
    return (
      <>
        <View style={{ paddingHorizontal: 20 }}>
          <Heading3 textAlign="center" style={styles.heading}>
            {'Confirm Your Personal Information'}
          </Heading3>
          <Body>&nbsp;</Body>
          <Body>&nbsp;</Body>
          <Body fontWeight="semibold">First name</Body>
          <Body style={{ color: defaultColors.gray }}>{customerInfo.first_name}</Body>
          <Body>&nbsp;</Body>
          {customerInfo.middle_name && (
            <>
              <Body fontWeight="semibold">Middle name</Body>
              <Body style={{ color: defaultColors.gray }}>{customerInfo.middle_name}</Body>
              <Body>&nbsp;</Body>
            </>
          )}
          <Body fontWeight="semibold">Last name</Body>
          <Body style={{ color: defaultColors.gray }}>{customerInfo.last_name}</Body>
          <Body>&nbsp;</Body>
          {customerInfo.suffix && (
            <>
              <Body fontWeight="semibold">Suffix</Body>
              <Body style={{ color: defaultColors.gray }}>{customerInfo.suffix}</Body>
              <Body>&nbsp;</Body>
            </>
          )}
          <Body fontWeight="semibold">Date of Birth</Body>
          <Body style={{ color: defaultColors.gray }}>
            {moment(customerInfo.dob).format('MM/DD/YYYY')}
          </Body>
          <Body>&nbsp;</Body>

          <Body fontWeight="semibold">Address</Body>
          <Body style={{ color: defaultColors.gray }}>{customerInfo.street1}</Body>

          {customerInfo.street2 && (
            <Body style={{ color: defaultColors.gray }}>{customerInfo.street2}</Body>
          )}

          <Body
            style={{ color: defaultColors.gray }}
          >{`${customerInfo.city}, ${customerInfo.state} ${customerInfo.postal_code}`}</Body>
          <Body>&nbsp;</Body>
          <Body fontWeight="semibold">Phone Number</Body>
          <Body style={{ color: defaultColors.gray }}>{customerInfo.phone}</Body>
          <Body>&nbsp;</Body>
          <Body fontWeight="semibold">Social Security Number</Body>
          <Body style={{ color: defaultColors.gray }}>
            {customerInfo.ssn_last_four || customerInfo.ssn}
          </Body>
          <Body>&nbsp;</Body>
          {/* {productType === ProductType.Checking && ( */}
          <TextLink textAlign="center" onPress={() => setShowConfirm(false)}>
            {customerInfo.last_name ? 'Revise Information' : 'Edit Information'}
          </TextLink>
        </View>

        <Button
          title="Confirm Information"
          onPress={() => (hasBeenUpdated ? handleSubmit() : setShowConfirm(true))}
          style={styles.submitButton}
        />
      </>
    );
  }
};

export default ConfirmationInfo;

export interface CustomerDetails {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  phone: string;
  ssn_last_four: string;
  dob: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  postal_code: string;
}

export type NewCustomerDetails = Exclude<CustomerDetails, 'ssn_last_four'> & { ssn: string };

const styles = StyleSheet.create({
  heading: {
    marginBottom: 10,
    flex: 0,
  },
  formGroup: {
    marginVertical: 10,
  },
  submitButton: {
    marginTop: 30,
  },
});

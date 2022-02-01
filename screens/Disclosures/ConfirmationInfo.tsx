import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Body, TextLink, Heading3, Button } from '../../components';
import { defaultColors } from '../../constants/Colors';
import { isEmpty } from 'lodash';

const ConfirmationInfo = ({ customerInfo, setInEditMode }) => {

  
  if (isEmpty(customerInfo)) {
    return <ActivityIndicator size="large" />;
  } else {
    return (
      <View>
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
        <Body style={{ color: defaultColors.gray }}>{customerInfo.dob}</Body>
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
        <Body style={{ color: defaultColors.gray }}>{customerInfo.ssn ?? '*** ** ****'}</Body>
        <Body>&nbsp;</Body>
        {/* {productType === ProductType.Checking && ( */}
        <TextLink style={{ marginVertical: 50 }} textAlign="center" onPress={() => setInEditMode(true)}>
          {customerInfo.last_name ? 'Revise Information' : 'Edit Information'}
        </TextLink>

        <Button
          title='Confirm Information'
          onPress={() => (showConfirm ? handleSubmit() : setShowConfirm(true))}
          style={styles.submitButton}
        />
      </View>
    );
  }
};

export default ConfirmationInfo;

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
  editButton: {
    textDecorationLine: 'underline',
    textDecorationColor: defaultColors.primary,
    color: defaultColors.primary,
    marginTop: 20,
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
});

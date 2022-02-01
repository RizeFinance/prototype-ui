import React from 'react';
import { View } from 'react-native';
import { BodySmall, Button } from '../../components';
import { useFormikContext } from 'formik';

const AgreementButton = ({ currentPendingDocs, isLoading }) => {
  const { isValid, submitForm } = useFormikContext();

  const renderAgreement = () => {
    const agreementNames = currentPendingDocs.map((doc) => doc.name);
    const numNames = agreementNames.length;

    if (numNames === 1) return agreementNames[0];
    if (numNames === 2) return `${agreementNames[0]} and ${agreementNames[1]}`;
    if (numNames >= 3) {
      agreementNames[numNames - 1] = `and ${agreementNames[numNames - 1]} `;
      return agreementNames.join(', ');
    }
  };

  return (
    <View>
      <BodySmall
        textAlign="center"
        style={{ marginBottom: 20, maxWidth: '40ch', alignSelf: 'center' }}
      >
        {`By clicking "I Agree" I have read and agreed to the ${renderAgreement()} `}
      </BodySmall>
      <Button
        title="I Agree"
        disabled={!isValid || isLoading}
        onPress={submitForm}
        loading={isLoading}
      />
    </View>
  );
};

export default AgreementButton;

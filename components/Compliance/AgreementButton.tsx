import React from 'react';
import { View } from 'react-native';
import { BodySmall, Button } from '..';
import { useFormikContext } from 'formik';
import { ComplianceDocument } from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs';

const AgreementButton = ({ currentPendingDocs, isLoading }: IAgreementButton) => {
  const { isValid, submitForm } = useFormikContext();

  const renderAgreement = () => {
    const agreementNames = currentPendingDocs.map((doc) => doc.name);
    const numNames = agreementNames.length;

    if (numNames === 1) return agreementNames[0];
    if (numNames === 2) return `${agreementNames[0]} and ${agreementNames[1]}`;
    if (numNames >= 3) {
      agreementNames[numNames - 1] = `and the ${agreementNames[numNames - 1]}`;
      return agreementNames.join(', ');
    }
  };

  return (
    <View>
      <BodySmall
        textAlign="center"
        style={{ marginBottom: 20, alignSelf: 'center' }}
      >
        {`By clicking "I Agree" I have read and agreed to the ${renderAgreement()}.`}
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

interface IAgreementButton {
  currentPendingDocs: ComplianceDocument[];
  isLoading: boolean;
}

export default AgreementButton;

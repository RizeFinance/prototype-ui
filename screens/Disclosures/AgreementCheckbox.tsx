import React from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { defaultColors } from '../../constants/Colors';
import { useFormikContext } from 'formik';
import { Checkbox, Body } from '../../components';
import { useNavigation } from '@react-navigation/native';
import AgreementButton from './AgreementButton';
import { ComplianceDocument } from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs'

interface IAgreementCheckbox {
  currentDocs: ComplianceDocument[],
  isLoading: boolean
}

const AgreementCheckbox = ({ currentDocs, isLoading }: IAgreementCheckbox) => {
  const { values, setFieldValue } = useFormikContext();
  const navigation = useNavigation();

  const onPressButton = (link: string): void => {
    navigation.navigate('PDFReader', {
      url: link,
    });
  };

  if (currentDocs) {
    return (
      <>
        <View style={styles.checkboxesContainer}>
          {currentDocs?.map((agreement) => {
            return (
              <View style={styles.checkboxHolder} key={agreement.external_storage_name}>
                <Pressable onPress={() => onPressButton(agreement.compliance_document_url)}>
                  <Checkbox
                    checked={values[agreement.uid]}
                    onChange={(value) => setFieldValue(agreement.uid, value)}
                  />
                </Pressable>
                <Body>
                  I agree to the <Body style={styles.underline}>{agreement.name}.</Body>
                </Body>
              </View>
            );
          })}
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <AgreementButton currentPendingDocs={currentDocs} isLoading={isLoading} />
        </View>
      </>
    );
  } else {
    <ActivityIndicator size="large" />;
  }
};

export default AgreementCheckbox;

const styles = StyleSheet.create({
  checkboxHolder: {
    marginBottom: 15,
    flexDirection: 'row',
    flex: 1,
  },
  checkboxesContainer: {
    // marginBottom: 40,
    // flex: 9,
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationColor: defaultColors.primary,
    cursor: 'pointer',
  },
});

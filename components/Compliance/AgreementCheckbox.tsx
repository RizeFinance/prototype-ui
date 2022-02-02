import React from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { defaultColors } from '../../constants/Colors';
import { useFormikContext } from 'formik';
import { Checkbox, Body } from '..';
import { useNavigation } from '@react-navigation/native';
import AgreementButton from './AgreementButton';
import { ComplianceDocument } from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs';

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
        <View>
          <AgreementButton currentPendingDocs={currentDocs} isLoading={isLoading} />
        </View>
      </>
    );
  } else {
    <ActivityIndicator style={{ flex: 1 }} size="large" />;
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
    flex: 1,
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationColor: defaultColors.primary,
    cursor: 'pointer',
  },
});

interface IAgreementCheckbox {
  currentDocs: ComplianceDocument[];
  isLoading: boolean;
}

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
                <Checkbox
                  checked={values[agreement.uid]}
                  onChange={(value) => setFieldValue(agreement.uid, value)}
                />
                <Pressable onPress={() => onPressButton(agreement.compliance_document_url)}>
                  <Body style={styles.text}>
                    I agree to the <Body style={styles.underline}>{agreement.name}.</Body>
                  </Body>
                </Pressable>
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
    <View style={styles.loading}>
      <ActivityIndicator size="large" />;
    </View>;
  }
};

export default AgreementCheckbox;

const styles = StyleSheet.create({
  checkboxHolder: {
    marginBottom: 15,
    flexDirection: 'row',
  },
  text: {
    width: 350,
  },
  checkboxesContainer: {
    flex: 1,
    flexWrap: 'wrap',
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationColor: defaultColors.primary,
    cursor: 'pointer',
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
});

interface IAgreementCheckbox {
  currentDocs: ComplianceDocument[];
  isLoading: boolean;
}

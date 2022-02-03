import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Heading3, Heading4, Body, TextLink, Screen } from '../components';
import utils from '../utils/utils';
import { useCompliance } from '../contexts';
import { ComplianceDocument } from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs';

export default function AgreementScreen(): JSX.Element {
  const { acceptedDocuments } = useCompliance();

  const onPressAgreementName = async (document: ComplianceDocument) => {
    window.open(document.compliance_document_url, '_blank');
  };

  return (
    <Screen>
      <Heading3 textAlign="center" style={styles.heading}>
        Agreements
      </Heading3>

      {acceptedDocuments.length > 1 ? (
        <View style={styles.container}>
          {acceptedDocuments.map((document: ComplianceDocument) => {
            return (
              <View style={styles.agreementInfo} key={document.uid}>
                <TextLink
                  textAlign="center"
                  style={styles.agreementName}
                  onPress={() => onPressAgreementName(document)}
                  fontType={Heading4}
                >
                  {document.name}
                </TextLink>
                <Body fontWeight="semibold" textAlign="center">
                  Acknowledged {utils.formatDate(document.accepted_at)}
                </Body>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: 25,
  },
  container: {
    marginTop: 25,
    alignItems: 'center',
  },
  agreementInfo: {
    marginVertical: 16,
  },
  agreementName: {
    marginBottom: 8,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
});

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Screen from '../components/Screen';
import { useCompliance, ComplianceDocumentSelection } from '../contexts/ComplianceWorkflow';
import TextLink from '../components/TextLink';
import { Heading3, Heading4, Body } from '../components/Typography';
import { isEmpty } from 'lodash';
import utils from '../utils/utils';

interface AgreementInfoProps {
  agreement: ComplianceDocumentSelection;
}

export default function AgreementScreen(): JSX.Element {
  const { productAgreements, loadAgreements } = useCompliance();

  // useEffect(() => {
  //   loadAgreements();
  // }, []);

  const styles = StyleSheet.create({
    heading: {
      marginBottom: 25,
    },
    container: {
      marginTop: 25,
    },
    agreementInfo: {
      marginVertical: 16,
    },
    agreementName: {
      marginBottom: 8,
    },
  });

  const onPressAgreementName = async (agreement: ComplianceDocumentSelection) => {
    window.open(agreement.compliance_document_url, '_blank');
  };

  const AgreementInfo = ({ agreement }: AgreementInfoProps): JSX.Element => {
    return (
      <View style={styles.agreementInfo}>
        <TextLink
          textAlign="center"
          style={styles.agreementName}
          onPress={() => onPressAgreementName(agreement)}
          fontType={Heading4}
        >
          {agreement.name}
        </TextLink>
        <Body fontWeight="semibold" textAlign="center">
          Acknowledged {utils.formatDate(agreement.accepted_at)}
        </Body>
      </View>
    );
  };

  return (
    <Screen>
      <Heading3 textAlign="center" style={styles.heading}>
        Agreements
      </Heading3>

      {!isEmpty(productAgreements) && (
        <View style={styles.container}>
          {productAgreements.map((productAgreement) => {
            return (
              <>
                {productAgreement.productName && (
                  <Heading4 textAlign="center">{productAgreement.productName}</Heading4>
                )}
                {productAgreement.agreements.map((agreement, i) => {
                  return <AgreementInfo key={i} agreement={agreement} />;
                })}
              </>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

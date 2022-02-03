import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Heading3, Body, AgreementCheckbox } from '../..';
import { ComplianceDocument } from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs';

const PatriotAct = ({ currentPendingDocs, isLoading }: IPatroitAct) => {
  return (
    <View style={{ flex: 1 }}>
      <Heading3 textAlign="center" style={{ marginBottom: 50 }}>
        USA Patriot Act Notice
      </Heading3>
      <View style={styles.content}>
        <Body fontWeight="semibold" style={styles.title}>
          Important Information About Procedures for Opening a New Account
        </Body>

        <Body style={{ marginBottom: 25 }}>
          To help the government fight the funding of terrorism and money laundering activities,
          Federal law requires all financial institutions to obtain, verify, and record information
          that identifies each person who opens an account.
        </Body>

        <Body fontWeight="semibold" style={{ marginBottom: 5 }}>
          What this means for you:
        </Body>
        <Body>
          When you open an account, we will ask for your name, address, date of birth, and other
          information that will allow us to identify you. We may also ask to see your driver&apos;s
          license or other identifying documents.
        </Body>
      </View>
      <AgreementCheckbox currentDocs={currentPendingDocs} isLoading={isLoading} />
    </View>
  );
};

interface IPatroitAct {
  currentPendingDocs: ComplianceDocument[];
  isLoading: boolean;
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    marginBottom: 25,
  },
  title: {
    textAlign: 'center',
    marginBottom: 25,
  },
});

export default PatriotAct;

import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/native';
import Screen from '../components/Screen';
import { useComplianceWorkflow } from '../contexts/ComplianceWorkflow';
import { RootStackParamList } from '../types';
import TextLink from '../components/TextLink';
import { Heading3, Heading4, Body } from '../components/Typography';
import utils from '../utils/utils';

interface AgreementScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'Agreements'>;
}

interface AgreementInfoProps {
    agreement: any;
}

export default function AgreementScreen({ navigation }: AgreementScreenProps): JSX.Element {
    const {
      agreements,
      loadAgreements
    } = useComplianceWorkflow();

    useEffect(() => {
      loadAgreements();
    }, []);

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
        }
    });

    const onPressAgreementName = async (agreement: any): void => {
        window.open(agreement.compliance_document_url, "_blank");
    };

    const AgreementInfo = ({ agreement }: AgreementInfoProps): JSX.Element => {
        return (
            <View style={styles.agreementInfo}>
                <TextLink
                    textAlign='center'
                    style={styles.agreementName}
                    onPress={(): void => onPressAgreementName(agreement)}
                    fontType={Heading4}
                >
                  { agreement.name}
                </TextLink>
                <Body fontWeight='semibold' textAlign='center'>
                    Acknowledged {utils.formatDate(agreement.accepted_at)}
                </Body>
                
            </View>
        );
    };

    return (
        <Screen>
          <Heading3 textAlign='center' style={styles.heading}>
            Statements
          </Heading3>

          { agreements.length &&
            <View style={styles.container}>
                { agreements.map((agreement, i) => (
                  <AgreementInfo key={i} agreement={agreement} />
                ))}
            </View>
          }
        </Screen>
    );
};

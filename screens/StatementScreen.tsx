import React, { useEffect, useState }  from 'react';
import { StyleSheet, Platform, View, ActivityIndicator } from 'react-native';
import Modal from 'modal-react-native-web';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from '../components/Button';
import Screen from '../components/Screen';
import { Heading3, Heading4,  Body } from '../components/Typography';
import { RootStackParamList } from '../types';
import { useDocuments } from '../contexts/Documents';
import { Document } from '../models';
import TextLink from '../components/TextLink';
import utils from '../utils/utils';

interface StatementScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Statements'>;
}

interface DocumentInfoProps {
    document: Document;
}

export default function StatementScreen({ navigation }: StatementScreenProps): JSX.Element {
    const {
      isLoading,
      getDocuments,
      viewDocument,
      documents
    } = useDocuments();

    const [isDownloading, setDownloading] = useState<boolean>(false);

    useEffect(() => {
      getDocuments();
    }, []);

    const styles = StyleSheet.create({
        heading: {
            marginBottom: 25,
        },
        container: {
            marginTop: 25,
        },
        documentInfo: {
          marginVertical: 16,
        },
        documentName: {
          marginBottom: 8,
        }
    });

    const onPressDocumentName = async (document: Document): void => {
        setDownloading(true)

        const viewableDocument = await viewDocument(document.uid)
        window.open("data:application/octet-stream;base64," + viewableDocument.base_64);
        
        setDownloading(false)
    };

    const DocumentInfo = ({ document }: DocumentInfoProps): JSX.Element => {
        return (
            <View style={styles.documentInfo}>
                <TextLink
                    textAlign='center'
                    style={styles.documentName}
                    onPress={(): void => onPressDocumentName(document)}
                    fontType={Heading4}
                >
                    {utils.formatDate(document.period_ended_at, { month: 'long', year: 'numeric' })} Statement
                </TextLink>
            </View>
        );
    };

    return (
        <Screen>
          <Heading3 textAlign='center' style={styles.heading}>
            Statements
          </Heading3>

          { isLoading &&
              <View style={styles.container}>
                  <ActivityIndicator size='large' />
                  <Heading3 textAlign='center' style={styles.container}>
                    We&apos;re loading your statements.
                  </Heading3>
              </View>
          }

          { isDownloading &&
              <View style={styles.container}>
                  <ActivityIndicator size='large' />
                  <Heading3 textAlign='center' style={styles.container}>
                    Downloading...
                  </Heading3>
              </View>
          }

          { !isDownloading && documents.length &&
            <View style={styles.container}>
                { documents.map((document, i) => (
                  <DocumentInfo key={i} document={document} />
                ))}
            </View>
          }
        </Screen>
    );
};

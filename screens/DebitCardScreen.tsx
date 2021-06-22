import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Switch, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screen, Input, Button, Dropdown } from '../components';
import { Heading3, Heading5, Body } from '../components/Typography';
import TextLink from '../components/TextLink';
import { useDebitCards } from '../contexts/DebitCards';
import { useAccounts } from '../contexts/Accounts';
import { isEmpty, capitalize, isNil, some } from 'lodash';
import utils from '../utils/utils';

interface DebitCardScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'DebitCard'>;
}

export default function DebitCardScreen({ navigation }: DebitCardScreenProps): JSX.Element {
    const { 
        isLoading, 
        debitCards, 
        refetchDebitCards, 
        lockDebitCard, 
        unlockDebitCard, 
        reissueDebitCard, 
        createDebitCard 
    } = useDebitCards();

    const { liabilityAccounts, refetchAccounts } = useAccounts();

    const displayStatus = ['normal', 'queued', 'shipped'];
    const activeCard = debitCards.find(x => displayStatus.includes(x.status) && isNil(x.closed_at));
    const associatedAccount = liabilityAccounts.find(x => x.uid === activeCard?.synthetic_account_uid);
    const isCardActive = ['normal', 'shipped'].includes(activeCard?.status);

    const [isLoadingNewCard, setLoadingNewCard] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const toggleSwitch = () => setIsLocked(previousState => !previousState);

    const alertDefault = { text: null, success: true };
    const [alert, setAlert] = useState(alertDefault);

    const [reissueReason, setReissueReason] = useState();
    const [reissueComment, setReissueComment] = useState();


    useEffect(() => {
        refetchDebitCards();
        refetchAccounts();
    }, []);

    useEffect(() => {
        activeCard && setIsLocked(!!activeCard?.locked_at);
    }, [activeCard]);

    useEffect(() => {
        if (!activeCard?.uid) return;

        let response;

        (async () => {
            if (isLocked) {
                response = await lockDebitCard(activeCard?.uid);
            } else if (!isLocked === !!activeCard?.locked_at) {
                response = await unlockDebitCard(activeCard?.uid);
            }

            if (!response) return;

            const { success } = response;
            const text = success ? `Card has been ${isLocked ? 'locked' : 'unlocked'}.` : `Card failed to ${isLocked ? 'lock' : 'unlock'}.`;
            setAlert({ text, success });
        })();
    }, [isLocked]);

    const styles = StyleSheet.create({
        heading: {
            marginBottom: 25,
        },
        loading_heading: {
            marginTop: 25,
        },
        success: {
            color: '#2ecc71',
            marginBottom: 25,
        },
        failed: {
            color: '#e74c3c',
            marginBottom: 25,
        },
        container: {
            marginTop: 25,
        },
        row: {
            flexDirection: 'row',
            marginBottom: 35,
        },
        column: {
            flex: 1,
        },
        columnHeading: {
            marginBottom: 5,
        },
        switchContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        switch: {
            marginRight: 10,
        },
        input: {
            marginBottom: 15,
        },
        reissueContainer: {
            borderTopColor: 'black',
            borderTopWidth: 1,
            paddingTop: 40,
            marginTop: 60,
            marginBottom: 15,
        }
    });

    
    const onPressAccountName = (accountUid: string): void => {
        navigation.navigate('AccountDetails', {
            accountUid: accountUid
        });
    };

    const handleSubmitReissue = async () => {
        const { success } = await reissueDebitCard(activeCard?.uid, reissueReason);
        const text = success ? 'New card has been successfully requested.' : 'Request for new card failed.';
        setAlert({ text, success });

        if (reissueReason !== 'damaged') {
            setLoadingNewCard(true);
            refreshDebitCardPeriodically();
        }
    };

    const handleSubmitRequest = async () => {
        const { pool_uid } = liabilityAccounts.find(x => x.master_account);

        if (!pool_uid) {
            setAlert({ text: 'Need account to create card.', success: false });
            return;
        }

        const { success } = await createDebitCard(pool_uid);
        const text = success ? 'Card requested successfully.' : 'Card request failed.';
        setAlert({ text, success });
        refreshDebitCardPeriodically();
    };

    const refreshDebitCardPeriodically = async (): Promise<void> => {
        const { data: debitCards }  = await refetchDebitCards();

        const readyCards = debitCards.filter(c => !!c.card_last_four_digit && !c.closed_at);
        if (!isEmpty(readyCards)) {
            setLoadingNewCard(false);
            return;
        }

        setTimeout(() => {
            refreshDebitCardPeriodically();
        }, 5000);
    };

    const debitCardReasons = [
        { label: 'Lost', value: 'lost' },
        { label: 'Damaged', value: 'damaged' },
        { label: 'Stolen', value: 'stolen' },
    ];

    return (
        <Screen>
            <Heading3 textAlign='center' style={styles.heading}>
              Debit Card
            </Heading3>

            <Body textAlign='center' fontWeight='bold' style={alert.success ? styles.success : styles.failed}>
                {alert.text}
            </Body>

            { isLoadingNewCard &&
              <View style={styles.container}>
                  <ActivityIndicator size='large' />
                  <Heading3 textAlign='center' style={styles.loading_heading}>
                    We&apos;re processing your debit card.
                  </Heading3>
              </View>
            }

            { !isLoading && isEmpty(debitCards) &&
              <View style={styles.container}>
                  <Button
                      title='Request Card'
                      onPress={handleSubmitRequest}
                  />
              </View>
            }

            { !isLoadingNewCard && activeCard && associatedAccount && 
              <View style={styles.container}>
                  <View style={styles.row}>
                      <View style={styles.column}>
                          <Body fontWeight='bold' style={styles.columnHeading}>
                          Card Number
                          </Body>
                          <Heading5>
                              {!isCardActive ? 'Pending' : `**** **** **** ${activeCard.card_last_four_digit}`}
                          </Heading5>
                      </View>
                      <View style={styles.column}>
                          <Body fontWeight='bold' style={styles.columnHeading}>
                          Associated Account
                          </Body>
                          <Heading5>
                              <TextLink
                                  onPress={(): void => onPressAccountName(activeCard.synthetic_account_uid)}
                                  fontType={Heading5}
                              >
                                  {associatedAccount.name}
                              </TextLink>
                          </Heading5>
                      </View>
                  </View>
                  <View style={styles.row}>
                      <View style={styles.column}>
                          <Body fontWeight='bold' style={styles.columnHeading}>
                        Issued
                          </Body>
                          <Heading5>
                              {!isCardActive ? 'Pending' : utils.formatDate(activeCard.issued_on)}
                          </Heading5>
                      </View>
                      <View style={styles.column}>
                          <Body fontWeight='bold' style={styles.columnHeading}>
                        Status
                          </Body>
                          <Heading5>
                              {capitalize(activeCard.status)}
                          </Heading5>
                      </View>
                  </View>
              
                  { isCardActive &&
                    <>
                        <View style={styles.switchContainer}>
                            <Switch
                                trackColor={{ false: '#2ecc71', true: '#e74c3c' }}
                                thumbColor="#ecf0f1"
                                ios_backgroundColor="#ecf0f1"
                                onValueChange={toggleSwitch}
                                value={isLocked}
                                style={styles.switch}
                            />
                            <Body fontWeight='bold'>
                                {`Card is ${isLocked ? 'Locked' : 'Unlocked'}`}
                            </Body>
                        </View>

                        <View style={styles.reissueContainer}>
                            <Body textAlign='center' fontWeight='bold' style={styles.columnHeading}>
                            Report Damaged, Lost or Stolen
                            </Body>

                            <Dropdown
                                label='Issue'
                                placeholder='Select Issue'
                                items={debitCardReasons}
                                value={reissueReason}
                                containerStyle={styles.input}
                                onChange={(value) => setReissueReason(value)}
                            />
                            <Input
                                label='Add Comment'
                                autoCapitalize={'none'}
                                onChangeText={setReissueComment}
                                value={reissueComment}
                                containerStyle={styles.input}
                                multiline={true}
                                numberOfLines={3}
                            />
                            <Button
                                title='Report Lost/Stolen'
                                disabled={isNil(reissueReason)}
                                onPress={handleSubmitReissue}
                            />
                        </View>
                    </>
                  }
              </View>
            }
        </Screen>
    );
}



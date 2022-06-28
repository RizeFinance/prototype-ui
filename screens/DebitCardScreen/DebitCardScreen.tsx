import React, { useEffect, useState } from 'react';
import { View, Switch, ActivityIndicator, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screen, Button, Dropdown, Heading3, Body } from '../../components';
import { useDebitCards } from '../../contexts';
import { capitalize, startCase } from 'lodash';
import { styles } from './styles';
import { RootStackParamList } from '../../types';
import { useIsFocused } from '@react-navigation/native';

export interface DebitCardScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'DebitCard'>;
}

export default function DebitCardScreen({ navigation }: DebitCardScreenProps): JSX.Element {
  const {
    lockDebitCard,
    unlockDebitCard,
    reissueDebitCard,
    fetchVirtualImage,
    migrateVirtualCardtoPhysical,
    getActiveCard,
    activeCard,
    getCardByUid,
  } = useDebitCards();

  const isFocused = useIsFocused();
  const alertDefault = { text: null, success: false };
  const [reissueReason, setReissueReason] = useState('');
  const [cardImage, setCardImage] = useState(undefined);
  const [alert, setAlert] = useState(alertDefault);
  const [requestIsLoading, setRequestIsLoading] = useState(false);
  const [physicalRequested, setPhysicalRequested] = useState(false);
  const [cardLoading, setCardLoading] = useState(true);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const isVirtualCard = activeCard?.type === 'virtual';
  const isPhysicalCard = activeCard?.type === 'physical';

  const isCardActive = [
    'normal',
    'shipped',
    'printing_physical_card',
    'card_replacement_shipped',
    'usable_without_pin',
  ].includes(activeCard?.status);

  const cardIsShipped = isPhysicalCard && activeCard?.status === 'shipped';
  const showRequestBtn = isVirtualCard || cardIsShipped;

  const unableToLock = ['closed', 'closed_by_administrator', 'lost', 'stolen', 'queued'].includes(
    activeCard?.status
  );

  useEffect(() => {
    if (activeCard) {
      setCardLoading(false);
    } else {
      getActiveCard();
    }
  }, [activeCard]);

  useEffect(() => {
    const fetchCardImage = async () => {
      const { data } = await fetchVirtualImage(activeCard.uid);
      setCardImage(data);
    };
    if (activeCard) {
      fetchCardImage();
    }
  }, [activeCard]);

  const handleToggle = async () => {
    if (activeCard.lock_reason) {
      const { success } = await unlockDebitCard(activeCard.uid);
      if (success) {
        setAlert({ text: 'Card has been unlocked.', success: true });
      } else {
        setAlert({ text: 'Card failed to unlock.', success: false });
      }
    }

    if (!activeCard.lock_reason) {
      const { success } = await lockDebitCard(activeCard.uid);
      if (success) {
        setAlert({ text: 'Card has been locked.', success: true });
      } else {
        setAlert({ text: 'Card failed to lock.', success: false });
      }
    }
  };

  const sendToActivation = (): void => {
    navigation.push('DebitCardActivation');
  };

  const sendToPinSet = (): void => {
    navigation.push('PinSet');
  };

  useEffect(() => {
    const clearAlert = () => {
      setAlert(alertDefault);
    };
    if (alert.text && !isFocused) {
      clearAlert();
    }
  }, [isFocused]);

  const checkCardAfterReissue = () => {
    const checkCard = setInterval(async () => {
      const { success, data: card } = await getActiveCard();

      if (success && card) {
        clearInterval(checkCard);
        setAlert(alertDefault);
        setReissueReason('Issue');
        setBtnDisabled(false);
      }
    }, 3000);

    if (!isFocused) clearInterval(checkCard);
  };

  const handleSubmitReissue = async () => {
    setBtnDisabled(true);

    const reason = reissueReason || 'stolen';
    const { success } = await reissueDebitCard(activeCard?.uid, reason);

    if (success) {
      setAlert({ text: 'New card has been successfully requested.', success: true });

      checkCardAfterReissue();
    } else {
      setAlert({ text: 'Request for new card failed.', success: false });
      setBtnDisabled(false);
    }
  };

  const debitCardReasons = [
    { label: 'Lost', value: 'lost' },
    { label: 'Damaged', value: 'damaged' },
    { label: 'Stolen', value: 'stolen' },
  ];

  const checkForPhysicalCard = () => {
    const checkCard = setInterval(async () => {
      const { data: card } = await getCardByUid(activeCard.uid);
      if (card.type === 'physical') {
        clearInterval(checkCard);
        setAlert(alertDefault);
      }
      if (!isFocused) clearInterval(checkCard);
    }, 3000);
  };

  const requestPhysicalCard = async () => {
    setRequestIsLoading(true);
    const { success } = await migrateVirtualCardtoPhysical({
      uid: activeCard.uid,
      customerUid: activeCard.customer_uid,
      poolUid: activeCard.pool_uid,
    });
    if (success) {
      setPhysicalRequested(true);
      setAlert({ text: 'Physical Card has been successfully requested', success: true });
      checkForPhysicalCard();
    } else {
      setAlert({ text: 'Physical Card request failed', success: false });
    }
    setRequestIsLoading(false);
  };

  return (
    <Screen>
      <View style={styles.dcContainer}>
        <View>
          <Heading3 textAlign="center" style={styles.heading}>
            Debit Card
          </Heading3>
          {alert.text && (
            <Body style={[styles.alert, alert.success ? styles.alertSuccess : styles.alertFailure]}>
              {alert.text && `${alert.text}`}
            </Body>
          )}
        </View>

        <View
          style={
            cardImage ? [styles.imageContainer, styles.shadowImageContainer] : styles.imageContainer
          }
        >
          {cardImage ? (
            <Image
              resizeMode="contain"
              source={{ uri: `data:image/png;base64,${cardImage}` }}
              style={{ flex: 1 }}
            />
          ) : (
            <ActivityIndicator size="large" />
          )}
        </View>

        <View style={styles.statusContainer}>
          <Body fontWeight="bold" style={styles.status}>
            Status
          </Body>
          <Body>{physicalRequested ? 'Requested' : capitalize(startCase(activeCard?.status))}</Body>
        </View>

        <>
          <View style={styles.switchContainer}>
            <Switch
              trackColor={{ false: '#2ecc71', true: '#e74c3c' }}
              thumbColor="#ecf0f1"
              ios_backgroundColor="#ecf0f1"
              onValueChange={handleToggle}
              value={!!activeCard?.locked_at || unableToLock}
              style={styles.switch}
              disabled={unableToLock}
            />
            <Body fontWeight="bold">{`Card is ${
              activeCard?.locked_at || unableToLock ? 'Locked' : 'Unlocked'
            }`}</Body>
          </View>
        </>

        {showRequestBtn && (
          <Button
            title={isVirtualCard ? 'Request Physical Card' : 'Activate Physical Card'}
            onPress={isVirtualCard ? requestPhysicalCard : sendToActivation}
            loading={requestIsLoading || physicalRequested}
            disabled={btnDisabled}
          />
        )}

        {isPhysicalCard && isCardActive && <Button title={'Set Card Pin'} onPress={sendToPinSet} />}
      </View>

      {!cardLoading && (
        <View style={[styles.reissueContainer, isVirtualCard && styles.btnContainer]}>
          {!isVirtualCard && (
            <Body style={styles.report} textAlign="center" fontWeight="bold">
              Report Damaged, Lost or Stolen
            </Body>
          )}
          {!isVirtualCard && (
            <Dropdown
              label="Issue"
              placeholder="Select Issue"
              items={debitCardReasons}
              value={reissueReason}
              containerStyle={styles.select}
              onChange={(value) => setReissueReason(value)}
              disabled={!isCardActive}
            />
          )}
          <Button
            title={
              isVirtualCard
                ? 'Report Stolen'
                : `Report ${reissueReason !== 'Select Issue' ? capitalize(reissueReason) : 'Issue'}`
            }
            disabled={btnDisabled || !reissueReason}
            onPress={handleSubmitReissue}
          />
        </View>
      )}
    </Screen>
  );
}

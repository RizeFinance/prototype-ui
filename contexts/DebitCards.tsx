import React, { useContext, useState, createContext, useMemo, useCallback } from 'react';
import { DebitCard, DebitCardAccessToken } from '../models';
import DebitCardService from '../services/DebitCardService';
import { useAuth } from './Auth';
import { isNil } from 'lodash';
import { compareAsc } from 'date-fns';

export interface IDebitCardsResp<T> {
  data: T;
  success: boolean;
}

interface IMigrate {
  uid: string;
  customerUid: string;
  poolUid: string;
}

export interface IDebitCards {
  isLoading: boolean;
  debitCards?: DebitCard[];
  pinSetToken?: string;
  activeCard?: DebitCard;
  refetchDebitCards: () => Promise<IDebitCardsResp<DebitCard[]>>;
  getActiveCard: () => Promise<IDebitCardsResp<DebitCard>>;
  lockDebitCard: (uid: string) => Promise<IDebitCardsResp<DebitCard>>;
  unlockDebitCard: (uid: string) => Promise<IDebitCardsResp<DebitCard>>;
  reissueDebitCard: (uid: string, reason: string) => Promise<IDebitCardsResp<DebitCard>>;
  createDebitCard: (pool_uid: string) => Promise<IDebitCardsResp<DebitCard[]>>;
  activateDebitCard: (
    uid: string,
    cardLastFourDigits: string,
    cvv: string,
    expiryDate: string
  ) => Promise<IDebitCardsResp<DebitCard[]> | void>;
  loadPinSetToken: (uid: string) => Promise<void>;
  fetchVirtualImage: (uid: string) => Promise<IDebitCardsResp<string>>;
  migrateVirtualCardtoPhysical: ({
    uid,
    customerUid,
    poolUid,
  }: IMigrate) => Promise<IDebitCardsResp<{ success: boolean; data: string }>>;
  getCardByUid: (uid: string) => Promise<IDebitCardsResp<DebitCard>>;
}

export const DebitCardsContext = createContext({} as IDebitCards);

export type DebitCardProviderState = {
  isLoading: boolean;
  debitCards?: DebitCard[];
};

export interface IDebitCardsContext {
  children?: React.ReactNode;
}

const DebitCardsProvider = ({ children }: IDebitCardsContext) => {
  const [isLoading, setIsLoading] = useState(false);
  const [debitCards, setDebitCards] = useState<DebitCard[]>([]);
  const [pinSetToken, setPinTokenSet] = useState<string | undefined>(undefined);
  const [activeCard, setActiveCard] = useState<DebitCard | undefined>(undefined);
  const { accessToken } = useAuth();

  const refetchDebitCards = useCallback(async (): Promise<IDebitCardsResp<DebitCard[]>> => {
    setIsLoading(true);

    try {
      const { data: debitCards } = await DebitCardService.getDebitCards(accessToken);
      setDebitCards(debitCards);
      return { success: true, data: debitCards };
    } catch (err) {
      return { success: false, data: err };
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  const lockDebitCard = useCallback(
    async (uid: string): Promise<IDebitCardsResp<DebitCard>> => {
      try {
        const card = await DebitCardService.lockDebitCard(accessToken, uid);
        if (card.lock_reason) {
          setActiveCard(card);
          return { success: true, data: card };
        } else {
          return { success: false, data: null };
        }
      } catch (err) {
        return { success: false, data: err };
      }
    },
    [accessToken]
  );

  const unlockDebitCard = useCallback(
    async (uid: string): Promise<IDebitCardsResp<DebitCard>> => {
      try {
        const card = await DebitCardService.unlockDebitCard(accessToken, uid);
        if (!card.lock_reason) {
          setActiveCard(card);
          return { success: true, data: card };
        } else {
          return { success: false, data: null };
        }
      } catch (err) {
        return { success: false, data: err };
      }
    },
    [accessToken]
  );

  const reissueDebitCard = useCallback(
    async (uid: string, reason: string): Promise<IDebitCardsResp<DebitCard>> => {
      setIsLoading(true);
      try {
        const card = await DebitCardService.reissueDebitCard(accessToken, uid, reason);
        setActiveCard(card);
        return { success: true, data: card };
      } catch (err) {
        return { success: false, data: err };
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, refetchDebitCards]
  );

  const createDebitCard = useCallback(
    async (pool_uid: string): Promise<IDebitCardsResp<DebitCard[]>> => {
      setIsLoading(true);

      try {
        await DebitCardService.createDebitCard(accessToken, pool_uid);
        return await refetchDebitCards();
      } catch (err) {
        return { success: false, data: [] };
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, refetchDebitCards]
  );

  const activateDebitCard = useCallback(
    async (
      uid: string,
      cardLastFourDigits: string,
      cvv: string,
      expiryDate: string
    ): Promise<IDebitCardsResp<DebitCard[]> | void> => {
      setIsLoading(true);

      try {
        await DebitCardService.activateDebitCard(
          accessToken,
          uid,
          cardLastFourDigits,
          cvv,
          expiryDate
        );
        await refetchDebitCards();
      } catch (err) {
        return { success: false, data: err };
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, refetchDebitCards]
  );

  const loadPinSetToken = useCallback(
    async (uid: string): Promise<void> => {
      const { pin_change_token } = await DebitCardService.getPinSetToken(accessToken, uid);
      setPinTokenSet(pin_change_token);
    },
    [accessToken]
  );

  const getAccessToken = useCallback(
    async (uid: string): Promise<IDebitCardsResp<DebitCardAccessToken>> => {
      try {
        const cardAccessToken = await DebitCardService.getAccessToken(accessToken, uid);
        return { success: true, data: cardAccessToken };
      } catch (err) {
        return { success: false, data: err };
      }
    },
    [accessToken]
  );

  const getActiveCard = useCallback(async (): Promise<IDebitCardsResp<DebitCard>> => {
    setIsLoading(true);

    try {
      const { data: debitCards } = await DebitCardService.getDebitCards(accessToken);
      const activeCard = debitCards?.find((x) => isNil(x.closed_at));

      if (activeCard) {
        setActiveCard(activeCard);
        return { success: true, data: activeCard };
      } else {
        const latest = debitCards.sort((a, b) =>
          compareAsc(new Date(b.closed_at), new Date(a.closed_at))
        )[0];
        setActiveCard(latest);
        return { success: false, data: latest };
      }
    } catch (err) {
      return { success: false, data: err };
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  const getVirtualCardImage = async (
    configId: string,
    token: string
  ): Promise<IDebitCardsResp<string>> => {
    try {
      const image = await DebitCardService.getVirtualCardImage(accessToken, configId, token);
      return { success: true, data: image };
    } catch (err) {
      return { success: false, data: err };
    }
  };

  const fetchVirtualImage = useCallback(
    async (uid: string): Promise<IDebitCardsResp<string>> => {
      try {
        setIsLoading(true);
        const { data: tokenData } = await getAccessToken(uid);
        try {
          const { data } = await getVirtualCardImage(tokenData.config_id, tokenData.token);
          setIsLoading(false);
          return { success: true, data };
        } catch (err) {
          setIsLoading(false);

          return { success: false, data: err };
        }
      } catch (err) {
        setIsLoading(false);

        return { success: false, data: err };
      }
    },
    [accessToken]
  );

  const getCardByUid = useCallback(
    async (uid: string): Promise<IDebitCardsResp<DebitCard>> => {
      try {
        setIsLoading(true);
        const card = await DebitCardService.getDebitCardByUid(accessToken, uid);
        setIsLoading(false);
        setActiveCard(card);
        return { success: true, data: card };
      } catch (err) {
        setIsLoading(false);
        return { success: false, data: err };
      }
    },
    [accessToken]
  );

  const migrateVirtualCardtoPhysical = useCallback(
    async ({ uid, customerUid, poolUid }): Promise<IDebitCardsResp<string>> => {
      try {
        setIsLoading(true);
        await DebitCardService.migrateVirtualCardtoPhysical({
          accessToken,
          uid,
          customerUid,
          poolUid,
        });
        setIsLoading(false);
        return { success: true, data: null };
      } catch (err) {
        setIsLoading(false);
        return { success: false, data: err };
      }
    },
    [accessToken]
  );

  const value = useMemo(
    () => ({
      isLoading,
      debitCards,
      pinSetToken,
      refetchDebitCards,
      lockDebitCard,
      unlockDebitCard,
      reissueDebitCard,
      createDebitCard,
      loadPinSetToken,
      activateDebitCard,
      fetchVirtualImage,
      migrateVirtualCardtoPhysical,
      getActiveCard,
      activeCard,
      getCardByUid,
    }),
    [
      isLoading,
      debitCards,
      pinSetToken,
      refetchDebitCards,
      lockDebitCard,
      unlockDebitCard,
      reissueDebitCard,
      createDebitCard,
      loadPinSetToken,
      activateDebitCard,
      fetchVirtualImage,
      migrateVirtualCardtoPhysical,
      getActiveCard,
      activeCard,
      getCardByUid,
    ]
  );

  return <DebitCardsContext.Provider value={value}>{children}</DebitCardsContext.Provider>;
};

const useDebitCards = () => {
  const context = useContext(DebitCardsContext);
  if (context === undefined) {
    throw new Error('useDebitCards must be used within a DebitCardsProvider');
  }
  return context;
};

export { DebitCardsProvider, useDebitCards };

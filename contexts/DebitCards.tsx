import React, { useContext, useState, createContext, useMemo, useCallback } from 'react';
import { DebitCard } from '../models';
import DebitCardService from '../services/DebitCardService';
import { useAuth } from './Auth';

export interface IDebitCardsResp {
  data: DebitCard[];
  success: boolean;
}

export type IDebitCards = {
  isLoading: boolean;
  debitCards?: DebitCard[];
  pinSetToken?: string;
  refetchDebitCards: () => Promise<IDebitCardsResp>;
  lockDebitCard: (uid: string) => Promise<void>;
  unlockDebitCard: (uid: string) => Promise<void>;
  reissueDebitCard: (uid: string, reason: string) => Promise<IDebitCardsResp | void>;
  createDebitCard: (pool_uid: string) => Promise<IDebitCardsResp>;
  activateDebitCard: (
    uid: string,
    cardLastFourDigits: string,
    cvv: string,
    expiryDate: string
  ) => Promise<IDebitCardsResp | void>;
  loadPinSetToken: (uid: string) => Promise<void>;
};

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
  const { accessToken } = useAuth();

  const refetchDebitCards = useCallback(async (): Promise<IDebitCardsResp> => {
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
    async (uid: string): Promise<void> => {
      await DebitCardService.lockDebitCard(accessToken, uid);
      await refetchDebitCards();
    },
    [accessToken, refetchDebitCards]
  );

  const unlockDebitCard = useCallback(
    async (uid: string): Promise<void> => {
      await DebitCardService.unlockDebitCard(accessToken, uid);
      await refetchDebitCards();
    },
    [accessToken, refetchDebitCards]
  );

  const reissueDebitCard = useCallback(
    async (uid: string, reason: string): Promise<IDebitCardsResp | void> => {
      setIsLoading(true);
      try {
        await DebitCardService.reissueDebitCard(accessToken, uid, reason);
        await refetchDebitCards();
      } catch (err) {
        return { success: false, data: err };
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, refetchDebitCards]
  );

  const createDebitCard = useCallback(
    async (pool_uid: string): Promise<IDebitCardsResp> => {
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
    ): Promise<IDebitCardsResp | void> => {
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

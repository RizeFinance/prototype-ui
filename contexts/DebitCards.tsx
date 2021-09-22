import React, { useContext } from 'react';
import { DebitCard } from '../models';
import DebitCardService from '../services/DebitCardService';
import { AuthContext } from './Auth';

export type DebitCardsContextProps = {
  isLoading: boolean;
  debitCards?: DebitCard[];
  pinSetToken?: string;
  refetchDebitCards: () => Promise<DebitCard[]>;
  lockDebitCard: (uid: string) => Promise<DebitCard[]>;
  unlockDebitCard: (uid: string) => Promise<DebitCard[]>;
  reissueDebitCard: (uid: string, reason: string) => Promise<DebitCard[]>;
  createDebitCard: (pool_uid: string) => Promise<DebitCard[]>;
  activateDebitCard: (uid: string, cardLastFourDigits: string, cvv: string, expiryDate: string) => Promise<DebitCard[]>;
  loadPinSetToken: (uid: string) => Promise<string>;
};

export const DebitCardsContext = React.createContext<DebitCardsContextProps>({
  isLoading: false,
  debitCards: [],
  pinSetToken: null,
  refetchDebitCards: () => Promise.resolve([]),
  lockDebitCard: () => Promise.resolve([]),
  unlockDebitCard: () => Promise.resolve([]),
  reissueDebitCard: () => Promise.resolve([]),
  createDebitCard: () => Promise.resolve([]),
  activateDebitCard: () => Promise.resolve([]),
  loadPinSetToken: () => Promise.resolve([]),
});

export type DebitCardProviderState = {
  isLoading: boolean;
  debitCards?: DebitCard[];
};

const initialState = {
  isLoading: false,
  debitCards: [],
};

export interface DebitCardsProviderProps {
  children?: JSX.Element;
}

export class DebitCardsProvider extends React.Component<
  DebitCardsProviderProps,
  DebitCardProviderState
> {
  static contextType = AuthContext;
  context: React.ContextType<typeof AuthContext>;

  constructor(props: DebitCardsProviderProps) {
    super(props);

    this.state = initialState;
  }

  refetchDebitCards = async (): Promise<DebitCard[]> => {
    this.setState({ isLoading: true });

    try {
      const { data: debitCards } = await DebitCardService.getDebitCards(this.context.accessToken);
      this.setState({ debitCards });
      return { success: true, data: debitCards };
    } catch (err) {
      return { success: false, data: err };
    } finally {
      this.setState({ isLoading: false });
    }
  };

  lockDebitCard = async (uid: string): Promise<DebitCard[]> => {
    await DebitCardService.lockDebitCard(this.context.accessToken, uid);
    const response = await this.refetchDebitCards();
    return response;
  };

  unlockDebitCard = async (uid: string): Promise<DebitCard[]> => {
    await DebitCardService.unlockDebitCard(this.context.accessToken, uid);
    const response = await this.refetchDebitCards();
    return response;
  };

  reissueDebitCard = async (uid: string, reason: string): Promise<DebitCard[]> => {
    this.setState({ isLoading: true });

    try {
      await DebitCardService.reissueDebitCard(this.context.accessToken, uid, reason);
      const response = await this.refetchDebitCards();
      return response;
    } catch (err) {
      return { success: false, error: err };
    } finally {
      this.setState({ isLoading: false });
    }
  };

  createDebitCard = async (pool_uid: string): Promise<DebitCard[]> => {
    this.setState({ isLoading: true });
        
    try {
      await DebitCardService.createDebitCard(this.context.accessToken, pool_uid);
      const response = await this.refetchDebitCards();
      return response;
    } catch (err) {
      return { success: false, error: err };
    } finally {
      this.setState({ isLoading: false });
    }
  };

  activateDebitCard = async (uid: string, cardLastFourDigits: string, cvv: string, expiryDate: string): Promise<DebitCard[]> => {
    this.setState({ isLoading: true });

    try {
      await DebitCardService.activateDebitCard(this.context.accessToken, uid, cardLastFourDigits, cvv, expiryDate);
        const response = await this.refetchDebitCards();
        return response;
      } catch (err) {
        return { success: false, error: err };
      } finally {
      this.setState({ isLoading: false });
    }
  };

  loadPinSetToken = async (uid: string): Promise<string> => {
    const response = await DebitCardService.getPinSetToken(this.context.accessToken, uid);
    this.setState({ pinSetToken: response.pin_change_token });
  };

  render(): JSX.Element {
    const { isLoading, debitCards, pinSetToken } = this.state;

    return (
      <DebitCardsContext.Provider
        value={{
          isLoading: isLoading,
          debitCards: debitCards,
          pinSetToken: pinSetToken,
          enabled: true,
          refetchDebitCards: this.refetchDebitCards,
          lockDebitCard: this.lockDebitCard,
          unlockDebitCard: this.unlockDebitCard,
          reissueDebitCard: this.reissueDebitCard,
          createDebitCard: this.createDebitCard,
          loadPinSetToken: this.loadPinSetToken,
          activateDebitCard: this.activateDebitCard,
        }}
      >
        {this.props.children}
      </DebitCardsContext.Provider>
    );
  }
}

export const DebitCardsConsumer = DebitCardsContext.Consumer;

export const useDebitCards = (): DebitCardsContextProps => useContext(DebitCardsContext);

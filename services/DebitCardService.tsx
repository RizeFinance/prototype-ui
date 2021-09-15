import api from '../utils/api';
import { RizeList, DebitCard } from '../models';

const getDebitCards = async (accessToken: string): Promise<RizeList<DebitCard>> => {
  return await api
    .get('/debit_cards', { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((response) => response.data);
};

const lockDebitCard = async (accessToken: string, debitCardUid: string): Promise<DebitCard> => {
  return await api
    .put(
      `/debit_cards/${debitCardUid}/lock`,
      { reason: 'Customer Request' },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    .then((response) => response.data);
};

const unlockDebitCard = async (accessToken: string, debitCardUid: string): Promise<DebitCard> => {
  return await api
    .put(
      `/debit_cards/${debitCardUid}/unlock`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    .then((response) => response.data);
};

const reissueDebitCard = async (
  accessToken: string,
  debitCardUid: string,
  reason: string
): Promise<DebitCard> => {
  return await api
    .put(
      `/debit_cards/${debitCardUid}/reissue`,
      { reissue_reason: reason },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    .then((response) => response.data);
};

const createDebitCard = async (accessToken: string, pool_uid: string): Promise<DebitCard> => {
  return await api
    .post('/debit_cards', { pool_uid }, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((response) => response.data);
};

export default {
  getDebitCards,
  lockDebitCard,
  unlockDebitCard,
  reissueDebitCard,
  createDebitCard,
};

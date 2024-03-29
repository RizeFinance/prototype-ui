import api from '../utils/api';
import { RizeList, DebitCard, DebitCardAccessToken } from '../models';

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

const activateDebitCard = async (
  accessToken: string,
  debitCardUid: string,
  cardLastFourDigits: string,
  cvv: string,
  expiryDate: string
): Promise<DebitCard> => {
  return await api
    .put(
      `/debit_cards/${debitCardUid}/activate`,
      {
        card_last_four_digits: cardLastFourDigits,
        cvv: cvv,
        expiry_date: expiryDate,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    .then((response) => response.data);
};

const getPinSetToken = async (
  accessToken: string,
  debitCardUid: string
): Promise<{ pin_change_token: string }> => {
  return await api
    .get(`/debit_cards/${debitCardUid}/pin_set_token`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);
};

const getAccessToken = async (
  accessToken: string,
  debitCardUid: string
): Promise<DebitCardAccessToken> => {
  return await api
    .get(`/debit_cards/${debitCardUid}/access_token`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);
};

const getVirtualCardImage = async (
  accessToken: string,
  configId: string,
  token: string
): Promise<string> => {
  return await api
    .get(`debit_cards/assets/virtual_card_image?config=${configId}&token=${token}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);
};

const getDebitCardByUid = async (accessToken: string, uid: string): Promise<DebitCard> => {
  return await api
    .get(`debit_cards/${uid}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((response) => response.data);
};

const migrateVirtualCardtoPhysical = async ({ accessToken, uid, customerUid, poolUid }) => {
  return await api
    .put(
      `debit_cards/${uid}/migrate`,
      { customerUid, poolUid },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    .then((response) => response.data);
};

export default {
  getDebitCards,
  lockDebitCard,
  unlockDebitCard,
  reissueDebitCard,
  createDebitCard,
  getPinSetToken,
  activateDebitCard,
  getAccessToken,
  getVirtualCardImage,
  migrateVirtualCardtoPhysical,
  getDebitCardByUid,
};

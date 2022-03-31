import api from '../utils/api';
import { RizeList, SyntheticAccount, SyntheticAccountType } from '../models';

const getSyntheticAccounts = async (accessToken: string): Promise<RizeList<SyntheticAccount>> => {
  return await api
    .get('/synthetic_accounts', { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((response) => response.data);
};

const getSyntheticAccountTypes = async (
  accessToken: string
): Promise<RizeList<SyntheticAccountType>> => {
  return await api
    .get('/synthetic_account_types', { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((response) => response.data);
};

interface CreateAccount {
  syntheticAccountTypeUid: string;
  poolUid?: string;
  name: string;
  accountId?: string;
  accessToken: string;
  publicToken?: string;
}

const createSyntheticAccount = async ({
  syntheticAccountTypeUid,
  poolUid,
  name,
  accountId,
  accessToken,
  publicToken,
}: CreateAccount): Promise<SyntheticAccount> => {
  return await api
    .post(
      '/synthetic_accounts',
      {
        synthetic_account_type_uid: syntheticAccountTypeUid,
        pool_uid: poolUid,
        name: name,
        account_id: accountId,
        public_token: publicToken,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    .then((response) => response.data);
};

const archiveSyntheticAccount = async (accessToken: string, accountUid: string) => {
  return await api
    .delete(`/synthetic_accounts/${accountUid}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);
};

const getLinkToken = async (accessToken: string): Promise<string> => {
  return await api
    .get('/synthetic_accounts/auth/get_token', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data.link_token);
};

export {
  getSyntheticAccounts,
  createSyntheticAccount,
  getSyntheticAccountTypes,
  archiveSyntheticAccount,
  getLinkToken,
};

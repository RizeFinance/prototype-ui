import api from '../utils/api';
import { RizeList, Transaction } from '../models';
import querystring from 'query-string';

const getTransactions = async (accessToken: string, syntheticAccountUid?: string): Promise<RizeList<Transaction>> => {
    const queryObj = {
        synthetic_account_uid: syntheticAccountUid,
    };

    let query = querystring.stringify(queryObj, { arrayFormat: 'bracket' });
    if (query) {
        query = `?${query}`;
    }

    return await api.get(`/transactions${query}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
        .then((response) => response.data);
};

export default {
    getTransactions
};
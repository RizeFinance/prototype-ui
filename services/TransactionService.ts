import api from '../utils/api';
import { RizeList, Transaction } from '../models';
import querystring from 'query-string';

const getTransactions = async (accessToken: string, limit = 100, offset = 0, syntheticAccountUid?: string): Promise<RizeList<Transaction>> => {
    const queryObj = {
        limit: limit,
        offset: offset,
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
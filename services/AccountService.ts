import api from '../utils/api';
import { RizeList, SyntheticAccount } from '../models';

const getSyntheticAccounts = async (accessToken: string): Promise<RizeList<SyntheticAccount>> => {
    return await api.get('/synthetic_accounts',
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
        .then((response) => response.data);
};

export default {
    getSyntheticAccounts
};
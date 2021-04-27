import api from '../utils/api';
import { Transfer } from '../models';

const initiateTransfer = async (
    accessToken: string,
    sourceSyntheticAccountUid: string,
    destinationSyntheticAccountUid: string,
    usdTransferAmount: string,
): Promise<Transfer> => {
    return await api.post('/transfers',
        {
            source_synthetic_account_uid: sourceSyntheticAccountUid,
            destination_synthetic_account_uid: destinationSyntheticAccountUid,
            usd_transfer_amount: usdTransferAmount,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
        .then((response) => response.data);
};

export default {
    initiateTransfer,
};
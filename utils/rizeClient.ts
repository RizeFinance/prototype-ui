import Rize from '@rizefinance/rize-js';
import config from '../config/config';

class RizeClient {
    private static instance: Rize;

    static getInstance(): Rize {
        if (!RizeClient.instance) {
            this.instance = new Rize(config.rize.programId, config.rize.hmac);
        }

        return this.instance;
    }
}

export default RizeClient;
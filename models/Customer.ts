import { Customer as BaseCustomer } from '@rizefinance/rize-js/types/lib/core/typedefs/customer.typedefs';

export type Customer = Omit<BaseCustomer, 'pool_uids'>;
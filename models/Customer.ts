import { Customer as BaseCustomer } from '@rizefinance/rize-js/types/lib/core/typedefs/customer.typedefs';
import { CustomerDetails } from '@rizefinance/rize-js/types/lib/core/customer';

export type CustomerDetails = CustomerDetails;
export type Customer = Omit<BaseCustomer, 'pool_uids'>;
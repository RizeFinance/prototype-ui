import { Customer as BaseCustomer } from '@rizefinance/rize-js/types/lib/core/typedefs/customer.typedefs';
import { CustomerDetails as BaseCustomerDetails } from '@rizefinance/rize-js/types/lib/core/customer';

export type CustomerDetails = BaseCustomerDetails;
export type Customer = Omit<BaseCustomer, 'pool_uids'>;

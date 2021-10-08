import { Customer as BaseCustomer } from '@rizefinance/rize-js/types/lib/core/typedefs/customer.typedefs';
import { CustomerDetails as BaseCustomerDetails } from '@rizefinance/rize-js/types/lib/core/customer';
import { CustomerProduct as BaseCustomerProduct } from '@rizefinance/rize-js/types/lib/core/customer-product';

export type CustomerDetails = BaseCustomerDetails;
export type CustomerProduct = BaseCustomerProduct;
export type Customer = Omit<BaseCustomer, 'pool_uids'>;

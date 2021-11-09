import { RizeList, Customer, CustomerDetails, CustomerProduct } from '../models';
import api from '../utils/api';

const getCustomer = async (accessToken: string): Promise<Customer> => {
  return await api
    .get('/customer', { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(error);
    });
};

const createCustomerProduct = async (
  accessToken: string,
  product_uid: string
): Promise<Customer> => {
  return await api
    .post(
      '/customer/customer_products',
      { product_uid },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    .then((response) => response.data);
};

const getCustomerProducts = async (
  accessToken: string,
  customerUid: string
): Promise<RizeList<CustomerProduct>> => {
  return await api
    .get(`/customer/customer_products?customer_uid[]=${customerUid}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);
};

const updateCustomer = async (
  accessToken: string,
  customerEmail: string,
  customerDetails: CustomerDetails
): Promise<Customer> => {
  return await api
    .put(
      '/customer',
      {
        email: customerEmail,
        details: customerDetails,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    .then((response) => {
      return response.data;
    });
};

const updateCustomerProfileAnswers = async (
  accessToken: string,
  answers: Record<string, unknown>
): Promise<Customer> => {
  return await api
    .post(
      '/customer/batch_profile_answers',
      { answers },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    .then((response) => {
      return response.data;
    });
};

const verifyCustomer = async (accessToken: string): Promise<Customer> => {
  return await api
    .put('/customer/verify', {}, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((response) => {
      return response.data;
    });
};

export default {
  getCustomer,
  verifyCustomer,
  getCustomerProducts,
  createCustomerProduct,
  updateCustomer,
  updateCustomerProfileAnswers,
};

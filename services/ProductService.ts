import { RizeList, Product } from '../models';
import api from '../utils/api';

const getProducts = async (accessToken: string): Promise<RizeList<Product>> => {
  return await api
    .get('/products', { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((response) => response.data);
};

export default {
  getProducts,
};

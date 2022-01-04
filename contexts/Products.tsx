import React, { useContext } from 'react';
import { Product } from '../models';
import { ProductService } from '../services';
import { AuthContext } from './Auth';

export type ProductsContextProps = {
  isLoading: boolean;
  products?: Product[];
  getProducts: () => Promise<Product[]>;
};

export const ProductsContext = React.createContext<ProductsContextProps>({
  isLoading: false,
  products: [],
  getProducts: () => Promise.resolve([]),
});

export type ProductsProviderState = {
  isLoading: boolean;
  products?: Product[];
};

const initialState = {
  isLoading: false,
  products: [],
};

export interface ProductsProviderProps {
  children?: JSX.Element;
}

export class ProductsProvider extends React.Component<
  ProductsProviderProps,
  ProductsProviderState
> {
  static contextType = AuthContext;
  context: React.ContextType<typeof AuthContext>;

  constructor(props: ProductsProviderProps) {
    super(props);

    this.state = initialState;
  }

  getProducts = async (): Promise<Product[]> => {
    this.setState({ isLoading: true });

    try {
      const { data: products } = await ProductService.getProducts(this.context.accessToken);
      this.setState({ products });
      return { data: products };
    } catch (err) {
      return { data: err };
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render(): JSX.Element {
    const { isLoading, products } = this.state;

    return (
      <ProductsContext.Provider
        value={{
          isLoading: isLoading,
          products: products,
          getProducts: this.getProducts,
        }}
      >
        {this.props.children}
      </ProductsContext.Provider>
    );
  }
}

export const ProductConsumer = ProductsContext.Consumer;

export const useProducts = (): ProductsContextProps => useContext(ProductsContext);

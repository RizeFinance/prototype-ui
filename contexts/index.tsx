import React from 'react';
import { DebitCardsProvider } from './DebitCards';
import { DocumentsProvider } from './Documents';
import { AuthProvider } from './Auth';
import { AccountsProvider } from './Accounts';
import { ProductsProvider } from './Products';

const ApplicationProviders = ({ children }: { children: JSX.Element }): JSX.Element => {
  return (
    <AuthProvider>
      <AccountsProvider>
        <ProductsProvider>
          <DebitCardsProvider>
            <DocumentsProvider>{children}</DocumentsProvider>
          </DebitCardsProvider>
        </ProductsProvider>
      </AccountsProvider>
    </AuthProvider>
  );
};

export { ApplicationProviders };

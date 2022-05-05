import React from 'react';
import { DebitCardsProvider, useDebitCards } from './DebitCards';
import { DocumentsProvider } from './Documents';
import { AuthProvider, useAuth } from './Auth';
import { AccountsProvider, useAccounts } from './Accounts';
import { ProductsProvider } from './Products';
import { useComplianceWorkflow, ProductType } from './ComplianceWorkflow';
import { useBrokerageWorkflow } from './BrokerageWorkflow';

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

export {
  ApplicationProviders,
  useAuth,
  useAccounts,
  useDebitCards,
  useComplianceWorkflow,
  useBrokerageWorkflow,
  ProductType,
};

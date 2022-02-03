import React from 'react';
import { DebitCardsProvider, useDebitCards } from './DebitCards';
import { DocumentsProvider } from './Documents';
import { AuthProvider, useAuth } from './Auth';
import { AccountsProvider, useAccounts, AccountType } from './Accounts';
import { ProductsProvider } from './Products';
import {
  // useCompliance,
  ProductType,
  // ComplianceProvider,
  ComplianceDocumentSelection,
} from './ComplianceWorkflow';

import { ComplianceProvider, useCompliance } from './Compliance';

const ApplicationProviders = ({ children }: { children: JSX.Element }): JSX.Element => {
  return (
    <AuthProvider>
      <ComplianceProvider>
        <AccountsProvider>
          <ProductsProvider>
            <DebitCardsProvider>
              <DocumentsProvider>{children}</DocumentsProvider>
            </DebitCardsProvider>
          </ProductsProvider>
        </AccountsProvider>
      </ComplianceProvider>
    </AuthProvider>
  );
};

export {
  ComplianceDocumentSelection,
  ApplicationProviders,
  useAuth,
  useAccounts,
  useDebitCards,
  useCompliance,
  ProductType,
  AccountType,
  ComplianceProvider,
};

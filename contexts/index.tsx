import React from 'react';
import { DebitCardsProvider } from './DebitCards';
import { DocumentsProvider } from './Documents';
import { AuthProvider } from './Auth';
import { AccountsProvider } from './Accounts';

const ApplicationProviders = ({ children }: { children: JSX.Element }): JSX.Element => {
  return (
    <AuthProvider>
      <AccountsProvider>
        <DebitCardsProvider>
          <DocumentsProvider>{children}</DocumentsProvider>
        </DebitCardsProvider>
      </AccountsProvider>
    </AuthProvider>
  );
};

export { ApplicationProviders };

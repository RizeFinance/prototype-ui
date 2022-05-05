import React from 'react';
import Button from './Button';
import { usePlaidLink } from 'react-plaid-link';

export interface PlaidAccount {
  subtype: string;
  name: string;
  id: string;
}

interface PlaidLinkProps {
  linkToken: string;
  onEvent?(event: any): any;
  onExit?(exit: any): any;
  onSuccess(publicToken: string, metadata: { accounts: PlaidAccount[] }): void;
  title?: string;
  disabled?: boolean;
}

export default function PlaidLink({
  linkToken,
  onEvent,
  onExit,
  onSuccess,
  title,
  disabled,
}: PlaidLinkProps): JSX.Element {
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onEvent,
    onExit,
  });

  return (
    <Button
      title={title ? title : 'Connect External Account'}
      disabled={disabled || !ready}
      onPress={(): void => open()}
      style={{ marginBottom: 40 }}
    />
  );
}

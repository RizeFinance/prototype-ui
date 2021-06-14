import React from 'react';
import { PlaidLink as WebPlaidLink, PlaidLinkOnSuccess } from 'react-plaid-link';

interface PlaidLinkProps {
  linkToken: string
  onEvent?(event: any): any
  onExit?(exit: any): any
  onSuccess?(success: PlaidLinkOnSuccess): any
}

export default function PlaidLink({
    linkToken,
    onEvent,
    onExit,
    onSuccess,
}: PlaidLinkProps): JSX.Element {
    return (
        <WebPlaidLink
            token={linkToken}
            onSuccess={onSuccess}
            onExit={onEvent}
            onEvent={onExit}
        >
          Connect External Account
        </WebPlaidLink>
    );
}
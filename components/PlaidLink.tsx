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
    const overrideStyles = {
        backgroundColor: "#586CB7",
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        padding: 15,
        marginTop: 25,
    }

    return (
        <WebPlaidLink
            token={linkToken}
            onSuccess={onSuccess}
            onExit={onEvent}
            onEvent={onExit}
            style={overrideStyles}
        >
          Connect External Account
        </WebPlaidLink>
    );
}
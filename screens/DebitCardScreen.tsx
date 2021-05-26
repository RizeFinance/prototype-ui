import * as React from 'react';
import { Screen } from '../components';
import { Heading3 } from '../components/Typography';

export default function DebitCardScreen(): JSX.Element {
    
    return (
        <Screen>
            <Heading3 textAlign='center' style={{ marginTop: 100 }}>
                Debit Card
            </Heading3>
        </Screen>
    );
}



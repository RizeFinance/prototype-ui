import * as React from 'react';
import { Screen } from '../components';
import { Heading3 } from '../components/Typography';

export default function HomeScreen(): JSX.Element {
    return (
        <Screen>
            <Heading3 textAlign='center' style={{ marginTop: 100 }}>
                Your application has been approved.
            </Heading3>
        </Screen>
    );
}
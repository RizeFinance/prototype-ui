import * as React from 'react';
import { Screen } from '../components';
import { Heading3 } from '../components/Typography';

export default function SignupScreen(): JSX.Element {
    return (
        <Screen
            useScrollView
            bounces={false}
        >
            <Heading3 textAlign='center'>Signup Screen</Heading3>   
        </Screen>
    );
}
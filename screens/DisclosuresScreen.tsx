import * as React from 'react';
import Screen from '../components/Screen';
import { Heading3, BodySmall } from '../components/Typography';

export default function DisclosuresScreen(): JSX.Element {
    return (
        <Screen>
            <Heading3 textAlign='center'>Rize Disclosures</Heading3>

            {/* checkbox I agree to Terms of Use */}
            {/* checkbox I agree to Privacy Policy*/}
            {/* checkbox I agree to E-sign Disclosures and Agreement */}

            <BodySmall>By clicking &quotI Agree&quot I have read and agreed to the Terms of Use, Privacy Policy and E-sign Disclosures and Agreement.</BodySmall>
        </Screen>
    );
}


import { RouteProp } from '@react-navigation/native';
import * as React from 'react';
import { Text } from 'react-native';
import { Screen } from '../components';
import { Body } from '../components/Typography';
import { RootStackParamList } from '../types';

interface ConfirmPIIScreenProps {
    route: RouteProp<RootStackParamList, 'ConfirmPII'>;
}

export default function ConfirmPIIScreen({ route }: ConfirmPIIScreenProps): JSX.Element {
    const data = JSON.stringify(route.params.fieldValues, undefined, 4);

    return (
        <Screen>
            <Text>Confirm PII Screen</Text>
            <Body>
                {data}
            </Body>
        </Screen>
    );
}


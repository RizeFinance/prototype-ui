import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { View } from 'react-native';
import Button from '../components/Button';
import Screen from '../components/Screen';
import { Body, BodySmall, Heading3 } from '../components/Typography';
import { RootStackParamList } from '../types';

interface PatriotActScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'PatriotAct'>;
}

export default function PatriotActScreen({ navigation }: PatriotActScreenProps): JSX.Element {
    return (
        <Screen useScrollView>
            <Heading3
                textAlign='center'
            >
                USA Patriot Act Notice
            </Heading3>
            
            <BodySmall textAlign='center'>
                Scroll to the bottom of the document to accept.
            </BodySmall>

            <Body>&nbsp;</Body>
            <Body>&nbsp;</Body>

            <View
                style={{
                    paddingHorizontal: 32
                }}
            >
                <Body>
                    Important Information About Procedures for Opening a New Account
                </Body>

                <Body>&nbsp;</Body>

                <Body>
                    To help the government fight the funding of terrorism and mony laundering activities,
                    Federal law requires all financial institutions to obtain, verify, and record information
                    that identifies each person who opens an account.
                </Body>

                <Body>&nbsp;</Body>

                <Body>
                    What this means for you: When you open an account, we will ask for your name, address,
                    date of birth, and other information that will allow us to identify you. We may also ask
                    to see your driver&apos;s license or other identifying documents.
                </Body>
            </View>

            <Body>&nbsp;</Body>
            <Body>&nbsp;</Body>

            <BodySmall textAlign='center'>
                By clicking &quot;I Agree&quot; I am acknowledging that I have read and agree to the USA
                Patriot Act.
            </BodySmall>

            <BodySmall>&nbsp;</BodySmall>

            <Button
                title='I Agree'
            />
        </Screen>
    );
}
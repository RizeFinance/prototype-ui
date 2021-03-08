import React  from 'react';
import { RouteProp } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import Screen from '../components/Screen';
import { RootStackParamList } from '../types';

interface PDFReaderScreenProps {
    route: RouteProp<RootStackParamList, 'PDFReader'>;
}

const PDFReaderScreen = ({ route }: PDFReaderScreenProps): JSX.Element => {
    const navigation = useNavigation();
    if (!route.params?.url) {
        return <></>;
    }

    const uri = route.params.url;

    const onPressBack = () => {
        navigation.goBack();
    };

    return (
        <Screen>
            <WebView style={{ flex: 1 }} source={{ uri: uri }} />
            <Button
                title='Back'
                onPress={onPressBack}
            />
        </Screen>
    );
};

export default PDFReaderScreen;
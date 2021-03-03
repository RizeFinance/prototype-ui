import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

export type ScreenProps = View['props'] & {
    useScrollView?: boolean;
}

const Screen = (props: ScreenProps): JSX.Element => {
    const { useScrollView, ...otherProps } = props;
    const Container = useScrollView ? ScrollView : View;

    const defaultStyles = StyleSheet.create({
        container: {
            flex: 1,
        },
        safeAreaView: {
            flex: 1,
        },
        content: {
            flex: 1,
            paddingHorizontal: 16,
        }
    })
    
    return (
        <Container
            bounces={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            style={defaultStyles.container}
        >
            <SafeAreaView
                style={defaultStyles.safeAreaView}
            >
                <View style={defaultStyles.content} {...otherProps} />
            </SafeAreaView>
        </Container>
    );
};

export default Screen;
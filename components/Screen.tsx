import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useThemeColor } from './Themed';

export type ScreenProps = View['props'] & ScrollView['props'] & {
    useScrollView?: boolean;
}

const Screen = (props: ScreenProps): JSX.Element => {
    const {
        useScrollView,
        style,
        bounces = true,
        showsHorizontalScrollIndicator = false,
        keyboardShouldPersistTaps = 'handled',
        ...otherProps
    } = props;

    const Container = useScrollView ? ScrollView : View;

    const background = useThemeColor('background');

    const defaultStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: background,
        },
        safeAreaView: {
            flex: 1,
            backgroundColor: background,
        },
        content: {
            flex: 1,
            paddingHorizontal: 32,
            paddingVertical: 50,
        }
    });

    return (
        <SafeAreaView
            style={defaultStyles.safeAreaView}
        >
            <Container
                bounces={bounces}
                showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
                keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                style={defaultStyles.container}
            >
                <View
                    style={[
                        defaultStyles.content,
                        style
                    ]}
                    {...otherProps}
                />
            </Container>
        </SafeAreaView >
    );
};

export default Screen;
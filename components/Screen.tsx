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
        },
        content: {
            flex: 1,
            paddingHorizontal: 32,
            paddingVertical: 40,
        }
    });
    
    return (
        <Container
            bounces={bounces}
            showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            style={defaultStyles.container}
        >
            <SafeAreaView
                style={defaultStyles.safeAreaView}
            >
                <View
                    style={[
                        defaultStyles.content,
                        style
                    ]}
                    {...otherProps}
                />
            </SafeAreaView>
        </Container>
    );
};

export default Screen;
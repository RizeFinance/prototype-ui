import React from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import Colors from '../constants/Colors';
import { useThemeColor } from './Themed';

export const fontStyles = StyleSheet.create({
    h1: {
        fontSize: 72,
        lineHeight: 108,
        fontFamily: 'Roadgeek',
    },
    h2: {
        fontSize: 48,
        lineHeight: 72,
        fontFamily: 'Roadgeek',
    },
    h3: {
        fontSize: 36,
        lineHeight: 48,
        fontFamily: 'Roadgeek',
    },
    h4: {
        fontSize: 24,
        lineHeight: 36,
        fontFamily: 'Roadgeek',
    },
    body: {
        fontSize: 18,
        lineHeight: 24,
        fontFamily: 'Roadgeek',
    },
    bodySmall: {
        fontSize: 16,
        lineHeight: 21,
        fontFamily: 'Roadgeek',
    }
});

export type TypeProps = TextProps & {
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    color?: keyof typeof Colors.light & keyof typeof Colors.dark;
}

const Type = (defaultStyle: StyleProp<TextStyle>): React.FC<TypeProps> => {
    return ({ style, textAlign, color, ...props }: TypeProps): JSX.Element => (
        <Text
            style={[
                defaultStyle,
                { color: useThemeColor('body') },
                color && { color: useThemeColor(color) },
                textAlign && { textAlign },
                style
            ]}
            {...props}
        />
    );
};

export const Heading1 = Type(fontStyles.h1);
export const Heading2 = Type(fontStyles.h2);
export const Heading3 = Type(fontStyles.h3);
export const Heading4 = Type(fontStyles.h4);
export const Body = Type(fontStyles.body);
export const BodySmall = Type(fontStyles.bodySmall);
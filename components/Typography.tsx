import React from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import Colors from '../constants/Colors';
import { useThemeColor } from './Themed';

export const fontStyles = StyleSheet.create({
    h1: {
        fontSize: 72,
        lineHeight: 108,
        fontFamily: 'OpenSans-Regular',
    },
    h2: {
        fontSize: 48,
        lineHeight: 72,
        fontFamily: 'OpenSans-Regular',
    },
    h3: {
        fontSize: 32,
        lineHeight: 48,
        fontFamily: 'OpenSans-Regular',
    },
    h4: {
        fontSize: 24,
        lineHeight: 36,
        fontFamily: 'OpenSans-Regular',
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'OpenSans-Regular',
    },
    bodySemibold: {
        fontFamily: 'OpenSans-SemiBold',
    },
    bodySmall: {
        fontSize: 14,
        lineHeight: 21,
        fontFamily: 'OpenSans-Regular',
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

export type BodyProps = TypeProps & {
    fontWeight?: 'regular' | 'semibold';
}

export const Body: React.FC<BodyProps> = ({style, fontWeight, ...props}: BodyProps) => {
    const bodyStyles: StyleProp<TextStyle> = [fontStyles.body];

    switch (fontWeight) {
        case 'semibold':
            bodyStyles.push(fontStyles.bodySemibold);
            break;
    }

    return Type(bodyStyles)({ style, ...props });
};

export const BodySmall = Type(fontStyles.bodySmall);
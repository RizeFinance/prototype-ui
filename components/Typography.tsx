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
    h4Semibold: {
        fontFamily: 'OpenSans-SemiBold',
    },
    h4Bold: {
        fontFamily: 'OpenSans-Bold',
    },
    h5: {
        fontSize: 18,
        lineHeight: 30,
        fontFamily: 'OpenSans-Regular',
    },
    h5Semibold: {
        fontFamily: 'OpenSans-SemiBold',
    },
    h5Bold: {
        fontFamily: 'OpenSans-Bold',
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'OpenSans-Regular',
    },
    bodySemibold: {
        fontFamily: 'OpenSans-SemiBold',
    },
    bodyBold: {
        fontFamily: 'OpenSans-Bold',
    },
    bodySmall: {
        fontSize: 14,
        lineHeight: 21,
        fontFamily: 'OpenSans-Regular',
    },
    bodySmallSemibold: {
        fontFamily: 'OpenSans-SemiBold',
    }
});

export type TypeProps = TextProps & {
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    color?: keyof typeof Colors.light & keyof typeof Colors.dark;
}

export type FontWeightProps = {
    fontWeight?: 'regular' | 'semibold' | 'bold';
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

export type Heading4Props = TypeProps & FontWeightProps;

export const Heading4: React.FC<Heading4Props> = ({style, fontWeight, ...props}: Heading4Props) => {
    const heading4Styles: StyleProp<TextStyle> = [fontStyles.h4];

    switch (fontWeight) {
        case 'semibold':
            heading4Styles.push(fontStyles.h4Semibold);
            break;
        case 'bold':
            heading4Styles.push(fontStyles.h4Bold);
            break;
    }

    return Type(heading4Styles)({ style, ...props });
};

export type Heading5Props = TypeProps & FontWeightProps;

export const Heading5: React.FC<Heading5Props> = ({style, fontWeight, ...props}: Heading5Props) => {
    const heading5Styles: StyleProp<TextStyle> = [fontStyles.h5];

    switch (fontWeight) {
        case 'semibold':
            heading5Styles.push(fontStyles.h5Semibold);
            break;
        case 'bold':
            heading5Styles.push(fontStyles.h5Bold);
            break;
    }

    return Type(heading5Styles)({ style, ...props });
};

export type BodyProps = TypeProps & FontWeightProps;

export const Body: React.FC<BodyProps> = ({style, fontWeight, ...props}: BodyProps) => {
    const bodyStyles: StyleProp<TextStyle> = [fontStyles.body];

    switch (fontWeight) {
        case 'semibold':
            bodyStyles.push(fontStyles.bodySemibold);
            break;
        case 'bold':
            bodyStyles.push(fontStyles.bodyBold);
            break;
    }

    return Type(bodyStyles)({ style, ...props });
};

export type BodySmallProps = TypeProps & {
    fontWeight?: 'regular' | 'semibold';
}

export const BodySmall: React.FC<BodySmallProps> = ({style, fontWeight, ...props}: BodySmallProps) => {
    const bodySmallStyles: StyleProp<TextStyle> = [fontStyles.bodySmall];

    switch (fontWeight) {
        case 'semibold':
            bodySmallStyles.push(fontStyles.bodySmallSemibold);
            break;
    }

    return Type(bodySmallStyles)({ style, ...props });
};
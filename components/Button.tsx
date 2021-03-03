import React from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import { useThemeColor } from './Themed';
import { Body } from './Typography';

export type ButtonProps = PressableProps & {
    title: string;
}

const Button = (props: ButtonProps): JSX.Element => {
    const { title, ...otherProps } = props;

    const primary = useThemeColor('primary');
    const primaryAccent = useThemeColor('primaryAccent');

    const defaultStyles = StyleSheet.create({
        pressable: {
            backgroundColor: primary,
            borderRadius: 4,
            padding: 8
        },
        pressableDisabled: {
            opacity: 0.5,
        },
        pressableText: {
            color: primaryAccent
        }
    });

    return (
        <Pressable
            style={[
                defaultStyles.pressable,
                props.disabled && defaultStyles.pressableDisabled
            ]}
            {...otherProps}
        >
            <Body
                style={defaultStyles.pressableText}
                textAlign='center'
            >
                {title}
            </Body>
        </Pressable>
    );
};

export default Button;
import React from 'react';
import { StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { useThemeColor } from './Themed';
import { Body, BodySmall, fontStyles } from './Typography';

export type InputProps = Omit<TextInput['props'], 'style'> & {
    label?: string;
    errorText?: string;
    labelStyle?: TextStyle,
    inputStyle?: StyleProp<TextStyle>,
    containerStyle?: ViewStyle
}

const Input = (props: InputProps): JSX.Element => {
    const {
        label,
        errorText,
        labelStyle,
        inputStyle,
        containerStyle,
        ...otherProps
    } = props;
    
    const border = useThemeColor('border');
    const error = useThemeColor('error');

    const defaultStyles = StyleSheet.create({
        container: {
            marginVertical: 4,
        },
        label: {
            marginHorizontal: 8,
            marginBottom: 4,
        },
        textInput: {
            borderRadius: 4,
            borderColor: border,
            borderWidth: 2,
            padding: 10,
            lineHeight: 18,
        },
        errorTextInput: {
            borderColor: error
        },
        errorText: {
            color: error,
            marginHorizontal: 8,
            marginTop: 4,
        }
    });

    return (
        <View style={[
            defaultStyles.container,
            containerStyle
        ]}>
            {!!label && (
                <Body
                    style={[
                        defaultStyles.label,
                        labelStyle
                    ]}
                >
                    {label}
                </Body>
            )}
            <TextInput
                style={[
                    fontStyles.body,
                    defaultStyles.textInput,
                    !!errorText && defaultStyles.errorTextInput,
                    inputStyle
                ]}
                {...otherProps}
            />
            {!!errorText && (
                <BodySmall
                    style={defaultStyles.errorText}
                >
                    {errorText}
                </BodySmall>
            )}
        </View>
    );
};

export default Input;
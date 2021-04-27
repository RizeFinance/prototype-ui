import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { useThemeColor } from './Themed';
import { Body, BodySmall, fontStyles } from './Typography';

export type DropdownItem = Item;

export type DropdownProps = {
    items: DropdownItem[],
    value?: string;
    label?: string;
    placeholder?: string;
    errorText?: string;
    labelStyle?: TextStyle,
    inputStyle?: StyleProp<TextStyle>;
    containerStyle?: ViewStyle;
    onChange?: (value: any, index: number) => void;
}

const Dropdown = (props: DropdownProps): JSX.Element => {
    const {
        items,
        value,
        label,
        placeholder,
        errorText,
        labelStyle,
        inputStyle,
        containerStyle,
        onChange,
    } = props;

    const body = useThemeColor('body');
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
        input: {
            color: body,
            borderRadius: 4,
            borderColor: border,
            borderWidth: 2,
            padding: 10,
            lineHeight: 20,
        },
        errorInput: {
            borderColor: error
        },
        errorText: {
            color: error,
            marginHorizontal: 8,
            marginTop: 4,
        }
    });

    let actualInputStyle: TextStyle = {
        ...fontStyles.body,
        ...defaultStyles.input
    };

    if (errorText) {
        actualInputStyle = {
            ...actualInputStyle,
            ...defaultStyles.errorInput
        };
    }

    if (inputStyle) {
        actualInputStyle = {
            ...actualInputStyle,
            ...StyleSheet.flatten(inputStyle)
        };
    }

    return (
        <View style={[
            defaultStyles.container,
            containerStyle
        ]}>
            {!!label && (
                <Body
                    fontWeight='semibold'
                    style={[
                        defaultStyles.label,
                        labelStyle
                    ]}
                >
                    {label}
                </Body>
            )}
            <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                onValueChange={(value, index): void => {
                    if (onChange) {
                        onChange(value, index);
                    }
                }}
                style={{
                    inputIOS: actualInputStyle,
                    inputAndroid: actualInputStyle,
                    inputWeb: actualInputStyle,
                }}
                placeholder={{
                    label: placeholder ?? '',
                }}
                items={items}
                value={value}
            />
            {!!errorText && (
                <BodySmall
                    fontWeight='semibold'
                    style={defaultStyles.errorText}
                >
                    {errorText}
                </BodySmall>
            )}
        </View>
    );
};

export default Dropdown;
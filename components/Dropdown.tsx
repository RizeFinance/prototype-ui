import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import RNPickerSelect, { Item, PickerSelectProps } from 'react-native-picker-select';
import { useThemeColor } from '../components';
import { Body, BodySmall, fontStyles } from './Typography';

export type DropdownItem = Item;

export type DropdownProps = {
  items: DropdownItem[];
  value?: string;
  label?: string;
  placeholder?: PickerSelectProps['placeholder'];
  errorText?: string;
  labelStyle?: TextStyle;
  inputStyle?: StyleProp<TextStyle>;
  containerStyle?: ViewStyle;
  onChange?: (value: any, index: number) => void;
  disabled?: boolean;
};

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
    disabled,
  } = props;

  const body = useThemeColor('body');
  const border = useThemeColor('border');
  const error = useThemeColor('error');

  const defaultStyles = StyleSheet.create({
    container: {
      marginVertical: 4,
      borderRadius: 4,
      borderColor: border,
      color: body,
      fontSize: 16,
    },
    label: {
      marginHorizontal: 8,
      marginBottom: 4,
      marginTop: 5,
    },
    input: {
      color: body,
      borderRadius: 4,
      borderColor: border,
      borderWidth: 2,
      padding: 10,
      lineHeight: 20,
      fontSize: 14,
      paddingLeft: 6,
      borderStyle: 'solid',
      backgroundColor: 'transparent',
    },
    errorInput: {
      borderColor: error,
    },
    errorText: {
      color: error,
      marginHorizontal: 8,
      marginTop: 4,
      fontStyle: 'italic',
    },
  });

  let actualInputStyle: TextStyle = StyleSheet.flatten([fontStyles.body, defaultStyles.input]);

  if (errorText) {
    actualInputStyle = {
      ...actualInputStyle,
      ...StyleSheet.flatten(defaultStyles.errorInput),
    };
  }

  if (inputStyle) {
    actualInputStyle = {
      ...actualInputStyle,
      ...StyleSheet.flatten(inputStyle),
    };
  }

  return (
    <View style={[defaultStyles.container, containerStyle]}>
      {!!label && (
        <Body fontWeight="semibold" style={[defaultStyles.label, labelStyle]}>
          {label}
        </Body>
      )}
      <RNPickerSelect
        disabled={disabled}
        useNativeAndroidPickerStyle={false}
        onValueChange={(value, index): void => {
          if (onChange && value) {
            onChange(value, index);
          }
        }}
        style={{
          inputIOS: actualInputStyle,
          inputAndroid: actualInputStyle,
          inputWeb: disabled
            ? { ...StyleSheet.flatten(defaultStyles.input), backgroundColor: '#F0F0F0' }
            : actualInputStyle,
        }}
        placeholder={{ label: placeholder, value: placeholder }}
        items={items}
        value={value}
      />
      {!!errorText && (
        <BodySmall fontWeight="semibold" style={defaultStyles.errorText}>
          {errorText}
        </BodySmall>
      )}
    </View>
  );
};

export default Dropdown;

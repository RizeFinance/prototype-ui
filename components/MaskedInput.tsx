import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useThemeColor } from '.';
import { Body, BodySmall, fontStyles } from './Typography';
import {
  TextInputMask,
  TextInputMaskOptionProp,
  TextInputMaskTypeProp,
} from 'react-native-masked-text';

export type InputProps = {
  label?: string;
  errorState?: boolean;
  errorText?: string;
  labelStyle?: TextStyle;
  inputStyle?: StyleProp<TextStyle>;
  containerStyle?: ViewStyle;
  value: string;
  onChangeText: any;
  placeholder?: string;
  type: TextInputMaskTypeProp;
  options: TextInputMaskOptionProp;
  onBlur: any;
};

const MaskedInput = (props: InputProps): JSX.Element => {
  const {
    type,
    label,
    errorState,
    errorText,
    value,
    onChangeText,
    labelStyle,
    inputStyle,
    containerStyle,
    placeholder,
    options,
    onBlur,
  } = props;

  const border = useThemeColor('border');
  const error = useThemeColor('error');

  const defaultStyles = StyleSheet.create({
    container: {
      marginVertical: 4,
    },
    label: {
      marginBottom: 4,
    },
    textInput: {
      borderRadius: 4,
      borderColor: border,
      borderWidth: 2,
      padding: 10,
      lineHeight: 20,
    },
    errorTextInput: {
      borderColor: error,
    },
    errorText: {
      color: error,
      marginHorizontal: 8,
      marginTop: 4,
    },
  });

  return (
    <View style={[defaultStyles.container, containerStyle]}>
      {!!label && (
        <Body fontWeight="semibold" style={[defaultStyles.label, labelStyle]}>
          {label}
        </Body>
      )}
      <TextInputMask
        value={value}
        type={type}
        onChangeText={onChangeText}
        includeRawValueInChangeText={true}
        placeholder={placeholder}
        options={options}
        onBlur={onBlur}
        style={[
          fontStyles.body,
          defaultStyles.textInput,
          (errorState || !!errorText) && defaultStyles.errorTextInput,
          inputStyle,
        ]}
      />

      {!!errorText && (
        <BodySmall fontWeight="semibold" style={defaultStyles.errorText}>
          {errorText}
        </BodySmall>
      )}
    </View>
  );
};

export default MaskedInput;

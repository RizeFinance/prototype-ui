import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  NativeSyntheticEvent,
  TargetedEvent,
} from 'react-native';
import { useThemeColor } from '.';
import { Body, BodySmall, fontStyles } from './Typography';
import {
  TextInputMask,
  TextInputMaskProps,
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
  onChangeText: TextInputMaskProps['onChangeText'];
  placeholder?: string;
  onBlur: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  type: TextInputMaskTypeProp;
  options: TextInputMaskOptionProp;
};

const MaskedInput = (props: InputProps): JSX.Element => {
  const {
    label,
    errorState,
    errorText,
    value,
    onChangeText,
    labelStyle,
    inputStyle,
    containerStyle,
    placeholder,
    onBlur,
    options,
    type,
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
        type={type}
        options={options}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
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

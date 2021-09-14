import React from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor } from './Themed';
import { Body } from './Typography';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  style?: ViewStyle;
  disabled?: boolean;
};

const Button = (props: ButtonProps): JSX.Element => {
  const { title, style, disabled, ...otherProps } = props;

  const primary = useThemeColor('primary');
  const primaryAccent = useThemeColor('primaryAccent');

  const defaultStyles = StyleSheet.create({
    pressable: {
      backgroundColor: primary,
      borderRadius: 4,
      padding: 8,
      paddingBottom: 11,
      cursor: 'pointer',
      width: '100%',
      
    },
    pressableDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    pressableText: {
      color: primaryAccent,

    },
  });

  return (
    <Pressable
      style={[
        defaultStyles.pressable,
        disabled && defaultStyles.pressableDisabled,
        style,
      ]}
      disabled={disabled}
      {...otherProps}
    >
      <Body
        style={defaultStyles.pressableText}
        textAlign="center"
        fontWeight="semibold"
      >
        {title}
      </Body>
    </Pressable>
  );
};

export default Button;

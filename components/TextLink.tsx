import React, { PropsWithChildren } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Body, Heading5, Heading4 } from './Typography';
import { defaultColors } from '../constants/Colors';

type BaseTextLinkProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  textAlign?: 'center' | 'auto' | 'left' | 'right' | 'justify';
  fontType?: typeof Body | typeof Heading5 | typeof Heading4;
  disabled?: boolean;
};

export type TextLinkProps = PropsWithChildren<BaseTextLinkProps>;

const TextLink = (props: TextLinkProps): JSX.Element => {
  const { children, style, textAlign, fontType, disabled, ...otherProps } = props;

  let justifyContent:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly' = 'flex-start';

  switch (textAlign) {
    case 'center':
      justifyContent = 'center';
      break;
    case 'right':
      justifyContent = 'flex-end';
      break;
  }

  const styles = StyleSheet.create({
    pressable: {
      flexDirection: 'row',
      justifyContent: justifyContent,
      cursor: 'pointer',
    },
    editButton: {
      color: disabled ? defaultColors.gray : defaultColors.primary,
      cursor: disabled ? 'not-allowed' : 'pointer',
      textDecorationLine: 'underline',
      textDecorationColor: defaultColors.primary,
      display: 'flex',
      flexWrap: 'wrap',
    },
  });

  const Text = fontType ?? Body;

  return (
    <Pressable {...otherProps} style={[styles.pressable, style]} disabled={disabled}>
      <View style={{ maxWidth: 350 }}>
        <Text textAlign="center" fontWeight="semibold" style={styles.editButton}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
};

export default TextLink;

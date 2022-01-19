import React, { PropsWithChildren } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useThemeColor } from '../components';
import { Body, Heading5, Heading4 } from './Typography';

type BaseTextLinkProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  textAlign?: 'center' | 'auto' | 'left' | 'right' | 'justify';
  fontType?: typeof Body | typeof Heading5 | typeof Heading4;
};

export type TextLinkProps = PropsWithChildren<BaseTextLinkProps>;

const TextLink = (props: TextLinkProps): JSX.Element => {
  const { children, style, textAlign, fontType, ...otherProps } = props;

  const primary = useThemeColor('primary');

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
    underline: {
      borderColor: primary,
      flex: 1,
      borderBottomWidth: 2,
      opacity: 0.5,
      cursor: 'pointer',
    },
    editButton: {
      color: primary,
      cursor: 'pointer',
    },
  });

  const Text = fontType ?? Body;

  return (
    <Pressable {...otherProps} style={[styles.pressable, style]}>
      <View>
        <Text textAlign="center" fontWeight="semibold" style={styles.editButton}>
          {children}
        </Text>
        <View style={styles.underline}></View>
      </View>
    </Pressable>
  );
};

export default TextLink;

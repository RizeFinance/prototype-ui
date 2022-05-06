import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
  View,
  ActivityIndicator,
} from 'react-native';
import { useThemeColor } from '../components';
import { Body } from './Typography';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
};

const Button = (props: ButtonProps): JSX.Element => {
  const { title, style, disabled, loading = false, ...otherProps } = props;

  const primary = useThemeColor('primary');
  const primaryAccent = useThemeColor('primaryAccent');

  const styles = StyleSheet.create({
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
      cursor: 'not-allowed',
    },
    pressableText: {
      color: primaryAccent,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    spinner: {
      marginRight: 10,
    },
  });

  return (
    <Pressable
      style={[styles.pressable, (disabled || loading) && styles.pressableDisabled, style]}
      disabled={disabled || loading}
      {...otherProps}
    >
      <View style={styles.container}>
        {loading && <ActivityIndicator size="small" color="white" style={styles.spinner} />}
        <Body style={styles.pressableText} textAlign="center" fontWeight="semibold">
          {title}
        </Body>
      </View>
    </Pressable>
  );
};

export default Button;

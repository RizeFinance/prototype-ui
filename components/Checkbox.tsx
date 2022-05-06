import React, { useState, PropsWithChildren } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Body } from './Typography';
import * as Svg from '../assets/svg';

export type CheckboxProps = {
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
};

const defaultStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  pressable: {
    display: 'flex',
    flexDirection: 'row',
  },
  pressableDisabled: {
    opacity: 0.5,
  },
  checkbox: {
    marginRight: 16,
  },
  smallTextCheckbox: {
    marginRight: 8,
  },
});

const Checkbox = (props: PropsWithChildren<CheckboxProps>): JSX.Element => {
  const [checked, setChecked] = useState<boolean>(props.checked);
  const CheckBoxSvg: React.ElementType = checked ? Svg.CheckboxChecked : Svg.CheckboxUnchecked;

  const onPressablePress = (): void => {
    const newCheckedValue = !checked;
    if (props.onChange) {
      props.onChange(newCheckedValue);
    }
    setChecked(newCheckedValue);
  };

  const renderChildren = (props: PropsWithChildren<CheckboxProps>): JSX.Element => {
    return (
      <>
        <View style={{ flex: 1, marginLeft: 10 }}>
          {typeof props.children === 'string' ? <Body>{props.children}</Body> : props.children}
        </View>
      </>
    );
  };

  return (
    <View style={[defaultStyles.container]}>
      <Pressable style={defaultStyles.pressable} onPress={onPressablePress}>
        <CheckBoxSvg height={24} width={24} style={defaultStyles.checkbox} />
      </Pressable>
      {renderChildren(props)}
    </View>
  );
};

export default Checkbox;

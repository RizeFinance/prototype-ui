import React,{useState} from 'react';
import {Pressable, View, PressableProps, StyleSheet} from 'react-native';
import * as Svg from '../assets/svg';

export type CheckboxProps = PressableProps & {
    checked: boolean;   
}

const defaultStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    pressable: {
        display: 'flex',
        flexDirection: 'row',
    },
    pressableDisabled: {
        opacity: 0.5,
    },
    checkbox: {
        marginRight: 16
    },
    smallTextCheckbox: {
        marginRight: 8
    }
});

const Checkbox = (props: CheckboxProps): JSX.Element => {
    const { ...otherProps } = props;
    const [checked, setChecked] = useState<boolean>(props.checked);
    const CheckBoxSvg = checked ? Svg.CheckboxChecked : Svg.CheckboxUnchecked;

    const onPressablePress = (): void => {
        const newCheckedValue = !checked;

        setChecked(newCheckedValue);
    };

    const renderChildren = (props: CheckboxProps): JSX.Element => {
        return (
            <>
                <View style={{ flex: 1 }}>
                    {props.children}
                </View>
            </>
        );
    };

    return(
        <View
            style={[defaultStyles.container]}>
            <Pressable
                style={defaultStyles.pressable}
                {...otherProps}
                onPress={onPressablePress}
            >
                <CheckBoxSvg
                    height={24}
                    width={24}
                    style={defaultStyles.checkbox}
                />
            </Pressable>
            {renderChildren(props)}
        </View>
    );
};

export default Checkbox;
import React,{useState} from 'react';
import {Pressable, PressableProps,StyleSheet} from 'react-native';
import * as Svg from '../assets/svg';
import { useThemeColor } from './Themed';

export type CheckboxProps = PressableProps & {
    checked: boolean;   
}

const Checkbox = (props: CheckboxProps): JSX.Element => {
    const { ...otherProps } = props;
    const [checked, setChecked] = useState<boolean>(props.checked);
    const CheckBoxSvg = checked ? Svg.CheckboxChecked : Svg.CheckboxUnchecked;

    const onPressablePress = (): void => {
        const newCheckedValue = !checked;

        setChecked(newCheckedValue);
    };

    return(
        <Pressable
            {...otherProps}
            onPress={onPressablePress}
            
        >
            <CheckBoxSvg
                height={24}
                width={24}
            />
        </Pressable>
    );
};

export default Checkbox;
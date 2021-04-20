import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useThemeColor } from './Themed';

export type HorizontalLineProps = ViewProps;

const HorizontalLine = (props: HorizontalLineProps): JSX.Element => {
    const { style, ...otherProps } = props;

    const border = useThemeColor('border');

    const styles = StyleSheet.create({
        default: {
            borderBottomWidth: 2,
            borderColor: border,
        },
    });

    return (
        <View style={[styles.default, style]} {...otherProps} />
    );
};

export default HorizontalLine;
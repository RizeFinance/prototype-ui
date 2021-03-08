import React, { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, SafeAreaView, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useThemeColor } from './Themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from './Button';
import { Body, BodySmall } from './Typography';
import moment from 'moment';

export type DatePickerInputProps = {
    label?: string;
    errorText?: string;
    labelStyle?: TextStyle;
    value?: Date;
    initialValue?: Date;
    placeholder?: string;
    containerStyle?: ViewStyle;
    onChange?: (date: Date) => void;
}

const DatePickerInput = (props: DatePickerInputProps): JSX.Element => {
    const [date, setDate] = useState<Date | undefined>(props.value);
    const [temporaryDate, setTemporaryDate] = useState<Date | undefined>(props.value ?? props.initialValue ?? new Date());
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const background = useThemeColor('background');
    const border = useThemeColor('border');
    const error = useThemeColor('error');

    const defaultStyles = StyleSheet.create({
        container: {
            marginVertical: 4,
        },
        label: {
            marginHorizontal: 8,
            marginBottom: 4,
        },
        pressable: {
            borderColor: border,
            borderWidth: 2,
            borderRadius: 4,
            padding: 10,
        },
        pressableText: {
            lineHeight: 18,
        },
        errorPressable: {
            borderColor: error
        },
        placeholder: {
            color: border,
        },
        errorText: {
            color: error,
            marginHorizontal: 8,
            marginTop: 4,
        },
        safeAreaView: {
            flex: 1,
        },
        wrapper: {
            backgroundColor: background,
            paddingHorizontal: 32,
            flex: 1,
            justifyContent: 'center'
        }
    });

    const onPressPressable = (): void => {
        setModalVisible(true);
    };

    const onPressConfirm = (): void => {
        setDate(temporaryDate);
        setModalVisible(false);

        if (props.onChange) {
            props.onChange(temporaryDate ?? new Date());
        }
    };

    useEffect(() => {
        if (props.value !== date) {
            setDate(props.value);
            setTemporaryDate(props.value);
        }
    }, [props.value]);

    useEffect(() => {
        setTemporaryDate(props.value ?? props.initialValue ?? new Date());
    }, [props.initialValue]);

    return (
        <View style={[
            defaultStyles.container,
            props.containerStyle
        ]}>
            {!!props.label && (
                <Body
                    style={[
                        defaultStyles.label,
                        props.labelStyle
                    ]}
                >
                    {props.label}
                </Body>
            )}
            <Pressable
                style={[
                    defaultStyles.pressable,
                    !!props.errorText && defaultStyles.errorPressable
                ]}
                onPress={onPressPressable}
            >
                <Body style={[
                    defaultStyles.pressableText,
                    !!props.placeholder && !date && defaultStyles.placeholder
                ]}>
                    {!date ? (
                        props.placeholder
                    ) : (
                        moment(date).format('MM/DD/yyyy')
                    )}
                </Body>
            </Pressable>
            {!!props.errorText && (
                <BodySmall
                    style={defaultStyles.errorText}
                >
                    {props.errorText}
                </BodySmall>
            )}
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
            >
                <SafeAreaView style={defaultStyles.safeAreaView}>
                    <View
                        style={defaultStyles.wrapper}
                    >
                        <DateTimePicker
                            value={temporaryDate ?? new Date()}
                            mode={'date'}
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={(e, d): void => {
                                setTemporaryDate(d);
                            }}
                        />
                        <Button
                            title='Confirm'
                            onPress={onPressConfirm}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
};

export default DatePickerInput;
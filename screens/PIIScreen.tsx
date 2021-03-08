import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, DatePickerInput, Dropdown, Input, Screen } from '../components';
import { Heading3 } from '../components/Typography';
import states from '../constants/States';

export default function PIIScreen(): JSX.Element {
    const styles = StyleSheet.create({
        formGroup: {
            marginVertical: 10
        }
    });

    return (
        <Screen useScrollView>
            <Heading3 textAlign='center'>
                Enter Your Personal Information
            </Heading3>
            <View style={styles.formGroup}>
                <Input
                    label='First Name'
                    placeholder='First Name'
                />
                <Input
                    label='Middle Name (optional)'
                    placeholder='Middle Name'
                />
                <Input
                    label='Last Name'
                    placeholder='Last Name'
                />
                <Input
                    label='Suffix (optional)'
                    placeholder='Suffix'
                />
            </View>

            <View style={styles.formGroup}>
                <DatePickerInput
                    label='Date of Birth'
                    placeholder='Month/Date/Year'
                />
            </View>

            <View style={styles.formGroup}>
                <Input
                    label='Physical Address'
                    placeholder='Address'
                />
                <Input
                    placeholder='Apt, Unit, ETC'
                />
                <Input
                    placeholder='City'
                />
                <Dropdown
                    placeholder='State'
                    items={states.map(x => ({
                        label: x.name,
                        value: x.code
                    }))}
                />
                <Input
                    placeholder='Zip Code'
                />
            </View>

            <View style={styles.formGroup}>
                <Input
                    label='Phone Number'
                    placeholder='(xxx) xxx-xxxx'
                />
            </View>

            <View style={styles.formGroup}>
                <Input
                    label='Social Security Number'
                    placeholder='xxx-xx-xxxx'
                />
            </View>

            <Button
                title='Submit Information'
                // disabled={isSubmitting}
                // onPress={(): void => handleSubmit()}
                style={{
                    marginTop: 30
                }}
            />
        </Screen>
    );
}


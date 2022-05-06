import React, { useState, useEffect, PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import Checkbox from './Checkbox';
import { Body } from './Typography';
import { set } from 'lodash';

export type OrderCheckboxGroupProps = {
  data: any;
  onChange?: (checked: any) => void;
};

const defaultStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
});

const OrderedCheckboxGroup = (props: PropsWithChildren<OrderCheckboxGroupProps>): JSX.Element => {
  const { data, onChange } = props;
  const [currentOrder, setOrder] = useState<string[]>([]);

  const onChangeOrder = (elm: string, adding: boolean): void => {
    if (adding) {
      setOrder((prevOrder) => [...prevOrder, elm]);
    } else {
      const newOrder = currentOrder.filter((val) => val !== elm);
      setOrder(newOrder);
    }
  };

  useEffect(() => {
    const returnedHash = {};
    currentOrder.map((value: string, index: number) => {
      set(returnedHash, index, value);
    });

    onChange && onChange(returnedHash);
  }, [currentOrder]);

  return (
    <View style={[defaultStyles.container]}>
      {data.map((elm: string, index: number) => {
        const currentIndex = currentOrder.indexOf(elm) >= 0 ? currentOrder.indexOf(elm) + 1 : null;
        return (
          <Checkbox key={index} checked={false} onChange={(value) => onChangeOrder(elm, value)}>
            <Body>
              {currentIndex ? currentIndex + ': ' : ''} {elm}
            </Body>
          </Checkbox>
        );
      })}
    </View>
  );
};

export default OrderedCheckboxGroup;

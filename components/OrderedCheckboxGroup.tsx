import React, { useState, useEffect, PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import Checkbox from './Checkbox';
import { Body } from './Typography';

export type OrderCheckboxGroupProps = {
  data: any;
  value: any;
  onChange?: (checked: any) => void;
};

const defaultStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
});

const OrderedCheckboxGroup = (props: PropsWithChildren<OrderCheckboxGroupProps>): JSX.Element => {
  const { data, onChange, value } = props;
  const startingOrder = [];
  if (value) {
    for (let i = 0; i < Object.keys(value).length; i++) {
      startingOrder.push(value[i]);
    }
  }
  const [currentOrder, setOrder] = useState<string[]>(startingOrder);

  const onChangeOrder = (elm, adding): void => {
    if (adding) {
      setOrder((prevOrder) => [...prevOrder, elm]);
    } else {
      const newOrder = currentOrder.filter((val) => val !== elm);
      setOrder(newOrder);
    }
  };

  useEffect(() => {
    const returnedHash = {};
    currentOrder.forEach((value, index) => {
      returnedHash[index] = value;
    });

    onChange && onChange(returnedHash);
  }, [currentOrder]);

  return (
    <View style={[defaultStyles.container]}>
      {data.map((elm: string, index: number) => {
        const currentIndex = currentOrder.indexOf(elm) >= 0 ? currentOrder.indexOf(elm) + 1 : null;
        return (
          <Checkbox
            key={index}
            checked={currentOrder.includes(elm)}
            onChange={(value) => onChangeOrder(elm, value)}
          >
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

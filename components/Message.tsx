import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { MessageState } from '../types';
import { Body } from './Typography';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});

export const useMessage = () => {
  const [message, setMessage] = useState<MessageState>({});
  return { message, setMessage };
};

const Message = ({ message }: { message: MessageState }) => {
  if (message.status) {
    return (
      <Body
        color={message.status}
        textAlign="center"
        fontWeight="semibold"
        style={styles.container}
      >
        {message.copy}
      </Body>
    );
  } else {
    return <></>;
  }
};

export default Message;

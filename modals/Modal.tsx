import React from 'react';
import RNModal from 'modal-enhanced-react-native-web';
import { useWindowDimensions, StyleSheet, View } from 'react-native';

interface IModal {
  isVisible: boolean;
  children: JSX.Element | JSX.Element[];
}

const Modal = ({ isVisible, children }: IModal): JSX.Element => {
  const { width } = useWindowDimensions();

  const isMobile = width < 640;

  const styles = StyleSheet.create({
    content: {
      backgroundColor: 'white',
      marginHorizontal: isMobile ? 'unset' : 'auto',
      maxWidth: 500,
      width: isMobile ? 'unset' : 500,
      padding: isMobile ? 20 : 50,
      flex: 1,
    },
  });

  return (
    <RNModal isVisible={isVisible} transparent={false}>
      <View style={styles.content}>{children}</View>
    </RNModal>
  );
};

export default Modal;

import React from 'react';
import { View } from 'react-native';
import { Button, Input } from '../components';
import Modal from '../modals/Modal';

interface IAddAccountModal {
  visible: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
  disabled: boolean;
}

const AddAccountModal = ({
  visible,
  setShowModal,
  name,
  setName,
  handleSubmit,
  disabled,
}: IAddAccountModal): JSX.Element => {
  return (
    <Modal isVisible={visible}>
      <View style={{ flex: 1 }}>
        <Input label="Account Name" autoCapitalize={'none'} onChangeText={setName} value={name} />
      </View>
      <View>
        <Button title="Submit" onPress={handleSubmit} disabled={disabled} />
        <View style={{ marginVertical: 20 }}>
          <Button
            style={{ backgroundColor: 'red' }}
            title="Cancel"
            onPress={() => setShowModal(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AddAccountModal;

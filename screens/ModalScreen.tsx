import { useState } from 'react';
import { Caption, Modal, Portal } from 'react-native-paper';

export const ModalScreen = () => {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 20 };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <Caption>Example Modal. Click outside this area to dismiss.</Caption>
      </Modal>
    </Portal>
  );
};

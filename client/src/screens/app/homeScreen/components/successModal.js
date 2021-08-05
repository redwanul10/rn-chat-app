import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

import modalSuccess from '../../../../assets/images/modalSuccess.png';

const SuccessModal = ({visible, onClose}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={style.centeredView}>
          <View style={style.modalStyle}>
            <Image
              style={{width: '100%', height: '100%'}}
              source={modalSuccess}
              resizeMode="stretch"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SuccessModal;

const style = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121E4499',
  },
  modalStyle: {
    width: 340,
    height: 183,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
});

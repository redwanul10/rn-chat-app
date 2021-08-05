import React from 'react';
import {View, Modal, Image, TouchableOpacity} from 'react-native';
import ModalCloseIcon from 'react-native-vector-icons/AntDesign';

export default function ImageViewModal({showModal, setShowModal, image}) {
  return (
    <Modal animationType="fade" transparent visible={showModal}>
      <View>
        <Image
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
          source={{
            uri: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${image}`,
          }}
        />

        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
          }}>
          <TouchableOpacity
            style={[
              {
                padding: 10,
              },
            ]}
            onPress={() => setShowModal(false)}>
            <ModalCloseIcon
              style={{color: 'tomato'}}
              name="closecircleo"
              size={50}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

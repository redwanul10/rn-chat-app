import React from 'react';
import {View, Text} from 'react-native';

/* 

 **** Not Implement **** 

*/
export default function PopUpModal() {
  return (
    <Modal animationType="fade" transparent visible={showModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalStyle}>
          <Text style={styles.updateAvailable}>
            Are you sure to {isRejected ? 'reject' : 'approve'}?
          </Text>

          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View style={styles.updateButtons}>
              <TouchableOpacity
                onPress={() => {
                  if (isRejected) {
                    saveHandler(formikprops?.values);
                  } else {
                    saveHandler(formikprops?.values);
                  }
                }}
                style={[
                  styles.updateButtonStyle,
                  {backgroundColor: '#063197'},
                ]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  {isRejected ? 'Reject' : 'Approve'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.updateButtons}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  setIsRejected(false);
                }}
                style={[styles.updateButtonStyle, {backgroundColor: 'tomato'}]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Cencel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  updateAvailable: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 27,
    fontSize: 20,
    color: '#063197',
    fontWeight: 'bold',
  },
  updateButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0,
  },
  updateButtonStyle: {
    width: 100,
    margin: 2,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 15,
  },
});

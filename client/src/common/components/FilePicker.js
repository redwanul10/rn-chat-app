import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import CustomButton from './CustomButton';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/Entypo';

const FilePicker = ({
  onSelect,
  btnText,
  multiple,
  isIconBtn,
  type,
  disabled,
}) => {
  // Pick a single file
  const selectSingleFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: type || [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      onSelect(res);
    } catch (err) {}
  };

  // Pick a single file
  const selectMultiFile = async () => {
    try {
      const res = await DocumentPicker.pickMultiple({
        type: type || [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      onSelect(res);
    } catch (err) {}
  };

  if (isIconBtn) {
    return (
      <>
        <TouchableOpacity
          disabled={disabled}
          onPress={(e) => {
            if (multiple) {
              selectMultiFile();
            } else {
              selectSingleFile();
            }
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              style={{
                backgroundColor: '#063197',
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 5,
              }}>
              <Icon name="attachment" size={25} style={{color: 'white'}} />
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <CustomButton
      onPress={(e) => {
        if (multiple) {
          selectMultiFile();
        } else {
          selectSingleFile();
        }
      }}
      btnTxt={btnText || 'Attatchment'}
    />
  );
};

export default FilePicker;

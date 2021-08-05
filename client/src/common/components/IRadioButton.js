import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';

const IRadioButton = ({onPress, ...props}) => {
  return (
    <TouchableOpacity
      onPress={() => (onPress ? onPress() : null)}
      style={[styles.mainStyle]}>
      <TouchableOpacity
        style={props?.selected === true ? styles.selectedStyle : null}
      />
    </TouchableOpacity>
  );
};

export default IRadioButton;

const styles = StyleSheet.create({
  selectedStyle: {
    height: 10,
    width: 10,
    borderRadius: 6,
    backgroundColor: '#063197',
  },
  mainStyle: {
    height: 20,
    width: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#063197',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

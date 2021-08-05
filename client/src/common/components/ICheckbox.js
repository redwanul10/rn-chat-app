import React from 'react';
import {StyleSheet} from 'react-native';
import {CheckBox} from 'native-base';

const ICheckbox = ({styles, checked, ...props}) => {
  return (
    <CheckBox
      checked={checked}
      style={[style.checkbox, styles || {}]}
      {...props}
    />
  );
};

export default ICheckbox;

const style = StyleSheet.create({
  checkbox: {
    borderRadius: 3,
    transform: [{scale: 0.9}],
    marginRight: 15,
    width: 24,
    height: 22,
    paddingTop: 0,
  },
});

import React from 'react';
import {TouchableOpacity, View, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {btnBgPrimary} from '../theme/color';

const QuantityInputBox = ({
  onIncrement,
  value,
  onChange,
  onDecrement,
  ...props
}) => {
  return (
    <View style={[style.container, props?.style || {}]}>
      {/* Increment Btn */}
      {onIncrement && (
        <TouchableOpacity style={style.quantityBtn} onPress={onIncrement}>
          <Icon name="plus" size={17} color="white" />
        </TouchableOpacity>
      )}
      {/* Quantity Input BOx */}
      <TextInput
        value={value}
        keyboardType="numeric"
        textAlign="center"
        style={style.quantityBox}
        onChangeText={(text) => {
          if (onChange) onChange(text);
        }}
      />
      {/* Decrement Btn */}
      {onDecrement && (
        <TouchableOpacity
          style={style.quantityBtn}
          onPress={() => {
            if (value === 0 || value > 0) onDecrement();
          }}>
          <Icon name="minus" size={17} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default QuantityInputBox;

const style = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center'},
  quantityBtn: {
    width: 24,
    height: 24,
    borderRadius: 15,
    backgroundColor: btnBgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBox: {
    marginHorizontal: 10,
    height: 25,
    width: 50,
    paddingVertical: -15,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 3,
  },
});

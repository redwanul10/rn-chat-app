import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';

export default function MiniButton({
  btnText,
  onPress,
  color,
  containerStyle,
  textStyle,
  disabled,
}) {
  return (
    <>
      <View
        style={[
          {flexDirection: 'row', marginTop: 5},
          containerStyle ? containerStyle : {justifyContent: 'flex-end'},
        ]}>
        <TouchableOpacity
          disabled={disabled}
          onPress={() => (onPress ? onPress() : null)}>
          <Text
            style={[
              styles.editBtn,
              {backgroundColor: !color ? '#00cdac' : color},
              textStyle ? textStyle : {},
            ]}>
            {btnText}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  editBtn: {
    color: 'white',
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

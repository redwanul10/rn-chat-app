import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { btnBgSecondary } from '../theme/color';


function FabButton(props) {
  return (
    <>
      <TouchableOpacity
        onPress={() => props.onPress()}
        style={[
          styles.fabStyle,
          {backgroundColor: btnBgSecondary || '#00cdac' || props.bgColor},
        ]}>
        <Icon name="plus" size={40} color={props.iconColor || '#ffffff'} />
      </TouchableOpacity>
    </>
  );
}

export default FabButton;

const styles = StyleSheet.create({
  fabStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    top: '80%',

    right: 17,
    height: 60,

    borderRadius: 100,
  },
});

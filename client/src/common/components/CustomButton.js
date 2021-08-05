import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {Spinner, Button} from 'native-base';
import Icon from 'react-native-vector-icons/Entypo';
import {btnBgPrimary} from '../theme/color';

function CustomButton(props) {
  return (
    <>
      <Button
        disabled={props.disabled}
        block
        style={[
          styles.btnStyle,
          // {backgroundColor: props.bgColor || '#063197' || '#57606F'},
          {backgroundColor: props.bgColor || btnBgPrimary},
          props?.style || {},
        ]}
        onPress={() => props.onPress()}>
        <Text style={[styles.btnText, props.textStyle || {}]}>
          {props.btnTxt}
        </Text>

        {props.isLoading && (
          <Spinner
            color="white"
            style={{transform: [{scaleX: 0.6}, {scaleY: 0.6}]}}
          />
        )}
        {props?.icon && (
          <Icon
            name={props?.icon}
            size={17}
            color="white"
            style={{marginLeft: 10}}
          />
        )}
      </Button>
    </>
  );
}

export default CustomButton;

const styles = StyleSheet.create({
  btnText: {
    color: '#ffffff',
    // fontWeight: 'bold',
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
  btnStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
});

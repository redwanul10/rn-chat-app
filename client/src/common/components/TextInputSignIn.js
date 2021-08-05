import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FormInputSignIn = (props) => {
  const {
    placeholder,
    formikProps,
    name,
    label,
    secureTextEntry,
    containerStyle,
    inputStyle,
    onRef,
    disabled,
  } = props;

  const isError =
    formikProps.touched[name] && formikProps.errors[name] ? true : false;

  const value =
    props?.keyboardType === 'numeric'
      ? formikProps.values[name]?.toString()
      : formikProps.values[name];

  return (
    <>
      <View style={[style.inputWrapper, containerStyle || {}]}>
        <Text
          style={[
            style.label,
            {fontWeight: 'bold', color: isError ? 'red' : 'black'},
          ]}>
          {label}
        </Text>
        <View
          style={[
            style.input,
            inputStyle || {},
            {
              borderColor: isError ? 'red' : 'rgba(99, 99, 99,0.2)',
              flexDirection: 'row',
              alignItems: 'center',
            },
            disabled ? style.disabled : {},
          ]}>
          <Icon
            name={props?.initialIcon}
            color="grey"
            style={props?.iconStyle}
            size={18}
          />
          <TextInput
            // ref={ref => onRef(ref)}
            style={{width: '85%', marginLeft: 5}}
            onChangeText={formikProps.handleChange(name)}
            onFocus={formikProps.onFocus}
            onBlur={(e) => {
              formikProps.setFieldTouched(name, true);
            }}
            editable={disabled ? false : true}
            value={value}
            secureTextEntry={props.secureTextEntryState}
            placeholder={placeholder}
            {...props}
          />
          {props?.endIcon && (
            <TouchableOpacity
              onPress={() => {
                props?.togglePassword();
              }}>
              <Icon color="grey" name={props?.endIcon} size={15} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {formikProps.touched[name] && formikProps.errors[name] && (
        <Text style={style.error}>{formikProps.errors[name]}</Text>
      )}
    </>
  );
};

const style = StyleSheet.create({
  label: {
    fontSize: 14,
    // fontFamily: 'Rubik-Regular',
  },
  error: {
    color: 'red',
    fontSize: 10,
    marginTop: -8,
    marginBottom: 5,
  },
  inputWrapper: {
    marginBottom: 10,
  },

  input: {
    // borderBottomWidth: 1,
    // borderBottomColor: "grey",
    // borderBottomWidth: 0.5,
    // borderBottomColor: "#AEAEAE",
    backgroundColor: '#F0F2F2',
    // paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 3,
    color: 'black',
    marginTop: 5,
    // fontFamily: 'Rubik-Medium',
    borderWidth: 1,
    borderColor: '#E4E9F2',
    height:50
  },
  formHeader: {
    marginBottom: 23,
  },
  disabled: {backgroundColor: 'rgba(99, 99, 99,0.2)'},
});

export default FormInputSignIn;

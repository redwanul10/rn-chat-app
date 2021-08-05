import React, {useRef} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

const FormInput = (props) => {
  const {
    placeholder,
    formikProps,
    name,
    label,
    secureTextEntry,
    containerStyle,
    inputStyle,
    onRef,
    onChange,
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
        {label && (
          <Text
            style={[
              style.label,
              {fontFamily: 'OpenSans-Bold', color: isError ? 'red' : 'black'},
            ]}>
            {label}
          </Text>
        )}

        <TextInput
          // ref={ref => onRef(ref)}
          style={[
            style.input,
            inputStyle || {},
            {
              backgroundColor: '#ffffff',
              borderRadius: 5,
            },
            {borderColor: isError ? 'red' : 'rgba(99, 99, 99,0.2)'},
            disabled ? style.disabled : {},
          ]}
          onChangeText={formikProps.handleChange(name)}
          onFocus={formikProps.onFocus}
          onBlur={(e) => {
            formikProps.setFieldTouched(name, true);
          }}
          editable={disabled ? false : true}
          value={value}
          secureTextEntry={secureTextEntry || false}
          placeholder={placeholder}
          {...props}
        />
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
    // marginBottom:6
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
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 3,
    color: 'black',
    marginTop: 5,
    // fontFamily: 'Rubik-Medium',
    borderWidth: 1,
    borderColor: '#E4E9F2',
    height: 38,
  },
  formHeader: {
    marginBottom: 23,
  },
  disabled: {backgroundColor: 'rgba(99, 99, 99,0.2)'},
});

export default FormInput;

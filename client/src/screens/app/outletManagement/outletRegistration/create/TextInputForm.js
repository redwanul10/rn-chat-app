import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

const TextInputForm = (props) => {
  const {placeholder, formikProps, name, label, secureTextEntry} = props;

  const isError =
    formikProps.touched[name] && formikProps.errors[name] ? true : false;

  return (
    <>
      <Text style={[style.label, {color: isError ? 'red' : '#000000'}]}>
        {label}
      </Text>
      <TextInput
        onChangeText={formikProps.handleChange(name)}
        onFocus={formikProps.onFocus}
        onBlur={(e) => {
          formikProps.setFieldTouched(name, true);
        }}
        value={formikProps.values[name]}
        secureTextEntry={secureTextEntry || false}
        placeholder={placeholder}
        {...props}
      />
      <View style={style.divider} />
      <Text style={style.textError}>
        {formikProps.touched[name] && formikProps.errors[name]}
      </Text>
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
    backgroundColor: '#F0F2F2',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 3,
    color: 'black',
    marginTop: 5,
    // fontFamily: 'Rubik-Medium',
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  formHeader: {
    marginBottom: 23,
  },
  divider: {
    backgroundColor: '#AEAEAE',
    height: 1.5,
  },
  textError: {
    color: 'red',
  },
});

export default TextInputForm;

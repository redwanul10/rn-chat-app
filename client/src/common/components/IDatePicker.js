import React, {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/AntDesign';
import {_dateFormatter} from '../functions/_dateFormatter';
import {_IDatePickerFormatter} from '../functions/_IDatePickerFormatter';
import {_todayDate} from '../functions/_todayDate';

const IDatePicker = (props) => {
  const {
    placeholder,
    formikProps,
    name,
    label,
    wrapperStyle,
    value,
    labelStyle,
    secureTextEntry,
    options,
    // onChange,
    disabled,
  } = props;

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  // Detect is Error Message Exist or not
  const isError =
    formikProps?.touched[name] && formikProps?.errors[name] ? true : false;

  const onChange = (selectedDate, isIosDatePicker) => {
    
    if (!isIosDatePicker) setShow(false);

    if (selectedDate || value || formikProps?.values[name]) {
      const currentDate =
        selectedDate || new Date(value || formikProps?.values[name]) || date;

      // if (!isIosDatePicker) setShow(false);

      if (props?.onChange) {
        props?.onChange(currentDate);
      } else {
        formikProps.setFieldValue(name, _dateFormatter(currentDate));
      }
    }
  };

  const showMode = (currentMode) => {
    if (Platform.OS === 'ios') {
      setShow(!show);
    } else {
      setShow(true);
    }

    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  return (
    <>
      <View
        style={[
          style.inputWrapper,
          {
            borderBottomWidth: isError ? 1.5 : 0,
            borderColor: isError ? 'red' : 'rgba(99, 99, 99,0.2)',
          },
        ]}>
        {/* Input Field Label */}
        <Text
          style={[
            labelStyle || {},
            {fontFamily: 'OpenSans-Bold', color: isError ? 'red' : 'black'},
          ]}>
          {label}
        </Text>

        <TouchableOpacity onPress={(e) => showDatepicker()} disabled={disabled}>
          <View
            style={[
              style.box,
              {
                backgroundColor: disabled ? 'rgba(99, 99, 99,0.2)' : '#ffffff',
                borderRadius: 5,
              },
              wrapperStyle || {},
            ]}>
            {/* Selected Date */}
            <Text style={[style.label]}>
              {_IDatePickerFormatter(value || formikProps?.values[name]) ||
                'Select'}
            </Text>

            <Icon
              style={{position: 'absolute', right: 10, bottom: 10}}
              name="calendar"
              color="black"
              size={14}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Android Date Picker */}
      {show && Platform.OS === 'android' && (
        <DateTimePicker
          testID="dateTimePicker"
          // value={date}
          value={new Date(value || formikProps?.values[name] || _todayDate())}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={(e, selectedDate) => onChange(selectedDate, false)}
        />
      )}

      {/* IOS date picker */}
      {Platform.OS === 'ios' && (
        <Modal visible={show} animationType="slide" transparent={true}>
          {/* <TouchableWithoutFeedback onPress={() => setShow(!show)}> */}
          <View style={style.iosModaContentWrapper}>
            <View style={style.iosModaContent}>
              {/* Ios Spinner Date picker */}
              <DateTimePicker
                testID="dateTimePicker"
                // value={date}
                value={new Date(value || formikProps?.values[name])}
                mode="date"
                is24Hour={true}
                display="spinner"
                onChange={(e, selectedDate) => onChange(selectedDate, true)}
              />

              {/* Date Select Btn */}
              <TouchableOpacity
                onPress={() => setShow(!show)}
                style={style.iosBtnWrapper}>
                {/* <Text style={style.iosBtn}>Select</Text> */}
                <Icon
                  style={{fontWeight: 'bold'}}
                  name="closecircle"
                  color="white"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* </TouchableWithoutFeedback> */}
        </Modal>
      )}

      {/* Error Message */}

      {formikProps &&
        formikProps?.touched[name] &&
        formikProps?.errors[name] && (
          <Text style={style.error}>{formikProps?.errors[name]?.value}</Text>
        )}
    </>
  );
};

export default IDatePicker;

const style = StyleSheet.create({
  label: {
    fontSize: 14,
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
    padding: 0,
    color: 'black',
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    marginVertical: 5,
    borderRadius: 10,
    // backgroundColor: "#0000000F",
    padding: 9,
    paddingLeft: 12,
  },
  modalInner: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    width: '80%',
    maxHeight: '40%',
    // height: 300,
    backgroundColor: 'white',
  },
  item: {
    paddingVertical: 6,
  },
  disabled: {backgroundColor: 'rgba(99, 99, 99,0.2)'},
  iosModaContentWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    marginBottom: 70,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  iosModaContent: {
    height: 250 || '30%',
    backgroundColor: 'white',
    borderRadius: 20,
  },
  iosBtnWrapper: {
    backgroundColor: '#063197',
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
    // width: '40%',
    borderRadius: 50,
    alignSelf: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  iosBtn: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
});

// const IDatePicker = (props) => {
//   const {
//     placeholder,
//     formikProps,
//     name,
//     label,
//     // style,
//     secureTextEntry,
//   } = props;

//   const [modalActive, setModalActive] = useState(false);
//   const isError =
//     formikProps.touched[name] && formikProps.errors[name] ? true : false;

//   const [date, setDate] = useState(new Date());
//   const [mode, setMode] = useState('date');
//   const [show, setShow] = useState(false);

//   const onChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShow(Platform.OS === 'ios');
//     formikProps.setFieldValue(name, currentDate.toISOString().split('T')[0]);
//   };

//   const showMode = (currentMode) => {
//     setShow(true);
//     setMode(currentMode);
//   };

//   const showDatepicker = () => {
//     showMode('date');
//   };

//   return (
//     <>
//       <View style={[style.inputWrapper]}>
//         <TouchableOpacity onPress={(e) => showDatepicker()}>
//           <Text style={[style.label, {color: isError ? 'red' : '#636363'}]}>
//             {label}
//           </Text>
//           <TextInput
//             editable={false}
//             style={[style.input]}
//             onChangeText={formikProps.handleChange(name)}
//             onFocus={formikProps.onFocus}
//             onBlur={(e) => {
//               formikProps.setFieldTouched(name, true);
//               // formikProps.handleBlur(name)
//             }}
//             value={formikProps.values[name]}
//             secureTextEntry={secureTextEntry || false}
//             placeholder={'Select'}
//             placeholderTextColor="black"
//             {...props}
//           />
//           {/* <DatePicker
//                         defaultDate={formikProps.values.name}
//                         // minimumDate={new Date(2018, 1, 1)}
//                         // maximumDate={new Date(2018, 12, 31)}
//                         locale={"en"}
//                         timeZoneOffsetInMinutes={undefined}
//                         modalTransparent={false}
//                         animationType={"fade"}
//                         androidMode={"default"}
//                         placeHolderText={formikProps.values.name ? formikProps.values.name : null}
//                         textStyle={style.input}
//                         placeHolderTextStyle={style.input}
//                         onDateChange={formikProps.handleChange(name)}
//                         disabled={false}
//                     /> */}
//           {show && (
//             <DateTimePicker
//               testID="dateTimePicker"
//               value={date}
//               mode="Date"
//               is24Hour={true}
//               display="default"
//               onChange={onChange}
//             />
//           )}
//         </TouchableOpacity>
//       </View>

//       {formikProps.touched[name] && formikProps.errors[name] && (
//         <Text style={style.error}>{formikProps.errors[name]}</Text>
//       )}
//     </>
//   );
// };

// export default IDatePicker;

// const style = StyleSheet.create({
//   label: {
//     fontSize: 14,
//     fontFamily: 'Rubik-Regular',
//   },
//   error: {
//     color: 'red',
//     fontSize: 9,
//     marginTop: -8,
//     marginBottom: 5,
//   },
//   inputWrapper: {
//     marginBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: 'grey',
//   },

//   input: {
//     // backgroundColor:"red",

//     padding: 0,
//     fontFamily: 'Rubik-Medium',
//     color: 'black',
//     // height:30,
//     fontSize: 14,
//     // fontWeight: "bold"
//   },
//   formHeader: {
//     marginBottom: 23,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 24,
//     justifyContent: 'center',
//     position: 'relative',
//   },
// });

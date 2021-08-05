import React from 'react';
import {Text, StyleSheet} from 'react-native';

const IText = (props) => {
  const textStyle =
    Object.prototype.toString.call(props?.style) === '[object Array]'
      ? [{fontFamily: 'OpenSans-Regular'}, ...props?.style, style.default]
      : [{fontFamily: 'OpenSans-Regular'}, props?.style, style.default];

  const isBold = JSON.stringify(textStyle).includes('fontWeight');

  return (
    <Text {...props} style={[...textStyle, isBold ? style?.bold : {}]}>
      {props?.children}
    </Text>
  );
};

export default IText;

const style = StyleSheet.create({
  bold: {
    fontWeight: 'normal',
    fontFamily: 'OpenSans-Bold',
    // fontFamily:"OpenSans-SemiBold",
  },
  default: {
    // fontWeight: 'normal',
    // fontFamily: 'HelveticaNeue',
  },
});

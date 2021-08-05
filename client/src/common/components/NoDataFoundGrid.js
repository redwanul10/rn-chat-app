/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function NoDataFoundGrid({style, message}) {
  return (
    <View style={[style, styles.cardStyle]}>
      <Text style={{textAlign: 'center'}}>
        {message ? message : 'No Data Found'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
});

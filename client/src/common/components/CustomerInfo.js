import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function CustomerInfo(props) {
  return (
    <>
      <View style={[styles.customerHead, {marginTop: 30}]}>
        <Text style={styles.text}>Customer Name</Text>
        <Text style={styles.text}>Balance</Text>
      </View>
      <View style={[styles.customerHead, {marginBottom: 15}]}>
        <Text style={styles.customerFont}>Mr. Bashir</Text>
        <Text style={styles.customerFont}>BDT 100000</Text>
      </View>
    </>
  );
}

export default CustomerInfo;
const styles = StyleSheet.create({
  customerHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  text: {
    color: '#636363',
    fontSize: 14,
  },
  customerFont: {
    fontWeight: 'bold',
  },
});

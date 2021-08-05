import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

export default function TodaysSalesAndTwdDwdRdwSection({infoArry, todaySales}) {
  return (
    <View style={{alignItems: 'center', marginVertical: 10}}>
      <Text style={{color: '#fff', fontSize: 20}}>Today's Sales</Text>
      <Text style={styles.todayStyle}>
        {/* this is bengali taka sign */} {/* {'\u09F3'} */}
        <Text style={{fontSize: 20}}>BDT</Text> {todaySales}
      </Text>
      <Image source={require('../../../../assets/rectangle.png')} />

      {/* TWD, DWD, RWD | Last Added | Remove from card Section */}
      <View style={{flexDirection: 'row'}}>
        <View style={{marginTop: 10, marginHorizontal: 15}}>
          <Text style={[{fontSize: 15, color: 'white', fontWeight: 'bold'}]}>
            TWD = {infoArry[0]?.amount}
          </Text>
        </View>
        <View style={{marginTop: 10, marginHorizontal: 15}}>
          <Text style={[{fontSize: 15, color: 'white', fontWeight: 'bold'}]}>
            DWD = {infoArry[1]?.amount}
          </Text>
        </View>
        <View style={{marginTop: 10, marginHorizontal: 15}}>
          <Text style={[{fontSize: 15, color: 'white', fontWeight: 'bold'}]}>
            RWD = {infoArry[2]?.amount}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  todayStyle: {
    color: '#fff',
    fontSize: 35,
    alignSelf: 'center',
  },
});

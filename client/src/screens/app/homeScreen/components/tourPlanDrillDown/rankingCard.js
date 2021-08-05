import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';

export default function RankingCard({item}) {
  return (
    <View style={[styles.shortInfo]}>
      <Text
        style={{
          fontSize: 20,
          color: 'white',
          fontWeight: 'bold',
        }}>
        {item?.rank} / {item?.total}
      </Text>
      {item?.employeeName ? (
        <Text style={{fontSize: 17, fontWeight: 'bold', color: 'white'}}>
          {item?.employeeName}
        </Text>
      ) : null}

      <Text style={{fontSize: 13, fontWeight: 'bold', color: 'white'}}>
        {item?.locationName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shortInfo: {
    backgroundColor: '#28a745',
    // marginBottom: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 10,
  },
});

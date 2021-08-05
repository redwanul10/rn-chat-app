import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {btnBgSecondary} from '../../../../../common/theme/color';

export default function ProgressBarCard({
  onPress,
  title,
  width,
  strikeRateNotPercentage,
  totalWidth,
  isTakaSign,
}) {
  return (
    <TouchableOpacity onPress={() => onPress()}>
      <View style={[styles.cardWrapper, {marginTop: 10}]}>
        <View style={[styles.title]}>
          <Text>{title}</Text>
        </View>
        <View style={[styles.container]}>
          <View style={[styles.bar, {width: totalWidth || width}]}></View>
        </View>
        <View>
          <Text style={[styles.text]}>
            {isTakaSign && '৳'} {/* (৳) This For ADT & RADT */}
            {strikeRateNotPercentage || width}{' '}
            {/*strikeRateNotPercentage For ADT & RADT  */}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    borderRadius: 50,
    overflow: 'hidden',
  },
  bar: {
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: btnBgSecondary, // Mini Button Default Color
  },
  text: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  cardWrapper: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
  },
  title: {marginBottom: 10},
});

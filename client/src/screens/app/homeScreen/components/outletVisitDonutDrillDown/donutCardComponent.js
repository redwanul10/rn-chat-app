import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {btnBgSecondary} from '../../../../../common/theme/color';
import DonutChart from '../../../../../common/components/DonutChart';

export default function DonutCardComponent({outletVisitData}) {
  return (
    <View style={[styles.shortInfo, {padding: 20}]}>
      <Text style={styles.storeVisitStyle}>
        {outletVisitData?.territoryName}
      </Text>
      <DonutChart
        totalTarget={outletVisitData?.target}
        percentage={outletVisitData?.totalPercentage}
      />

      {/* Visited | Pending Section */}
      <View style={styles.overView}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View style={{top: -100}}>
            <Text style={styles.infoNum}>{outletVisitData?.visited}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.pointer} />
              <Text style={styles.infoText}>Visited</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View style={{top: -100}}>
            <Text style={styles.infoNum}>{outletVisitData?.pending}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={[styles.pointer]} />
              <Text style={styles.infoText}>Pending</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Order | No Order Section */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: -55,
        }}>
        <View>
          <Text style={styles.infoNum}>{outletVisitData?.order}</Text>
          <Text style={[styles.infoText]}>Order</Text>
        </View>
        <View>
          <Text style={styles.infoNum}>{outletVisitData?.noOrder}</Text>
          <Text style={[styles.infoText]}>No Order</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shortInfo: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 28,
  },
  storeVisitStyle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  overView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pointer: {
    backgroundColor: btnBgSecondary,
    borderRadius: 5,
    height: 5,
    width: 5,
  },
  infoNum: {
    alignSelf: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  infoText: {
    left: 5,
    color: btnBgSecondary,
    fontWeight: 'bold',
  },
});

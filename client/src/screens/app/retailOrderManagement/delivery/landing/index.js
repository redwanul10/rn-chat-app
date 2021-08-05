import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import Text from '../../../../../common/components/IText';

function LandingDelivery({navigation}) {
  return (
    <>
      <CommonTopBar />
      <View style={styles.iconContainer}>
        <View>
          <TouchableOpacity
            style={styles.iconStyle}
            onPress={() => navigation.navigate('Retail Order Base Delivery')}>
            <Image
              source={require('../../../../../assets/retail_order_base_delivery.png')}
            />
          </TouchableOpacity>
          <Text style={{alignSelf: 'center'}}>Retail Order Base Delivery</Text>
        </View>

        <View>
          <TouchableOpacity
            style={styles.iconStyle}
            onPress={() => navigation.navigate('Retail Order Direct Delivery')}>
            <Image
              source={require('../../../../../assets/retail_order_direct_delivery.png')}
            />
          </TouchableOpacity>
          <Text style={{alignSelf: 'center'}}>Outlet Direct Delivery</Text>
        </View>
      </View>
    </>
  );
}

export default LandingDelivery;
const styles = StyleSheet.create({
  iconStyle: {
    backgroundColor: '#DBE4F9',
    alignItems: 'center',
    paddingVertical: 25,
    width: 150,
    borderRadius: 7,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 30,
  },
});

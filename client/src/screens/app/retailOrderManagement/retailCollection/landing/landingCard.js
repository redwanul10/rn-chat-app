import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { globalStyles } from '../../../../../common/globalStyle/globalStyles';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';


function LandingCard({item,navigation}) {
  return (
    <View>
      <Row colGap={5} style={globalStyles.retailColCardStyle}>
        <Col width="50%">
          <Text
            style={[
              styles.customerAmount,
            ]}>
            {item?.outletName} {item?.cooler && '(Cooler)'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 8,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Retail Order Direct Delivery View', {
                  id: item?.deliveryId, // ...formikprops?.values,
                });
              }}
              style={styles.createButton}>
              <Text
                style={{
                  color: '#ffffff',
                }}>
                View
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Retail Collection Create', {
                  ...item,
                  collectionAmount: 0,
                });
              }}
              style={styles.createButton}>
              <Text
                style={{
                  color: '#ffffff',
                }}>
                Collection
              </Text>
            </TouchableOpacity>
          </View>
        </Col>
        <Col width="50%">
          <View
            style={[
              styles.cardStyle,
              {
                justifyContent: 'flex-end',
              },
            ]}>
            <View
              style={{
                flexDirection: 'column',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'right',
                  fontSize: 15,
                  color: 'tomato',
                }}>
                {/* Assign By Iftakhar Alam */}
                {item?.dueAmount?.toFixed(3)
                  ? item?.dueAmount?.toFixed(3)
                  : item?.dueAmount}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'right',
                  fontSize: 15,
                  color: 'green',
                }}>
                {/* Assign By Iftakhar Alam */}
                {item?.receiveAmount?.toFixed(3)
                  ? item?.receiveAmount?.toFixed(3)
                  : item?.receiveAmount}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'right',
                  fontSize: 15,
                }}>
                {item?.totalOrderQty}
              </Text>
            </View>
          </View>
        </Col>
      </Row>
    </View>
  );
}

export default LandingCard;

const styles = StyleSheet.create({
  customerAmount: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
  },

  cardStyle: {
    flexDirection: 'row',
  },
  teritoryText: {
    color: '#000000',
    paddingRight: 10,
    paddingVertical: 5,
    opacity: 0.75,
  },
  completeButton: {
    marginLeft: 10,
    backgroundColor: '#D1FFDF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#D2D2D2',
  },
  createButton: {
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,

    backgroundColor: '#00cdac',
    borderRadius: 7,
    alignItems: 'center',
  },
});

import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {globalStyles} from '../../../../../common/globalStyle/globalStyles';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';

function DemoLandingCard() {
  return (
    <Row colGap={5} style={globalStyles.retailColCardStyle}>
      <Col width="50%">
        <Text style={[styles.customerAmount, {color: 'black'}]}>
          Outlet Name
        </Text>
        <Text style={[{color: 'black', fontWeight: 'bold', marginTop: 5}]}>
          Actions
        </Text>
      </Col>
      <Col width="50%">
        <View style={[styles.cardStyle, {justifyContent: 'flex-end'}]}>
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 13,
                color: 'tomato',
                textAlign: 'right',
              }}>
              Due Amount
            </Text>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 13,
                color: 'green',
                textAlign: 'right',
              }}>
              Receive Amount
            </Text>
            <Text
              style={{fontWeight: 'bold', fontSize: 13, textAlign: 'right'}}>
              Total Quantity
            </Text>
          </View>
        </View>
      </Col>
    </Row>
  );
}

export default DemoLandingCard;

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

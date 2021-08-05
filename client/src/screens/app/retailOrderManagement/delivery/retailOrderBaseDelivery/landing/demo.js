import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Row from '../../../../../../common/components/Row';
import Col from '../../../../../../common/components/Col';

function Demo(props) {
  return (
    <>
      <Row
        style={{
          marginVertical: 10,
          padding: 10,
          marginHorizontal: 10,
          borderRadius: 5,
          backgroundColor: '#ffffff',
        }}>
        <Col width="50%">
          <View>
            <Text style={{fontWeight: 'bold'}}>Delivery No</Text>
          </View>
          <View>
            <Text style={styles.customerAmount}>Outlet Name</Text>
          </View>
          <Text style={styles.teritoryText}>Address</Text>
        </Col>

        <Col width="50%">
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontWeight: 'bold', color: 'black', fontSize: 12}}>
              Order Amount
            </Text>
            <Text style={{fontWeight: 'bold', fontSize: 12, marginLeft: 7}}>
              Delivery Amount
            </Text>
          </View>
          <Text
            style={[
              styles.customerAmount,
              {color: '#00B44A', textAlign: 'right'},
            ]}>
            Receive Amount
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Text style={[styles.teritoryText, {paddingRight: 15}]}>Due</Text>
            <Text style={styles.teritoryText}>Order Qty</Text>
          </View>
        </Col>
      </Row>
    </>
  );
}

export default Demo;

const styles = StyleSheet.create({
  customerAmount: {
    fontWeight: 'bold',
    fontSize: 17,
  },

  cardStyle: {
    flexDirection: 'row',
  },
  teritoryText: {
    color: '#000000',
    // paddingRight: 10,
    paddingVertical: 5,
    opacity: 0.75,
  },
});

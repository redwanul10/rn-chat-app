import React from 'react';
import {Text, StyleSheet} from 'react-native';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';

export default function TourPlanCard({item}) {
  return (
    <Row colGap={5} style={[styles.shortInfo]}>
      <Col width={'50%'}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>
          {item?.employeeName}
        </Text>
      </Col>
      <Col width={'50%'}>
        <Text style={{fontSize: 13, fontWeight: 'bold', textAlign: 'right'}}>
          {item?.distributorName || item?.routeName || item?.territoryName}
        </Text>
        {/* <Text style={{textAlign: 'right', color: 'green', fontWeight: 'bold'}}>
          Tour Date: {_dateFormatter(item?.tourDate)}
        </Text> */}
      </Col>
    </Row>
  );
}

const styles = StyleSheet.create({
  shortInfo: {
    backgroundColor: '#ffffff',
    marginBottom: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
});

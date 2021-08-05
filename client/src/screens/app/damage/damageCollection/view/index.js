import React, {useState, useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import {viewDamageCollection} from '../helper';
import Text from '../../../../../common/components/IText';


function ViewDamageCollection({route: {params}}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    viewDamageCollection(params?.id, setItems);
  }, []);

  return (
    <>
      <ScrollView>
        <CommonTopBar />

        {/* Drop down section */}
        {items?.map((item, index) => (
          <View key={index} style={{marginHorizontal: 10, paddingTop: 20}}>
            <View
              style={{
                backgroundColor: '#f8f8f8',
                borderRadius: 7,
                marginBottom: 10,
                padding: 10,
                elevation: 6,
              }}>
              <Row colGap={5}>
                <Col width={'50%'}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 20,
                      marginVertical: 5,
                      color: 'green',
                    }}>
                    Item Name
                  </Text>
                  {/* Last Change Assign By Iftakhar Alam */}
                  <Text style={{fontSize: 18}}>{item?.damageItemCode}</Text>
                  <Text style={{fontWeight: 'bold', marginVertical: 5}}>
                    Pending Replacement Quantity (
                    <Text
                      style={{
                        fontSize: 15,
                        marginVertical: 5,
                        marginLeft: 10,
                      }}>
                      {item?.numPendingReplaceQty}
                    </Text>
                    )
                  </Text>
                </Col>
                <Col width={'50%'}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 17,
                      color: 'red',
                      marginVertical: 5,
                    }}>
                    Damage Item Quantity({' '}
                    <Text style={{fontSize: 16, marginVertical: 5}}>
                      {item?.numDamageItemQty}
                    </Text>
                    )
                  </Text>
                </Col>
              </Row>
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

export default ViewDamageCollection;

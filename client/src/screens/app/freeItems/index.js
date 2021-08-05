import React, {useEffect, useState, useContext} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import CommonTopBar from '../../../common/components/CommonTopBar';
import {GlobalState} from '../../../GlobalStateProvider';
import {freQtyOnChangeHandelarFunc} from './helper';

import {_todayDate} from '../../../common/functions/_todayDate';
import Row from '../../../common/components/Row';
import Col from '../../../common/components/Col';
import Icon from 'react-native-vector-icons/AntDesign';
import {Spinner} from 'native-base';
import NoDataFoundGrid from '../../../common/components/NoDataFoundGrid';

const FreeItemsLanding = ({navigation, route: {params}}) => {
  const {selectedBusinessUnit} = useContext(GlobalState);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Don't send request for retail order base delivery
    if (params?.retailOrderBaseDelivery) {
      setItems(params?.items);
      return;
    }

    const payload = [...params?.items]?.map((item, index) => ({
      unitId: selectedBusinessUnit?.value,
      partnerId: params?.values?.distributorName?.value,
      channelId: params?.values?.distributorChannel?.value,
      itemId: item?.itemId,
      quantity: +item?.pendingDeliveryQuantity || +item?.quantity || 0,
      pricingDate: _todayDate(),
      serialNo: +index,
      uomId: item?.uomId,
      uomName: item?.uomName,
    }));

    // console.log(JSON.stringify(payload, null, 2));

    freQtyOnChangeHandelarFunc(
      selectedBusinessUnit?.value,
      {...params?.values},
      params?.items,
      // sl,
      setItems,
      payload,
      setLoading,
    );
  }, []);

  return (
    <>
      <CommonTopBar />
      <ScrollView showsVerticalScrollIndicator={false} style={style.container}>
        <View style={[style.itemWrapper, {marginTop: 20}]}>
          <View>
            <Row style={style.center}>
              {/* Buying Item */}
              <Col width="50%">
                <Row style={style.center}>
                  <Col width="70%">
                    <Text style={[style.bold, {fontSize: 14, marginBottom: 5}]}>
                      Product
                    </Text>
                  </Col>
                  <Col width="30%">
                    <Text style={style.bold}>Qty</Text>
                  </Col>
                </Row>
              </Col>

              {/* Free Item */}

              <Col width="50%">
                <Row style={style.center}>
                  <Col width="70%">
                    <Text style={style.productName}>
                      <Icon name="gift" size={18} color="black" /> Free Product
                    </Text>
                  </Col>
                  <Col width="30%">
                    <Text style={[style.bold, {alignSelf: 'flex-end'}]}>
                      Qty
                    </Text>
                  </Col>
                </Row>
              </Col>
            </Row>
          </View>
        </View>

        {loading && <Spinner color="black" />}

        {items?.length === 0 && !loading && (
          <NoDataFoundGrid message="No Free Items Found" />
        )}

        {items?.map((item, index) => (
          <View key={index} style={[style.itemWrapper]}>
            <View>
              <Row style={style.center}>
                {/* Buying Item */}
                <Col width="50%">
                  <Row style={style.center}>
                    <Col width="70%">
                      <Text
                        style={[style.bold, {fontSize: 14, marginBottom: 5}]}>
                        {item?.itemName || item?.productName}
                      </Text>
                    </Col>
                    <Col width="30%">
                      <Text style={style.bold}>
                        {' '}
                        {item?.quantity || item?.pendingDeliveryQuantity}
                      </Text>
                    </Col>
                  </Row>
                </Col>

                {/* Free Item */}
                {item?.freeProductName ? (
                  <Col width="50%">
                    <Row style={style.center}>
                      <Col width="70%">
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 14,
                            marginBottom: 5,
                          }}>
                          <Icon name="gift" size={18} color="black" />{' '}
                          {item?.freeProductName}
                        </Text>
                      </Col>
                      <Col width="30%">
                        <Text style={[style.bold, {alignSelf: 'flex-end'}]}>
                          {item?.numFreeDelvQty}
                        </Text>
                      </Col>
                    </Row>
                  </Col>
                ) : null}
              </Row>
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

export default FreeItemsLanding;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FC',
    paddingHorizontal: 20,
  },
  selectItemStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  bold: {fontWeight: 'bold'},
  itemWrapper: {
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 7,
    padding: 10,
  },
  center: {alignItems: 'center'},
  productName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
});

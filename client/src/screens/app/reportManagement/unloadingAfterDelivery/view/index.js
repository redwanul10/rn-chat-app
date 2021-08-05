/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {Formik} from 'formik';
import {getById} from '../helper';

import CommonTopBar from '../../../../../common/components/CommonTopBar';
import Col from '../../../../../common/components/Col';
import Row from '../../../../../common/components/Row';
import NoDataFoundGrid from '../../../../../common/components/NoDataFoundGrid';
import {FlatList} from 'react-native';
import FormInput from '../../../../../common/components/TextInput';
import {Spinner} from 'native-base';

function UnloadingAfterDeliveryView({route: {params}}) {
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState({});

  useEffect(() => {
    if (params?.id) {
      getById(params?.id, setSingleData, setDisabled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={singleData}
        onSubmit={(values, actions) => {}}>
        {(formikprops) => (
          <>
            <FlatList
              ListHeaderComponent={() => (
                <>
                  <CommonTopBar title={'View Unloading After Delivery View'} />
                  <View style={{marginHorizontal: 10, marginTop: 20}}>
                    <Row colGap={5}>
                      <Col width="50%">
                        <FormInput
                          disabled={true}
                          name="quantity"
                          label="Quantity"
                          wrapperStyle={styles.wrapperStyle}
                          formikProps={formikprops}
                        />
                      </Col>
                      <Col width="50%">
                        <FormInput
                          disabled={true}
                          name="collection"
                          label="Collection"
                          wrapperStyle={styles.wrapperStyle}
                          formikProps={formikprops}
                        />
                      </Col>
                      <Col width="50%">
                        <FormInput
                          disabled={true}
                          name="received"
                          label="Received"
                          wrapperStyle={styles.wrapperStyle}
                          formikProps={formikprops}
                        />
                      </Col>
                    </Row>

                    {
                      <>
                        <View
                          style={{
                            padding: 10,
                            paddingHorizontal: 10,
                            marginVertical: 10,
                            borderRadius: 5,
                            backgroundColor: '#ffffff',
                          }}>
                          <View
                            style={[
                              styles.cardStyle,
                              {justifyContent: 'space-between'},
                            ]}>
                            <Text style={{fontWeight: 'bold'}}>SL</Text>
                          </View>
                          <View
                            style={[
                              styles.cardStyle,
                              {justifyContent: 'space-between'},
                            ]}>
                            <Text style={styles.customerAmount}>Item Name</Text>
                            <Text
                              style={[
                                styles.customerAmount,
                                {color: 'tomato'},
                              ]}>
                              Load Qty
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.cardStyle,
                              {justifyContent: 'space-between'},
                            ]}>
                            <Text style={{fontWeight: 'bold', color: 'green'}}>
                              Balance
                            </Text>
                            <Text style={{fontWeight: 'bold', color: 'black'}}>
                              Delivery Qty
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.cardStyle,
                              {justifyContent: 'space-between'},
                            ]}>
                            <Text style={{fontWeight: 'bold', color: 'gray'}}>
                              Damage Calcuction
                            </Text>
                            <Text style={{fontWeight: 'bold', color: 'gray'}}>
                              Damage Replacement
                            </Text>
                          </View>
                        </View>
                      </>
                    }
                  </View>
                </>
              )}
              data={formikprops.values?.row}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <>
                  <View
                    style={{
                      padding: 10,
                      paddingHorizontal: 10,
                      marginVertical: 10,
                      marginHorizontal: 10,
                      borderRadius: 5,
                      backgroundColor: '#ffffff',
                    }}>
                    <View
                      style={[
                        styles.cardStyle,
                        {justifyContent: 'space-between'},
                      ]}>
                      <Text style={{fontWeight: 'bold'}}>{index + 1}</Text>
                    </View>
                    <View
                      style={[
                        styles.cardStyle,
                        {justifyContent: 'space-between'},
                      ]}>
                      <Text style={styles.customerAmount}>
                        {item?.itemCode}
                      </Text>
                      <Text style={[styles.customerAmount, {color: 'tomato'}]}>
                        {item?.loadingQty}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.cardStyle,
                        {justifyContent: 'space-between'},
                      ]}>
                      <Text style={{fontWeight: 'bold', color: 'green'}}>
                        {item?.balance}
                      </Text>
                      <Text style={{fontWeight: 'bold', color: 'black'}}>
                        {item?.deliveryQty}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.cardStyle,
                        {justifyContent: 'space-between'},
                      ]}>
                      <Text style={{fontWeight: 'bold', color: 'gray'}}>
                        {item?.damageCollectionQty}
                      </Text>
                      <Text style={{fontWeight: 'bold', color: 'gray'}}>
                        {item?.damageReplaceQty}
                      </Text>
                    </View>
                  </View>
                </>
              )}
              ListFooterComponent={() => (
                <>
                  {formikprops.values?.row?.length > 0 && (
                    <View
                      style={{
                        padding: 10,
                        paddingHorizontal: 10,
                        marginVertical: 10,
                        marginHorizontal: 10,
                        borderRadius: 5,
                        backgroundColor: '#ffffff',
                      }}>
                      <View
                        style={[
                          styles.cardStyle,
                          {justifyContent: 'space-between'},
                        ]}>
                        <Text style={styles.customerAmount}>
                          Total Load Quantity
                        </Text>
                        <Text
                          style={[styles.customerAmount, {color: 'tomato'}]}>
                          {formikprops.values?.row?.reduce(
                            (acc, cur) => (acc += cur?.loadingQty),
                            0,
                          )}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.cardStyle,
                          {justifyContent: 'space-between'},
                        ]}>
                        <Text style={styles.customerAmount}>
                          Total Load Balance
                        </Text>
                        <Text
                          style={[styles.customerAmount, {color: 'tomato'}]}>
                          {formikprops.values?.row?.reduce(
                            (acc, cur) => (acc += cur?.balance),
                            0,
                          )}
                        </Text>
                      </View>
                    </View>
                  )}

                  {isDisabled && <Spinner color="black" />}
                  {singleData?.itemLists?.length === 0 && <NoDataFoundGrid />}
                </>
              )}
            />
          </>
        )}
      </Formik>
    </>
  );
}

export default UnloadingAfterDeliveryView;

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
    opacity: 0.75,
  },
  editButton: {
    color: 'white',
    backgroundColor: 'gray',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 2,
  },
  wrapperStyle: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
});

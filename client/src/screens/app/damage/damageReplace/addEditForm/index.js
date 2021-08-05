/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {View,  StyleSheet} from 'react-native';

import {Formik} from 'formik';
import {getById} from '../helper';

import {GlobalState} from '../../../../../GlobalStateProvider';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import Col from '../../../../../common/components/Col';
import Row from '../../../../../common/components/Row';
import NoDataFoundGrid from '../../../../../common/components/NoDataFoundGrid';
import CustomButton from '../../../../../common/components/CustomButton';
import QuantityInputBox from '../../../../../common/components/QuantityInputBox';
import {Toast} from 'native-base';
import {CreateDamageReplace_api} from '../helper';
import ICheckbox from '../../../../../common/components/ICheckbox';
import {FlatList} from 'react-native';
import Text from '../../../../../common/components/IText';

function DamageReplaceForm({route: {params}}) {
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState();

  // Global Data
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);

  useEffect(() => {
    if (params?.id) {
      getById(
        params?.status,
        params,
        setSingleData,
        params?.status === 2 ? false : true,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const rowDtoHandler = (name, value, sl) => {
    let data = [...singleData?.itemLists];
    let _sl = data[sl];
    _sl[name] = value;
    setSingleData({...singleData, itemLists: data});
  };

  useEffect(() => {
    setSingleData(params);
  }, [params]);

  const saveHandler = async (values) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      if (values?.itemLists?.length > 0) {
        const modfiData = values?.itemLists?.map((itm) => {
          return {
            intRowId: +itm?.rowId,
            intDamageEntryId: +params?.id,
            intDamageItemId: +itm?.damageItemId,
            numReplacementQty: +itm?.replacementQty || 0,
            numPendingReplaceQty: +itm?.numPendingReplaceQty,
            isComplete: itm?.isComplete,
          };
        });
        const payload = {
          objHeader: {
            intDamageEntryId: +params?.id,
          },
          objRow: modfiData,
        };
        CreateDamageReplace_api(payload, setDisabled, () => {
          getById(
            params?.status,
            params,
            setSingleData,
            params?.status === 2 ? false : true,
          );
        });
      } else {
        Toast.show({
          text: 'Please add atleast one item',
          buttonText: 'close',
          type: 'warning',
          duration: 3000,
        });
      }
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{...singleData}}
        onSubmit={(values, actions) => {
          saveHandler(values);
        }}>
        {(formikprops) => (
          <>
            <FlatList
              ListHeaderComponent={() => (
                <>
                  <CommonTopBar
                    title={
                      formikprops?.values?.status === 1
                        ? 'View Damage Replace'
                        : 'Edit Damage Replace'
                    }
                  />
                  <View style={{marginHorizontal: 10, marginTop: 20}}>
                    <Row colGap={5}>
                      <Col width="50%">
                        <ICustomPicker
                          label="Distributor"
                          name="distributor"
                          options={[]}
                          formikProps={formikprops}
                          disabled={true}
                        />
                      </Col>
                      <Col width="50%">
                        <ICustomPicker
                          label="Distributor Channel"
                          name="distributorChannel"
                          options={[]}
                          formikProps={formikprops}
                          disabled={true}
                        />
                      </Col>
                      <Col width="50%">
                        <ICustomPicker
                          label="Outlet"
                          name="outlet"
                          options={[]}
                          formikProps={formikprops}
                          disabled={true}
                        />
                      </Col>
                      <Col width="50%">
                        <ICustomPicker
                          label="Damage Category"
                          name="damageCategory"
                          options={[]}
                          formikProps={formikprops}
                          disabled={true}
                        />
                      </Col>
                    </Row>

                    {/* Header Card */}
                    {formikprops?.values?.itemLists?.length > 0 && (
                      <View
                        style={{
                          padding: 10,
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
                          <Text style={styles.customerAmount}>
                            Damage Item Name
                          </Text>
                          <Text
                            style={[styles.customerAmount, {color: 'tomato'}]}>
                            Damaged Item Qty
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.cardStyle,
                            {justifyContent: 'space-between'},
                          ]}>
                          <Text style={styles.teritoryText}>Damage Type</Text>
                          <Text style={{fontWeight: 'bold', color: 'black'}}>
                            Pending Qty
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.cardStyle,
                            {justifyContent: 'flex-end'},
                          ]}>
                          <Text style={{color: 'green'}}>Replacement Qty</Text>
                        </View>
                        <View
                          style={[
                            styles.cardStyle,
                            {justifyContent: 'flex-start'},
                          ]}>
                          <Text style={styles.teritoryText}>Is Complete</Text>
                        </View>
                      </View>
                    )}
                  </View>
                </>
              )}
              data={formikprops.values?.itemLists}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <>
                  <View
                    style={{
                      marginVertical: 10,
                      marginHorizontal: 10,
                      borderRadius: 5,
                      backgroundColor: '#ffffff',
                    }}>
                    <View
                      style={{
                        marginVertical: 10,
                        borderRadius: 5,
                        paddingHorizontal: 10,
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
                          {item?.damageItemCode}  {/* Last Change Assign By Iftakhar Alam */}
                        </Text>
                        <Text
                          style={[styles.customerAmount, {color: 'tomato'}]}>
                          {item?.damageItemQty}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.cardStyle,
                          {justifyContent: 'space-between'},
                        ]}>
                        <Text style={styles.teritoryText}>
                          {item?.damageTypeName}
                        </Text>
                        <Text style={{fontWeight: 'bold', color: 'black'}}>
                          {item?.numPendingReplaceQty}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.cardStyle,
                          {justifyContent: 'flex-end'},
                        ]}>
                        <Text style={{color: 'green'}}>
                          {formikprops?.values?.status === 2 ? (
                            <QuantityInputBox
                              value={item?.replacementQty?.toString()}
                              onChange={(value) => {
                                rowDtoHandler(
                                  'replacementQty',
                                  Number(value),
                                  index,
                                );
                              }}
                              onIncrement={(e) => {
                                if (
                                  item?.replacementQty <
                                  item?.numPendingReplaceQty
                                ) {
                                  rowDtoHandler(
                                    'replacementQty',
                                    Number(item?.replacementQty) + 1,
                                    index,
                                  );
                                }
                              }}
                              onDecrement={(e) => {
                                if (
                                  item?.replacementQty <=
                                  item?.numPendingReplaceQty
                                ) {
                                  rowDtoHandler(
                                    'replacementQty',
                                    Number(item?.replacementQty) - 1,
                                    index,
                                  );
                                }
                              }}
                            />
                          ) : (
                            <>{item?.replacementQty}</>
                          )}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.cardStyle,
                          {justifyContent: 'flex-start'},
                        ]}>
                        <Text style={styles.teritoryText}>Is Complete</Text>
                        <ICheckbox
                          checked={item?.isComplete}
                          onPress={(e) => {
                            formikprops?.values?.status === 2 &&
                              rowDtoHandler(
                                'isComplete',
                                !item?.isComplete,
                                index,
                              );
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </>
              )}
              ListFooterComponent={() => (
                <>
                  {formikprops.values?.status === 2 && (
                    <View style={{marginHorizontal: 10}}>
                      <CustomButton
                        onPress={formikprops.handleSubmit}
                        isLoading={isDisabled}
                        btnTxt="Save"
                      />
                    </View>
                  )}
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

export default DamageReplaceForm;

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
});

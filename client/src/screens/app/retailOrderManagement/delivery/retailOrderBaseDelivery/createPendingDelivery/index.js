import React, {useState, useEffect, useContext} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import CommonTopBar from '../../../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import ICustomPicker from '../../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../../common/components/TextInput';
import {
  getRetailDeliveryPending,
  createRetailOrderDeliveryPending,
  getVehicleDDL,
} from '../../helper';
import {GlobalState} from '../../../../../../GlobalStateProvider';
import * as Yup from 'yup';
import CustomButton from '../../../../../../common/components/CustomButton';
import {_todayDate} from '../../../../../../common/functions/_todayDate';
import getGeoLocation from '../../../../../../common/functions/getGeoLocation';

import {Toast} from 'native-base';
import QuantityInputBox from '../../../../../../common/components/QuantityInputBox';
import Row from '../../../../../../common/components/Row';
import Col from '../../../../../../common/components/Col';
import MiniButton from '../../../../../../common/components/MiniButton';
import {getII_address} from '../../../../../../common/actions/helper';

const initValues = {
  territory: '',
  distributor: '',
  distributorChannel: '',
  route: '',
  vehicle: '',
  beat: '',
  outlet: '',
  orderNum: '',
  totalOrderAmount: 0,
  totalAdvanceAmount: 0,
  totalReceiveAmount: 0,
  dueAmount: 0,
  totalDeliveryAmount: 0,
};

// Form Validation
const schemaValidation = Yup.object().shape({
  vehicle: Yup.object().shape({
    label: Yup.string().required('Vehicle is required'),
    value: Yup.string().required('Vehicle is required'),
  }),
});

function CreatePendingDelivery({navigation, route: {params}}) {
  // Global Context
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  // state
  const [singleData, setSingleData] = useState({});
  const [pendingDeliveryItems, setpendingDeliveryItems] = useState([]);
  const [vehicleDDL, setVehicleDDL] = useState([]);
  const [IIaddress, setIIaddress] = useState('');
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState(null);

  // Get redable Address from (lat,lng)
  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      getII_address(setIIaddress, location?.latitude, location?.longitude);
    }
  }, [location]);

  useEffect(() => {
    // Get Ueser Location (lat,lng)
      getGeoLocation(setLocation);

    if (params?.id) {
      getRetailDeliveryPending(
        params?.id,
        setSingleData,
        setpendingDeliveryItems,
      );
    }
  }, []);

  useEffect(() => {
    if (singleData?.distributor?.value) {
      getVehicleDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        singleData?.distributor?.value,
        setVehicleDDL,
      );
    }
  }, [singleData]);

  const calculateDueAmount = (values) => {
    let total =
      +values?.totalOrderAmount -
      (+values?.totalAdvanceAmount + +values?.totalReceiveAmount);

    total = total?.toFixed(3) ? total?.toFixed(3) : total; // Assign By Iftakhar Alam
    return total?.toString() || '0';
  };

  const quantityAndAmountHanlder = (value, index, item, values) => {
    let newRowData = [...pendingDeliveryItems];
    newRowData[index]['pendingDeliveryQuantity'] = value;
    newRowData[index]['deliveryAmount'] = item?.price * +value;
    newRowData[index]['numFreeDelvQty'] =
      +value * item?.numFreeProdQtyPerProduct;
    setpendingDeliveryItems(newRowData);
  };

  const rowDtoHandler = (name, value, sl, item) => {
    // let data = [...pendingDeliveryItems];
    // let _sl = data[sl];
    // _sl[name] = value;
    // setpendingDeliveryItems(data);
    quantityAndAmountHanlder(value, sl, item);
  };

  const getTotalAmount = () => {
    let amount = 0;
    pendingDeliveryItems.forEach((item) => {
      amount += item?.pendingDeliveryQuantity * item?.price;
    });
    amount = amount?.toFixed(3) ? amount?.toFixed(3) : amount; // Assign By Iftakhar Alam
    return amount ? amount?.toString() : '0';
  };

  const saveHandler = (values, cb) => {
    const filterSelectedItems = pendingDeliveryItems?.filter(
      (item) => item?.pendingDeliveryQuantity > 0,
    );

    if (filterSelectedItems?.length === 0) {
      Toast.show({
        text: 'Please add atleast one item',
        type: 'warning',
        duration: 3000,
      });
      return;
    }
    const objrow = filterSelectedItems?.map((item) => ({
      productId: item?.productId,
      productName: item?.productName,
      deliveryQuantity: +item?.pendingDeliveryQuantity,
      price: item?.price,
      // deliveryAmount: item?.deliveryAmount,
      freeProductId: item?.freeProductId || 0,
      freeProductName: item?.freeProductName || '',
      orderId: item?.orderId,
      orderRowId: item?.rowId,
      uomid: item?.uomid,
      uomname: item?.uomname,
      orderItemQty: item?.orderQuantity,
      isFree: item?.isFree,
      numFreeDelvQty: item?.numFreeDelvQty || 0,
      numFreeDelvAmount: item?.numFreeDelvAmount || 0,
    }));
    const payload = {
      objheader: {
        territoryid: values?.territory?.value,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        businessPartnerId: values?.distributor?.value,
        routId: values?.route?.value,
        beatId: values?.beat?.value,
        outletId: values?.outlet?.value,
        visitedOutlet: values?.visitedOutlet,
        totalMemo: values?.totalMemo,
        distributionChannelId: values?.distributorChannel?.value,
        distributionChannel: values?.distributorChannel?.label,
        deliveryDate: _todayDate(),
        receiveAmount: +values?.totalReceiveAmount || 0,
        totalDeliveryAmount: Number(getTotalAmount()) || 0,
        advanceAmount: +values?.totalAdvanceAmount || 0,
        actionBy: profileData?.userId,
        vehicleId: values?.vehicle?.value,
        vehicleNo: values?.vehicle?.label,
        totalOrderAmount: +values?.totalOrderAmount || 0,
        outletOrderId: params?.id,
        // locations
        latitude: location?.latitude?.toString() || '',
        longitude: location?.longitude?.toString() || '',
        llAddress: IIaddress,
      },
      objrow,
    };

    const customCb = () => {
      cb();
      setpendingDeliveryItems([]);
    };
    // console.log(JSON.stringify(payload, null, 2));
    createRetailOrderDeliveryPending(payload, customCb, setLoading);
  };
  return (
    <>
      <ScrollView>
        <CommonTopBar />
        {/* <Text>{JSON.stringify(singleData, null, 2)}</Text> */}
        <Formik
          enableReinitialize={true}
          initialValues={params?.id ? singleData : initValues}
          validationSchema={schemaValidation}
          onSubmit={(values, actions) => {
            saveHandler(values, () => {
              actions.resetForm();
            });
          }}>
          {(formikprops) => (
            <View style={{marginHorizontal: 10, marginTop: 20}}>
              <ScrollView>
                {/* <Text>{JSON.stringify(pendingDeliveryItems, null, 2)}</Text> */}
                {/* <ICustomPicker
                  label="Territory Name"
                  name="territory"
                  formikProps={formikprops}
                  disabled={true}
                />
                <ICustomPicker
                  label="Distributor Name"
                  name="distributor"
                  disabled={true}
                  formikProps={formikprops}
                /> */}
                {/* <ICustomPicker
                  label="Distributor Channel"
                  name="distributorChannel"
                  disabled={true}
                  formikProps={formikprops}
                /> */}
                {/* <ICustomPicker
                  label="Route Name"
                  name="route"
                  disabled={true}
                  formikProps={formikprops}
                /> */}
                <ICustomPicker
                  label="Select Vehicle"
                  name="vehicle"
                  options={[{label: 'No Vehicle', value: 0}, ...vehicleDDL]}
                  // disabled={true}
                  formikProps={formikprops}
                />
                {/* <ICustomPicker
                  label="Market Name"
                  name="beat"
                  disabled={true}
                  formikProps={formikprops}
                /> */}
                <ICustomPicker
                  label="Outlet Name"
                  name="outlet"
                  disabled={true}
                  formikProps={formikprops}
                />
                <ICustomPicker
                  label="Order Number"
                  name="orderNum"
                  disabled={true}
                  formikProps={formikprops}
                />

                <Row colGap={5}>
                  <Col width="50%">
                    <FormInput
                      name="totalOrderAmount"
                      label="Total Order Amount"
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>

                  <Col width="50%">
                    <FormInput
                      name="totalAdvanceAmount"
                      label="Total Advance Amount"
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                </Row>

                <Row colGap={5}>
                  <Col width="50%">
                    <FormInput
                      name="dueAmount"
                      label="Due Amount"
                      value={calculateDueAmount(formikprops?.values)}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>

                  <Col width="50%">
                    <FormInput
                      name="totalDeliveryAmount"
                      label="Total Delivery Amount"
                      value={getTotalAmount(1) || '0'}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                </Row>

                <FormInput
                  name="totalReceiveAmount"
                  label="Total Receive Amount"
                  onChangeText={(value) => {
                    if (value > formikprops?.values?.staticDueAmount) return;
                    formikprops?.setFieldValue('totalReceiveAmount', value);
                  }}
                  formikProps={formikprops}
                  keyboardType="numeric"
                />

                {/* Demo Product Card */}
                <View
                  style={{
                    backgroundColor: '#ffffff',

                    borderRadius: 7,
                    marginVertical: 5,
                    paddingBottom: 10,
                    paddingHorizontal: 5,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    {/* product name */}
                    <View>
                      <Text style={{fontWeight: 'bold', maxWidth: 150}}>
                        {/* Name: */}
                        Product
                      </Text>
                    </View>

                    {/* Delivery Quantity */}
                    <View>
                      <Text style={{fontWeight: 'bold', color: '#818a88'}}>
                        Pending Qty:
                      </Text>
                    </View>

                    <View>
                      <Text style={{fontWeight: 'bold', color: '#818a88'}}>
                        Delivery Qty:
                      </Text>
                    </View>
                  </View>
                </View>

                {pendingDeliveryItems?.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: '#ffffff',

                      borderRadius: 7,
                      marginVertical: 5,
                      paddingBottom: 10,
                      paddingHorizontal: 5,
                    }}>
                    <View
                      style={{
                        marginTop: 10,
                        paddingHorizontal: 5,
                      }}>
                      <Row>
                        {/* product name */}
                        <Col width="40%">
                          <View>
                            <Text style={{fontWeight: 'bold'}}>
                              {/* Name: */}
                              {item?.productName}
                            </Text>
                          </View>
                        </Col>

                        <Col width="25%">
                          {/* Delivery Quantity */}
                          <View style={{alignItems: 'center'}}>
                            <Text
                              style={{fontWeight: 'bold', color: '#818a88'}}>
                              {/* Delivery Quantity: */}
                              <Text style={{color: 'black'}}>
                                {/* {item?.deliveryQuantity} */}
                                {item?.staticPendingQty}
                              </Text>
                            </Text>
                          </View>
                        </Col>
                        <Col width="35%">
                          <QuantityInputBox
                            value={item?.pendingDeliveryQuantity.toString()}
                            onChange={(value) => {
                              if (value > item?.staticPendingQty) return;
                              rowDtoHandler(
                                'pendingDeliveryQuantity',
                                Number(value),
                                index,
                                item,
                              );
                            }}
                            onIncrement={(e) => {
                              if (
                                item?.pendingDeliveryQuantity + 1 >
                                item?.staticPendingQty
                              )
                                return;
                              rowDtoHandler(
                                'pendingDeliveryQuantity',
                                Number(item?.pendingDeliveryQuantity) + 1,
                                index,
                                item,
                              );
                            }}
                            onDecrement={(e) => {
                              rowDtoHandler(
                                'pendingDeliveryQuantity',
                                Number(item?.pendingDeliveryQuantity) - 1,
                                index,
                                item,
                              );
                            }}
                          />
                        </Col>
                      </Row>
                    </View>
                  </View>
                ))}

                {/* No Order Checkbox */}
                <View style={styles.checkBoxStyle}>
                  <MiniButton
                    textStyle={{paddingVertical: 5}}
                    btnText={'Free Items'}
                    onPress={() => {
                      navigation.navigate('Free Items', {
                        values: {...formikprops?.values},
                        items: pendingDeliveryItems,
                        id: params?.id,
                        retailOrderBaseDelivery: true,
                      });
                    }}
                  />
                  {/* <MiniButton
                    textStyle={{paddingVertical: 5}}
                    containerStyle={{marginLeft: 10}}
                    btnText={'Slub Offer'}
                    onPress={() => {
                      navigation.navigate('slubOffer', {
                        ...formikprops?.values,
                        id: params?.id,
                        itemRowData: pendingDeliveryItems,
                      });
                    }}
                  /> */}
                  {/* <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Free Items', {
                        values: {...formikprops?.values},
                        items: pendingDeliveryItems,
                        id: params?.id,
                        retailOrderBaseDelivery: true,
                      });
                    }}>
                    <Text style={styles.btnText}>Free Items</Text>
                  </TouchableOpacity> */}
                </View>

                <CustomButton
                  onPress={formikprops.handleSubmit}
                  isLoading={loading}
                  btnTxt="Save"
                />
              </ScrollView>
            </View>
          )}
        </Formik>
      </ScrollView>
    </>
  );
}

export default CreatePendingDelivery;

const styles = StyleSheet.create({
  checkBoxStyle: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  btnText: {
    borderRadius: 5,
    marginLeft: 10,
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#00cdac',
    // fontFamily: 'HelveticaNeue Light',
  },
});

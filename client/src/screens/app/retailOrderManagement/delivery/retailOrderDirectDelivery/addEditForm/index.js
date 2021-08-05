import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  // Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import CommonTopBar from '../../../../../../common/components/CommonTopBar';
import {useFormik} from 'formik';
import {launchCamera} from 'react-native-image-picker';
import ICustomPicker from '../../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../../common/components/TextInput';
import {
  createRetailOrderDirectDelivery,
  getVehicleDDL,
  getDistributorChannel,
  getItemInfoDDL,
  freQtyOnChangeHandelarFunc,
  getDirectDeliveryById,
  createSecondaryCollection,
  uploadCapturedImage,
} from '../helper';
import {Toast} from 'native-base';
import {GlobalState} from '../../../../../../GlobalStateProvider';
import * as Yup from 'yup';
import CustomButton from '../../../../../../common/components/CustomButton';
import {_todayDate} from '../../../../../../common/functions/_todayDate';
import QuantityInputBox from '../../../../../../common/components/QuantityInputBox';
import getGeoLocation from '../../../../../../common/functions/getGeoLocation';
import Row from '../../../../../../common/components/Row';
import Col from '../../../../../../common/components/Col';
import IconEntyp0 from 'react-native-vector-icons/Entypo';
import {
  getBeatDDL,
  getII_address,
  getOutletNameDDL,
} from '../../../../../../common/actions/helper';
import Text from '../../../../../../common/components/IText';
import MiniButton from '../../../../../../common/components/MiniButton';

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
  productType: '',
};

const schemaValidation = Yup.object().shape({
  vehicle: Yup.object().shape({
    label: Yup.string().required('Vehicle is required'),
    value: Yup.string().required('Vehicle is required'),
  }),
  // outlet: Yup.object().shape({
  //   label: Yup.string().required('Outlet Name is required'),
  //   value: Yup.string().required('Outlet Name is required'),
  // }),
  // productType: Yup.object().shape({
  //   label: Yup.string().required('Product Type Name is required'),
  //   value: Yup.string().required('Product Type Name is required'),
  // }),
  // route: Yup.object().shape({
  //   label: Yup.string().required('Route is required'),
  //   value: Yup.string().required('Route is required'),
  // }),
  // beat: Yup.object().shape({
  //   label: Yup.string().required('Market is required'),
  //   value: Yup.string().required('Market is required'),
  // }),
});

function RetailOrderDirectDeliveryForm({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [singleData, setSingleData] = useState({});
  const [mapData, setMapData] = useState({});
  const [distributorChannel, setDistributorChannel] = useState({});
  const [loading, setLoading] = useState(false);
  const [IIaddress, setIIaddress] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const flatListRef = useRef();

  // DDL State
  const [vehicleDDL, setVehicleDDL] = useState([]);
  const [beatDDL, setBeatDDL] = useState([]);
  const [outletNameDDL, setOutletNameDDL] = useState([]);
  const [itemInfo, setItemInfo] = useState([]);

  useEffect(() => {
    if (params?.id) {
      getDirectDeliveryById(params?.id, setSingleData, setItemInfo);
    } else {
      getGeoLocation(setMapData);
    }
  }, []);

  useEffect(() => {
    if (mapData?.latitude && mapData?.longitude) {
      getII_address(setIIaddress, mapData?.latitude, mapData?.longitude);
    }
  }, [mapData]);

  useEffect(() => {
    if (params?.route?.value) {
      getBeatDDL(params?.route?.value, setBeatDDL);
    }
  }, []);

  useEffect(() => {
    if (params?.distributor?.value) {
      getVehicleDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        params?.distributor?.value,
        setVehicleDDL,
      );

      getDistributorChannel(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        params?.distributor?.value,
        setDistributorChannel,
      ).then((channel) => {
        // if (!params?.id) {
        //   getItemInfoDDL(
        //     profileData?.accountId,
        //     selectedBusinessUnit?.value,
        //     channel?.value,
        //     setItemInfo,
        //   );
        // }
      });
    }
  }, [params]);

  const rowDtoHandler = (name, value, sl, rowItm, values) => {
    let data = [...itemInfo];
    let _sl = data[sl];
    _sl[name] = value;
    setItemInfo(data);

    if (name === 'pendingDeliveryQuantity') {
      freQtyOnChangeHandelarFunc(
        selectedBusinessUnit?.value,
        {...values, distributor: params?.distributor},
        rowItm,
        sl,
        setItemInfo,
        data,
      );
    }
  };

  // const getTotalAmount = () => {
  //   let amount = 0;
  //   itemInfo.forEach((item) => {
  //     amount += item?.pendingDeliveryQuantity * item?.itemRate;
  //   });
  //   amount = amount?.toFixed(3) ? amount?.toFixed(3) : amount; // Assign By Iftakhar Alam
  //   return amount ? amount?.toString() : '0';
  // };

  const amountCalculationPerItem = (item) => {
    const cases = +item?.pendingDeliveryQuantity / +item?.packageQuantity;
    const pices = +item?.pendingDeliveryQuantity % +item?.packageQuantity;
    // console.log('Case', Math.floor(cases));
    // console.log('Pices', pices);
    // console.log('Item', JSON.stringify(item, null, 2));
    return Math.floor(cases) * item?.tprate + pices * item?.itemRate;
  };

  const getTotalAmount = () => {
    let amount = 0;
    itemInfo.forEach((item) => {
      amount += amountCalculationPerItem(item);
    });
    /* Old Logic For Total Amount */
    // totalArr.forEach((arr) => {
    //   arr.forEach((item) => (amount += item?.quantity * item?.itemRate));
    // });
    const amountRound = amount?.toFixed(2) ? amount?.toFixed(2) : amount;
    return amountRound.toString() || 0;
  };

  const saveHandler = (values, cb) => {
    const filterSelectedItems = itemInfo.filter(
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

    if (params?.id) {
      const payload = {
        delivaryId: +params?.id,
        recieveAmount: +values?.totalReceiveAmount || 0,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
      };

      createSecondaryCollection(payload, setLoading);
    } else {
      const objrow = itemInfo?.map((item) => ({
        productId: item?.itemId,
        productName: item?.itemName,
        deliveryQuantity: +item?.pendingDeliveryQuantity || 0,
        price: +item?.itemRate || 0,
        orderId: 0,
        orderRowId: 0,
        uomid: item?.uomId,
        uomname: item?.uomName,
        isFree: true,
        freeProductId: item?.freeProductId || 0,
        freeProductName: item?.freeProductName || '',
        numFreeDelvAmount: 0,
        numFreeDelvQty: item?.numFreeDelvQty || 0,
      }));

      let payload = {
        objheader: {
          territoryid: params?.territory?.value,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          businessPartnerId: params?.distributor?.value,
          routId: params?.route?.value,
          beatId: values?.beat?.value,
          outletId: values?.outlet?.value,
          vehicleId: values?.vehicle?.value,
          vehicleNo: values?.vehicle?.label,
          distributorChannel: distributorChannel?.value,
          distributorChannelName: distributorChannel?.label,
          visitedOutlet: 0,
          totalMemo: 0,
          deliveryDate: _todayDate(),
          receiveAmount: +values?.totalReceiveAmount || 0,
          totalDeliveryAmount: +getTotalAmount(),
          advanceAmount: 0,
          latitude: mapData?.latitude?.toString() || '',
          longitude: mapData?.longitude?.toString() || '',
          llAddress: IIaddress,
          actionBy: profileData?.userId,
          image: '',
        },
        objrow,
      };

      const customCB = () => {
        cb();
        if (!params?.id) setItemInfo([]);
        setSelectedFile(null);
      };

      if (values?.outlet?.cooler && !selectedFile) {
        Toast.show({
          text: 'Cooler Image is Required',
          type: 'danger',
          duration: 3000,
        });
        return;
      }

      if (values?.outlet?.cooler && selectedFile) {
        uploadCapturedImage(selectedFile, (imgId) => {
          payload = {
            ...payload,
            image: imgId,
          };

          createRetailOrderDirectDelivery(payload, setLoading, customCB);
        });
      } else {
        createRetailOrderDirectDelivery(payload, setLoading, customCB);
      }
    }
  };

  const captureImage = () => {
    const options = {
      includeBase64: true,
      saveToPhotos: false,
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchCamera(options, (res) => {
      if (res?.assets) {
        // console.log(res?.assets[0]?.fileSize);
        setSelectedFile(res?.assets[0]);
        setTimeout(() => {
          flatListRef?.current?.scrollToEnd({animating: true});
        }, 1000);
      }
    });
  };

  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: params?.id
      ? singleData
      : {...initValues, distributorChannel},
    validationSchema: schemaValidation,
    onSubmit: (values, actions) => {
      saveHandler(values, () => {
        actions.resetForm();
      });
    },
  });

  const visibleCamera = formikprops?.values?.outlet?.cooler && !params?.id;

  return (
    <>
      <ScrollView ref={flatListRef}>
        <CommonTopBar
          title={'Create Outlet Direct Delivery'}
          rightIcon={() => (
            <>
              <TouchableOpacity
                disabled={!visibleCamera}
                onPress={captureImage}
                style={{opacity: visibleCamera ? 1 : 0}}>
                <IconEntyp0
                  style={{marginRight: 5}}
                  name="camera"
                  size={25}
                  color="#ffffff"
                />
              </TouchableOpacity>
            </>
          )}
        />

        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <Row colGap={5}>
            <Col width="50%">
              <ICustomPicker
                label="Select Vehicle"
                name="vehicle"
                options={[{label: 'No Vehicle', value: 0}, ...vehicleDDL]}
                formikProps={formikprops}
                wrapperStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: 5,
                }}
              />
            </Col>

            <Col width="50%">
              <ICustomPicker
                label="Market Name"
                name="beat"
                options={beatDDL}
                onChange={(selectedOption) => {
                  formikprops?.setFieldValue('beat', selectedOption);
                  getOutletNameDDL(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    params?.route?.value,
                    selectedOption?.value,
                    setOutletNameDDL,
                  );
                }}
                formikProps={formikprops}
                wrapperStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: 5,
                }}
              />
            </Col>

            <Col width="50%">
              <ICustomPicker
                label="Outlet Name"
                name="outlet"
                options={outletNameDDL}
                formikProps={formikprops}
                wrapperStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: 5,
                }}
              />
            </Col>

            <Col width="50%">
              <ICustomPicker
                label="Product Type"
                name="productType"
                wrapperStyle={{
                  backgroundColor: !formikprops?.values?.outlet?.label
                    ? 'transparent'
                    : '#ffffff',
                  borderRadius: 5,
                }}
                options={[
                  {value: 1, label: 'Mandatory'},
                  {value: 2, label: 'Focus'},
                  {value: 3, label: 'Others'},
                ]}
                onChange={(selectedOption) => {
                  formikprops?.setFieldValue('productType', selectedOption);

                  getItemInfoDDL(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    distributorChannel?.value,
                    selectedOption?.value,
                    setItemInfo,
                  );
                }}
                formikProps={formikprops}
                disabled={!formikprops?.values?.outlet?.label}
              />
            </Col>
          </Row>

          <Row colGap={5}>
            <Col width="50%">
              <FormInput
                name="totalReceiveAmount"
                label="Total Receive Amount"
                keyboardType="numeric"
                formikProps={formikprops}
              />
            </Col>
            <Col width="50%">
              <FormInput
                name="totalDeliveryAmount"
                label="Total Delivery Amount"
                value={getTotalAmount()}
                formikProps={formikprops}
                disabled={true}
              />
            </Col>
          </Row>

          <View style={styles.itemCardContainer}>
            <Row style={{alignItems: 'center'}}>
              <Col width="50%">
                <Text style={{fontWeight: 'bold'}}>Product</Text>
                <Text style={{fontWeight: 'bold'}}>Rate</Text>
              </Col>

              <Col width="50%">
                <View style={{alignSelf: 'flex-end', marginRight: 15}}>
                  <Text style={{fontWeight: 'bold'}}>Pending Qty</Text>
                </View>
              </Col>
            </Row>
          </View>

          {itemInfo?.map((item, index) => (
            <View key={index} style={styles.itemCardContainer}>
              <Row style={{alignItems: 'center'}}>
                <Col width="50%">
                  <Text style={{fontWeight: 'bold'}}>{item?.itemName}</Text>
                  <Text style={{fontWeight: 'bold'}}>
                    Rate: {item?.itemRate}
                  </Text>
                </Col>

                <Col width="50%">
                  <View style={{alignSelf: 'flex-end'}}>
                    <QuantityInputBox
                      style={{alignSelf: 'center'}}
                      value={item?.pendingDeliveryQuantity?.toString()}
                      onChange={(value) => {
                        rowDtoHandler(
                          'pendingDeliveryQuantity',
                          Number(value),
                          index,
                          item,
                          formikprops?.values,
                        );
                      }}
                      onIncrement={(e) => {
                        rowDtoHandler(
                          'pendingDeliveryQuantity',
                          Number(item?.pendingDeliveryQuantity) + 1,
                          index,
                          item,
                          formikprops?.values,
                        );
                      }}
                      onDecrement={(e) => {
                        rowDtoHandler(
                          'pendingDeliveryQuantity',
                          Number(item?.pendingDeliveryQuantity) - 1,
                          index,
                          item,
                          formikprops?.values,
                        );
                      }}
                    />
                  </View>
                </Col>
              </Row>
            </View>
          ))}

          {/* No Order Checkbox */}
          <View style={styles.checkBoxStyle}>
            <MiniButton
              textStyle={{paddingVertical: 5}}
              btnText={'Free Items'}
              onPress={() => {
                navigation.navigate('Free Items', {
                  values: {
                    ...formikprops?.values,
                    distributorName: formikprops?.values?.distributor,
                  },
                  items: itemInfo,
                  id: params?.id,
                  // retailOrderBaseDelivery: true,
                });
              }}
            />

            {itemInfo?.length > 0 ? (
              <MiniButton
                textStyle={{paddingVertical: 5}}
                containerStyle={{marginLeft: 10}}
                btnText={'Slub Offer'}
                onPress={() => {
                  navigation.navigate('slubOffer', {
                    ...formikprops?.values,
                    id: params?.id,
                    itemRowData: itemInfo,
                  });
                }}
              />
            ) : null}

            {/* <TouchableOpacity
              onPress={() => {
                navigation.navigate('Free Items', {
                  values: {
                    ...formikprops?.values,
                    distributorName: formikprops?.values?.distributor,
                  },
                  items: itemInfo,
                  id: params?.id,
                  // retailOrderBaseDelivery: true,
                });
              }}>
              <Text style={styles.btnText}>Free Items</Text>
            </TouchableOpacity> */}
          </View>

          {/* Preview Cooler Image */}
          {selectedFile?.uri && (
            <Image
              style={{width: 80, height: 80, marginVertical: 10}}
              source={{
                uri: selectedFile?.uri,
              }}
            />
          )}

          <CustomButton
            onPress={formikprops.handleSubmit}
            btnTxt="Save"
            isLoading={loading}
          />
        </View>
      </ScrollView>
    </>
  );
}

export default RetailOrderDirectDeliveryForm;

const styles = StyleSheet.create({
  itemCardContainer: {
    backgroundColor: '#ffffff',

    borderRadius: 7,
    marginVertical: 5,
    marginTop: 10,
    padding: 5,
  },
  checkBoxStyle: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  btnText: {
    borderRadius: 5,
    marginLeft: 10,
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#73c3e6',
    // fontFamily: 'HelveticaNeue Light',
  },
});

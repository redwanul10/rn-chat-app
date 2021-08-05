import React, {useState, useEffect, useContext, useRef} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Keyboard,
} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import {useFormik} from 'formik';
import FormInput from '../../../../../common/components/TextInput';
import Icon from 'react-native-vector-icons/Entypo';
import ModalCloseIcon from 'react-native-vector-icons/AntDesign';
import {launchCamera} from 'react-native-image-picker';
import {
  getItemInfoDDL,
  getOutletNameDDL,
  createSecondaryOrder,
  freQtyOnChangeHandelarFunc,
  getOutletNameDDLForSO,
  uploadCapturedImage,
  outletCheckin,
  getCheckInOutInfo,
} from './helper';

import dayjs from 'dayjs';

import {GlobalState} from '../../../../../GlobalStateProvider';
import CustomButton from '../../../../../common/components/CustomButton';
import {Toast} from 'native-base';
import QuantityInputBox from '../../../../../common/components/QuantityInputBox';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import getGeoLocation from '../../../../../common/functions/getGeoLocation';
import {
  getII_address,
  getWeatherInfo,
} from '../../../../../common/actions/helper';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import Timer from '../../../../../common/components/Timer';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  outlet: Yup.object().shape({
    label: Yup.string().required('Outlet Name is required'),
    value: Yup.string().required('Outlet Name is required'),
  }),
});

const initValues = {
  totalOrderAmount: '0',
  territory: '',
  route: '',
  selectVehicle: '',
  beat: '',
  outlet: '',
  distributorName: '',
  distributorChannel: '',
  advanceAmount: '',
  productType: '',
};

// const dataset =

function CreateSecondaryOrder({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit, userRole} = useContext(GlobalState);
  const [outletNameDDL, setoutletNameDDL] = useState([]);
  const [location, setLocation] = useState(null);
  const [IIaddress, setIIaddress] = useState('');
  const [weatherInfo, setWeatherInfo] = useState({});
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(false);
  const [timeInfo, setTimeInfo] = useState(null); // Time info State
  const flatListRef = useRef(); // Flat List useRef

  // const [space, setSpace] = useState(0);

  // Last Change
  const isFocused = useIsFocused();

  const [itemRowData, setItemRowData] = useState({});

  // Main Formik BoilerPlate
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: params?.id ? singleData : {...initValues, ...params},
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      saveHandler(values, () => {
        const type = values?.productType;
        actions.resetForm();
        actions.setFieldValue('productType', type);
      });
    },
  });

  // Is Focused
  useEffect(() => {
    if (isFocused && formikprops?.values?.outlet?.value) {
      getCheckInOutInfo(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        params?.route?.value,
        params?.beat?.value,
        formikprops?.values?.outlet?.value,
        _todayDate(),
        setTimeInfo,
      );
    }
  }, [isFocused]);

  // Get Ueser Location (lat,lng)
  useEffect(() => {
    if (!params?.id) {
      getGeoLocation(setLocation);
    }
  }, []);

  // Get redable Address from (lat,lng)
  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      getII_address(setIIaddress, location?.latitude, location?.longitude);
      getWeatherInfo(location?.latitude, location?.longitude, setWeatherInfo);
    }
  }, [location]);

  const getOutletDDL_action = () => {
    if (userRole === 'SO') {
      getOutletNameDDLForSO(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        params?.route?.value,
        params?.beat?.value,
        setoutletNameDDL,
      );
    } else {
      getOutletNameDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        params?.route?.value,
        params?.beat?.value,
        setoutletNameDDL,
      );
    }
  };

  const timeSpliter = (time) => {
    const splitTime = time?.split(':');
    return (
      splitTime?.length > 0 && [
        0,
        +splitTime[2] || 0,
        +splitTime[1] || 0,
        +splitTime[0] || 0,
        0,
      ]
    );
  };

  useEffect(() => {
    if (isFocused) {
      getOutletDDL_action();
    }
  }, [profileData, selectedBusinessUnit, isFocused]);

  // Row dto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl, rowItm, values) => {
    let data = [...itemRowData[formikprops?.values?.productType?.value]];
    let _sl = data[sl];

    _sl[name] = value;

    let payload = {...itemRowData};
    payload[formikprops?.values?.productType?.value] = [...data];

    setItemRowData(payload);

    if (name === 'quantity') {
      freQtyOnChangeHandelarFunc(
        selectedBusinessUnit?.value,
        {...values, distributor: values?.distributorName},
        rowItm,
        sl,
        setItemRowData,
        itemRowData,
      );
    }
  };

  const arrayForFreeItems = () => {
    let totalArr = Object.values(itemRowData);
    let ll = [];
    totalArr.forEach((arr) => {
      ll = [...ll, ...arr];
    });
    return ll;
  };

  const amountCalculationPerItem = (item) => {
    const cases = +item?.quantity / +item?.packageQuantity;
    const pices = +item?.quantity % +item?.packageQuantity;
    // console.log('Case', Math.floor(cases));
    // console.log('Pices', pices);
    // console.log('Item', JSON.stringify(item, null, 2));
    return Math.floor(cases) * item?.tprate + pices * item?.itemRate;
  };

  const getTotalAmount = () => {
    let totalArr = Object.values(itemRowData);
    let amount = 0;

    totalArr.forEach((arr) => {
      arr.forEach((item) => {
        amount += amountCalculationPerItem(item);
      });
    });

    /* Old Logic For Total Amount */
    // totalArr.forEach((arr) => {
    //   arr.forEach((item) => (amount += item?.quantity * item?.itemRate));
    // });

    const amountRound = amount?.toFixed(2) ? amount?.toFixed(2) : amount;
    return amountRound.toString() || 0;
  };

  const saveHandler = (values, cb) => {
    let totalArr = Object.values(itemRowData);
    finalarray = [];

    totalArr.forEach((arr) => {
      let filterSelectedItems = arr?.filter((item) => item?.quantity > 0);
      finalarray = [...finalarray, ...filterSelectedItems];
    });

    // const filterSelectedItems = itemInfo.filter((item) => item?.quantity > 0);

    if (finalarray?.length === 0) {
      Toast.show({
        text: 'Please add atleast one item',
        type: 'warning',
        duration: 3000,
      });
      return;
    }

    const attibute = finalarray?.map((item) => ({
      itemId: item?.itemId,
      itemName: item?.itemName,
      orderQuantity: item?.quantity || 0,
      rate: item?.itemRate,
      uomid: item?.uomId,
      uomname: item?.uomName,
      orderAmount: item?.itemRate * (item?.quantity || 0),
      // Last Change
      numFreeDelvQty: item?.numFreeDelvQty,
      numFreeDelvAmount: 0,
      freeProductId: item?.freeProductId || 0,
      freeProductName: item?.freeProductName || '',
    }));

    let payload = {
      secondaryOrder: {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        routeId: values?.route?.value,
        routeName: values?.route?.label,
        beatId: values?.beat?.value,
        beatName: values?.beat?.label,
        outletid: values?.outlet?.value,
        outletName: values?.outlet?.label,
        receiveAmount: +values?.advanceAmount || 0,
        businessPartnerId: values?.distributorName?.value,
        businessPartnerName: values?.distributorName?.label,
        totalOrderAmount: Number(getTotalAmount()) || 0,
        territoryId: values?.territory?.value,
        territoryName: values?.territory?.label,
        vehicleId: values?.selectVehicle?.value || 0,
        vehicleNo: values?.selectVehicle?.label || '',
        distributionChannelId: values?.distributorChannel?.value,
        distributionChannelName: values?.distributorChannel?.label,
        actionBy: profileData?.userId,
        latitude: location?.latitude?.toString() || '',
        longitude: location?.longitude?.toString() || '',
        llAddress: IIaddress,
        weatherInfo: weatherInfo?.main?.temp?.toString() || '',
        image: '',
      },
      attibute: attibute,
    };

    // On Create Success Callback
    const customCb = () => {
      cb();
      setItemRowData({});
      setSelectedFile(null);
      getOutletDDL_action();
    };

    if (values?.outlet?.cooler && !selectedFile) {
      Toast.show({
        text: 'Cooler Image is Required',
        type: 'warning',
        duration: 3000,
      });
      return;
    }

    // console.log(JSON.stringify(payload,null,2))
    if (values?.outlet?.cooler && selectedFile) {
      uploadCapturedImage(selectedFile, (imgId) => {
        payload = {
          ...payload,
          image: imgId,
        };

        createSecondaryOrder(payload, setLoading, customCb);
      });
    } else {
      createSecondaryOrder(payload, setLoading, customCb);
    }
  };

  const checkin = (values) => {
    const payload = {
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      routeId: values?.route?.value,
      beatId: values?.beat?.value,
      outletId: values?.outlet?.value,
      checkInDateTime: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS') || '',
      // checkOutDateTime: '',
      lastActionDateTime: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS') || '',
      actionBy: profileData?.userId,
    };

    if (!values?.outlet) {
      Toast.show({
        text: 'Please Select Outlet',
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    // When Checkin Success || Called Back call and outlet flag come's false
    outletCheckin(payload, setCheckInLoading, () => {
      getCheckInOutInfo(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        params?.route?.value,
        params?.beat?.value,
        formikprops?.values?.outlet?.value,
        _todayDate(),
        setTimeInfo,
      );
    });
  };

  const captureImage = () => {
    const options = {
      includeBase64: true,
      saveToPhotos: false,
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.5,
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

  const visibleCamera = formikprops?.values?.outlet?.cooler && !params?.id;

  const filteredProduct = () => {
    let items = itemRowData[formikprops.values?.productType?.value] || []
    
    if(!formikprops?.values?.search) return items

    // Filter based on search
    let products = items.filter(item => {
      if(item?.itemCode?.toLowerCase().includes(formikprops?.values?.search?.toLowerCase())){
        return true
      }else{
        return false
      }
    })

    return products
  }

  // useEffect(() => {
  //   Keyboard.addListener('keyboardDidShow', (e)=>{
  //     console.log("keyboard height is",e.endCoordinates.height)
  //     setSpace(e.endCoordinates.height)
  //   });
  //   Keyboard.addListener('keyboardDidHide', ()=>{
  //     setSpace(0)
  //   });
  // }, []);
  return (
    <>
      <CommonTopBar
        title={params?.id ? 'Edit Retail Order' : 'Create Retail Order'}
        rightIcon={() => (
          <>
            <TouchableOpacity
              disabled={!visibleCamera}
              onPress={captureImage}
              style={{opacity: visibleCamera ? 1 : 0}}>
              <Icon
                style={{marginRight: 5}}
                name="camera"
                size={25}
                color="#ffffff"
              />
            </TouchableOpacity>
          </>
        )}
      />
      <View style={{flex: 1, paddingHorizontal: 10, marginTop: 8}}>
        <ICustomPicker
          label="Outlet Name"
          name="outlet"
          options={outletNameDDL}
          wrapperFullStyle={{marginBottom: 3}}
          renderItem={(item, index) => (
            <>
              <Text
                style={[
                  styles.item,
                  {
                    color: item?.isOrderDone
                      ? 'green'
                      : item?.isNoOrder
                      ? 'red'
                      : 'black',
                  },
                ]}>
                {index + 1}. {item?.label}
              </Text>
            </>
          )}
          onChange={(selectedOption) => {
            formikprops?.setFieldValue('outlet', selectedOption);
            setItemRowData({});
            setSelectedFile(null);
            getCheckInOutInfo(
              profileData?.accountId,
              selectedBusinessUnit?.value,
              params?.route?.value,
              params?.beat?.value,
              selectedOption?.value,
              _todayDate(),
              setTimeInfo,
            );
            if (formikprops?.values?.productType?.value) {
              getItemInfoDDL(
                profileData?.accountId,
                selectedBusinessUnit?.value,
                params?.distributorChannel?.value,
                formikprops?.values?.productType?.value,
                {},
                setItemRowData,
              );
            }
          }}
          formikProps={formikprops}
        />

        <Row colGap={5}>
          <Col width="50%">
            <ICustomPicker
              wrapperFullStyle={{marginBottom: 3}}
              label="Product Type"
              name="productType"
              options={[
                {value: 1, label: 'Mandatory'},
                {value: 2, label: 'Focus'},
                {value: 3, label: 'Others'},
              ]}
              onChange={(selectedOption) => {
                formikprops?.setFieldValue('productType', selectedOption);
                // If Item's are in the object then it will not called
                if (!itemRowData[selectedOption?.value]) {
                  getItemInfoDDL(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    params?.distributorChannel?.value,
                    selectedOption?.value,
                    itemRowData,
                    setItemRowData,
                  );
                }
              }}
              formikProps={formikprops}
              disabled={!formikprops?.values?.outlet?.label}
            />
          </Col>

          {!params?.id && location && IIaddress ? (
            <Col style={{justifyContent: 'center', marginTop: 5}} width="50%">
              <TouchableOpacity
                onPress={() => {
                  if (formikprops?.values?.outlet) {
                    navigation.navigate('No Order', {
                      ...formikprops?.values,
                      location,
                      IIaddress,
                      id: params?.id,
                    });
                  }
                }}>
                <Text style={styles.btnText}>No Order</Text>
              </TouchableOpacity>
            </Col>
          ) : null}
        </Row>
        <Row colGap={5}>
          <Col width="50%">
            {/* <FormInput
              inputStyle={{paddingVertical: 2}}
              name="advanceAmount"
              label="Advance Amount"
              onChangeText={(value) => {
                if (+value <= Number(getTotalAmount())) {
                  formikprops?.setFieldValue('advanceAmount', value);
                }
              }}
              keyboardType="numeric"
              formikProps={formikprops}
            /> */}

            <FormInput
              inputStyle={{paddingVertical: 2}}
              name="search"
              label="Search"
              placeholder="Product Code"
              formikProps={formikprops}
            />
          </Col>
          <Col width="50%">
            <FormInput
              inputStyle={{paddingVertical: 2}}
              value={getTotalAmount() || '0'}
              name="totalOrderAmount"
              label="Total Order Amount"
              disabled={true}
              formikProps={formikprops}
            />
          </Col>
        </Row>

        {/* Header Buttons */}
        <Row colGap={1} style={{marginBottom: 8}}>
          {/* {!params?.id && location && IIaddress ? (
            <Col style={{marginBottom: 5}} width="25%">
              <TouchableOpacity
                onPress={() => {
                  console.log(location, IIaddress);
                  if (formikprops?.values?.outlet) {
                    navigation.navigate('No Order', {
                      ...formikprops?.values,
                      location,
                      IIaddress,
                      id: params?.id,
                    });
                  }
                }}>
                <Text style={styles.btnText}>No Order</Text>
              </TouchableOpacity>
            </Col>
          ) : null} */}

          <Col width="25%">
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Free Items', {
                  values: {...formikprops?.values},
                  items: arrayForFreeItems(),
                  id: params?.id,
                });
              }}>
              <Text style={styles.btnText}>Free Items</Text>
            </TouchableOpacity>
          </Col>

          <Col width="25%">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Show Transaction', {
                  ...formikprops?.values,
                })
              }>
              <Text style={styles.btnText}>Last Delivery</Text>
            </TouchableOpacity>
          </Col>

          {/* <Col width="25%">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('View Stock Allocation', {
                  ...formikprops?.values,
                })
              }>
              <Text style={[styles.btnText]}>Safety Stock</Text>
            </TouchableOpacity>
          </Col> */}

          <Col width="25%">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MRP Price', {
                  ...formikprops?.values,
                  location,
                  IIaddress,
                  id: params?.id,
                  itemRowData:
                    itemRowData[formikprops.values?.productType?.value],
                })
              }>
              <Text style={[styles.btnText]}>MRP Price</Text>
            </TouchableOpacity>
          </Col>

          {itemRowData[formikprops.values?.productType?.value]?.length > 0 ? (
            <Col
              width="25%"
              // style={{marginTop:5}}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('slubOffer', {
                    ...formikprops?.values,
                    location,
                    IIaddress,
                    id: params?.id,
                    itemRowData:
                      itemRowData[formikprops.values?.productType?.value],
                  });
                }}>
                <Text style={styles.btnText}>Slub Offer</Text>
              </TouchableOpacity>
            </Col>
          ) : null}
        </Row>

        {/* Save and Check-In */}
        <Row colGap={5} style={{marginBottom: 5}}>
          <Col width="50%">
            <CustomButton
              onPress={formikprops.handleSubmit}
              style={{marginVertical: 2, height: 40}}
              textStyle={{fontSize: 14}}
              isLoading={loading}
              btnTxt="Save"
            />
          </Col>
          {formikprops?.values?.outlet ? (
            timeInfo?.flag ? (
              <Col width="50%">
                <CustomButton
                  onPress={() => checkin(formikprops?.values)}
                  style={{marginVertical: 2, height: 40}}
                  textStyle={{fontSize: 14}}
                  isLoading={checkInLoading}
                  btnTxt="CheckIn"
                />
              </Col>
            ) : (
              <Col width="50%">
                <Timer
                  arr={
                    timeInfo?.minutes
                      ? timeSpliter(timeInfo?.minutes)
                      : [0, 0, 0, 0, 0]
                  }
                />
              </Col>
            )
          ) : null}
        </Row>
        <FlatList
          data={filteredProduct()}
          ref={flatListRef}
          keyExtractor={(item) => item?.itemName}
          ListHeaderComponent={() => (
            <>
              <View
                style={[
                  {
                    marginBottom: 5,
                    backgroundColor: '#ffffff',
                    borderRadius: 7,
                    padding: 10,
                    marginTop: 5,
                  },
                ]}>
                <View style={styles.selectItemStyle}>
                  <Row style={{alignItems: 'center'}}>
                    <Col width="65%">
                      <Text style={{fontWeight: 'bold'}}>Product</Text>
                      <Text style={{fontWeight: 'bold'}}>Rate</Text>
                    </Col>
                    <Col
                      style={{flexDirection: 'row', justifyContent: 'flex-end'}}
                      width="35%">
                      <Text style={{fontWeight: 'bold'}}>Quantity</Text>
                    </Col>
                  </Row>
                </View>
              </View>
            </>
          )}
          // ===================================
          // Render Individual Items
          // ===================================
          removeClippedSubviews={false} // *** It Fixed The Keyboard on Issue ***
          renderItem={({item, index}) => (
            <>
              <View
                style={[
                  {
                    marginBottom: 5,
                    backgroundColor: '#ffffff',
                    borderRadius: 7,
                    padding: 10,
                  },
                ]}>
                <View style={styles.selectItemStyle}>
                  <Row>
                    {/* productImage */}
                    <Col width="15%">
                      <TouchableOpacity
                        onPress={() => {
                          if (item?.productImage) {
                            setShowModal(true);
                            setImage(item?.productImage);
                          }
                        }}>
                        <Image
                          style={{width: 40, height: 40}}
                          source={{
                            uri: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${item?.productImage}`,
                          }}
                        />
                      </TouchableOpacity>
                    </Col>
                    <Col width="50%">
                      <Text style={{fontWeight: 'bold'}}>{item?.itemName}</Text>
                      <Text style={{fontWeight: 'bold'}}>
                        Rate: {item?.itemRate}
                      </Text>
                    </Col>
                    <Col
                      style={{flexDirection: 'row', justifyContent: 'flex-end'}}
                      width="35%">
                      <QuantityInputBox
                        value={item?.quantity?.toString()}
                        onChange={(value) => {
                          rowDtoHandler(
                            'quantity',
                            Number(value),
                            item?.position,
                            item,
                            formikprops?.values,
                          );
                        }}
                        onIncrement={(e) => {
                          rowDtoHandler(
                            'quantity',
                            Number(item?.quantity) + 1,
                            item?.position,
                            item,
                            formikprops?.values,
                          );
                        }}
                        onDecrement={(e) => {
                          rowDtoHandler(
                            'quantity',
                            Number(item?.quantity) - 1,
                            item?.position,
                            item,
                            formikprops?.values,
                          );
                        }}
                      />
                    </Col>
                  </Row>
                </View>
              </View>
            </>
          )}
          ListFooterComponent={() => (
            <>
              {/* Preview Cooler Image */}
              {selectedFile?.uri && (
                <Image
                  style={{width: 80, height: 80, marginVertical: 10}}
                  source={{
                    uri: selectedFile?.uri,
                  }}
                />
              )}

              {/* Full Screen Product Image Modal */}
              <Modal animationType="fade" transparent visible={showModal}>
                <View>
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                    }}
                    source={{
                      uri: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${image}`,
                    }}
                  />

                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                    }}>
                    <TouchableOpacity
                      style={[
                        {
                          padding: 10,
                        },
                      ]}
                      onPress={() => setShowModal(false)}>
                      <ModalCloseIcon
                        style={{color: 'tomato'}}
                        name="closecircleo"
                        size={50}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </>
          )}
        />
      </View>
    </>
  );
}

export default CreateSecondaryOrder;
const styles = StyleSheet.create({
  availableBalanceSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  availableBalanceAmount: {
    color: '#2ED573',
    fontSize: 25,
    fontWeight: 'bold',
  },
  divider: {
    backgroundColor: '#DFDFDF',
    height: 2,
  },
  teritoryStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 20,
  },
  selectItemStyle: {
    padding: 5,
  },
  notSelectedStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    height: 30,
    padding: 5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  categoryText: {
    margin: 10,
    fontWeight: 'bold',
    fontSize: 15,
  },
  textInputView: {
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    height: 20,
  },
  textInputStyle: {
    width: 30,
    fontSize: 14,
    paddingVertical: -5,
    textAlignVertical: 'top',
  },
  selectItemBar: {
    backgroundColor: '#DFDFDF',
    height: 2,
    borderBottomRightRadius: 26,
    borderBottomLeftRadius: 26,
  },
  btnStyle: {
    backgroundColor: '#3A405A',
    position: 'absolute',
    top: '80%',
    left: '10%',
    alignItems: 'center',
    width: '80%',
    flexDirection: 'row',
    height: 50,
    borderRadius: 25,
    justifyContent: 'space-evenly',
  },
  btnCircle: {
    width: 25,
    height: 25,
    backgroundColor: '#3A405A',
    borderRadius: 15,
    marginHorizontal: 5,
    borderColor: '#fff',
    borderWidth: 2,
  },
  checkBoxStyle: {
    flexDirection: 'row',
    marginVertical: 2,
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  btnText: {
    fontSize: 12,
    borderRadius: 5,
    padding: 5,
    paddingVertical: 7,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#00cdac',
    // fontFamily: 'HelveticaNeue Light',
    textAlign: 'center',
  },
  allButtonMarginButton: {
    marginBottom: 5,
  },
  item: {
    paddingVertical: 15,
    fontSize: 17,
    borderBottomWidth: 1,
    borderColor: '#E4E9F2',
  },
});

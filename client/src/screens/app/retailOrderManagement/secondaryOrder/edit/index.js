import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import {useFormik} from 'formik';
import FormInput from '../../../../../common/components/TextInput';
import ModalCloseIcon from 'react-native-vector-icons/AntDesign';
import {
  getRetailOrderById,
  freQtyOnChangeHandelarFunc,
  editSecondaryOrder,
  getItemDDLForEdit,
  // getCheckInOutInfo,
} from '../helper';

import {GlobalState} from '../../../../../GlobalStateProvider';
import CustomButton from '../../../../../common/components/CustomButton';
import {Toast} from 'native-base';
import QuantityInputBox from '../../../../../common/components/QuantityInputBox';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import {_todayDate} from '../../../../../common/functions/_todayDate';
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

function EditSecondaryOrder({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit, userRole} = useContext(GlobalState);

  const [outletNameDDL, setoutletNameDDL] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(false);
  const [timeInfo, setTimeInfo] = useState(null); // Time info State
  const [itemDDL, setItemDDL] = useState([]);
  const flatListRef = useRef(); // Flat List useRef

  const [itemRowData, setItemRowData] = useState({});
  const [itemInfo, setItemInfo] = useState([]);

  // Main Formik BoilerPlate
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: params?.id ? singleData : {...initValues, ...params},
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      saveHandler(values, () => {
        actions.resetForm();
      });
    },
  });

  // Get By Id For Edit
  useEffect(() => {
    if (params?.id) getRetailOrderById(params?.id, setSingleData, setItemInfo);
  }, []);

  useEffect(() => {
    getItemDDLForEdit(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      singleData?.distributorChannel?.value,
      setItemDDL,
    );
  }, [singleData]);

  const getOutletDDL_action = () => {
    //*********************************/
    // DONT REMOVE
    //*********************************/
    // if (userRole === 'SO') {
    //   getOutletNameDDLForSO(
    //     profileData?.accountId,
    //     selectedBusinessUnit?.value,
    //     params?.route?.value,
    //     params?.beat?.value,
    //     setoutletNameDDL,
    //   );
    // } else {
    //   getOutletNameDDL(
    //     profileData?.accountId,
    //     selectedBusinessUnit?.value,
    //     params?.route?.value,
    //     params?.beat?.value,
    //     setoutletNameDDL,
    //   );
    // }
  };

  useEffect(() => {
    getOutletDDL_action();
  }, [profileData, selectedBusinessUnit]);

  // Row dto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl, rowItm, values) => {
    let data = [...itemInfo];
    let _sl = data[sl];
    _sl[name] = value;
    setItemInfo(data);

    if (name === 'quantity') {
      freQtyOnChangeHandelarFunc(
        selectedBusinessUnit?.value,
        {...values, distributor: values?.distributorName},
        rowItm,
        sl,
        setItemInfo,
        data,
      );
    }
  };

  const addItem = (newItem) => {

    if(!newItem) return ;
    
    const isAlreadyAdded = itemInfo.find(
      (item) => item?.itemId === newItem?.itemId,
    );

    if (isAlreadyAdded) {
      Toast.show({
        text: 'Item Already Added',
        type: 'warning',
        duration: 3000,
      });
      return;
    }

    setItemInfo([
      ...itemInfo,
      {...newItem, quantity: 0, itemName: newItem?.itemCode},
    ]);

    formikprops?.setFieldValue("item","")
  };

  const getTotalAmount = () => {
    let amount = 0;
    itemInfo.forEach((item) => (amount += item?.quantity * item?.itemRate));
    const amountRound = amount?.toFixed(3) ? amount?.toFixed(3) : amount;
    return amountRound.toString() || 0;
  };

  const saveHandler = (values, cb) => {


    const editAttributeValue = itemInfo?.map((item) => ({
      rowId: item?.rowId || 0,
      itemId: item?.itemId,
      itemName: item?.itemName,
      orderId: +params?.id,
      orderQuantity: item?.quantity || 0,
      rate: item?.itemRate,
      orderAmount: item?.itemRate * (item?.quantity || 0),
      uomid: item?.uomId,
      uomname: item?.uomName,
      numFreeDelvQty: item?.numFreeDelvQty,
      numFreeDelvAmount: 0,
      freeProductId: item?.freeProductId || 0,
      freeProductName: item?.freeProductName || '',
    }));
    
    const payload = {
      editAttribute: {
        orderId: +params?.id,
        totalOrderAmount: Number(getTotalAmount()) || 0,
        receiveAmount: Number(values?.advanceAmount) || 0,
        isClosed: false,
      },
      editAttributeValue,
    };

    // console.log(JSON.stringify(payload, null, 2));

    editSecondaryOrder(payload, setLoading, () => {});
  };

  return (
    <>
      <CommonTopBar
        title={params?.id ? 'Edit Retail Order' : 'Create Retail Order'}
      />

      <View style={{flex: 1, paddingHorizontal: 10, marginTop: 8}}>
        <ICustomPicker
          label="Outlet Name"
          name="outlet"
          // wrapperStyle={{paddingVertical: 2}}
          options={outletNameDDL}
          disabled={true}
          onChange={(selectedOption) => {
            formikprops?.setFieldValue('outlet', selectedOption);
            setItemRowData({});
            setSelectedFile(null);
            // getCheckInOutInfo(
            //   profileData?.accountId,
            //   selectedBusinessUnit?.value,
            //   params?.route?.value,
            //   params?.beat?.value,
            //   selectedOption?.value,
            //   _todayDate(),
            //   setTimeInfo,
            // );
          }}
          formikProps={formikprops}
        />

        <Row colGap={5} style={{alignItems: 'center'}}>
          <Col width="50%">
            <ICustomPicker
              label="Item"
              name="item"
              options={itemDDL}
              formikProps={formikprops}
            />
          </Col>

          <Col width="50%">
            <TouchableOpacity
              onPress={() => addItem(formikprops?.values?.item)}
              style={{flexDirection: 'row'}}>
              <Text style={[styles.btnText, {padding: 22, fontSize: 14}]}>
                Add
              </Text>
            </TouchableOpacity>
          </Col>
        </Row>

        {/* <ICustomPicker
          label="Product Type"
          name="productType"
          options={[
            {value: 1, label: 'Mendatory'},
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
        /> */}

        <Row colGap={5}>
          <Col width="50%">
            <FormInput
              inputStyle={{paddingVertical: 2}}
              name="advanceAmount"
              label="Advance Amount"
              disabled={true}
              onChangeText={(value) => {
                if (+value <= Number(getTotalAmount())) {
                  formikprops?.setFieldValue('advanceAmount', value);
                }
              }}
              keyboardType="numeric"
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
          <Col width="25%">
            <TouchableOpacity
              onPress={() => {
                console.log(JSON.stringify(itemInfo,null,2))
                navigation.navigate('Free Items', {
                  values: {...formikprops?.values},
                  items: itemInfo,
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

          <Col width="25%">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('View Stock Allocation', {
                  ...formikprops?.values,
                })
              }>
              <Text style={[styles.btnText]}>Safety Stock</Text>
            </TouchableOpacity>
          </Col>
        </Row>

        {/* Save and Check-In */}
        <Row colGap={5} style={{marginBottom: 5}}>
          <Col width="100%">
            <CustomButton
              onPress={formikprops.handleSubmit}
              style={{marginVertical: 2, height: 40}}
              textStyle={{fontSize: 14}}
              isLoading={loading}
              btnTxt="Save"
            />
          </Col>
        </Row>
        <FlatList
          data={itemInfo}
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
                  <Row>
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
                            index,
                            item,
                            formikprops?.values,
                          );
                        }}
                        onIncrement={(e) => {
                          rowDtoHandler(
                            'quantity',
                            Number(item?.quantity) + 1,
                            index,
                            item,
                            formikprops?.values,
                          );
                        }}
                        onDecrement={(e) => {
                          rowDtoHandler(
                            'quantity',
                            Number(item?.quantity) - 1,
                            index,
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

export default EditSecondaryOrder;
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
  },
});

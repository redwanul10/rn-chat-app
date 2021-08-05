/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {useFormik} from 'formik';
import {GlobalState} from '../../../../../GlobalStateProvider';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import NoDataFoundGrid from '../../../../../common/components/NoDataFoundGrid';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import CustomButton from '../../../../../common/components/CustomButton';
import {Spinner} from 'native-base';
import FormInput from '../../../../../common/components/TextInput';
import {
  getVehicleDDL,
  getdistributorChannelNameDDL,
  getItemDDL,
  freQtyOnChangeHandelarFunc,
  createSummaryDeliveryOrder,
  getSummaryDeliveryById,
} from '../helper';
import * as Yup from 'yup';
import {tabBgPrimary} from '../../../../../common/theme/color';
import {globalStyles} from '../../../../../common/globalStyle/globalStyles';
import QuantityInputBox from '../../../../../common/components/QuantityInputBox';
import {getII_address, getWeatherInfo} from '../../../../../common/actions/helper';
import getGeoLocation from '../../../../../common/functions/getGeoLocation';
import {Toast} from 'native-base';

const initValues = {
  vehicle: '',
  distributionChannel: '',
  receiveAmount: '',
  totalDeliveryAmount: '0',
};

const validationSchema = Yup.object().shape({
  vehicle: Yup.object().required('Territory Name is required'),
  distributionChannel: Yup.object().required('Distributor is required'),
});

function summaryDeliveryForm({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState();
  const [rowData, setRowData] = useState();
  const [location, setLocation] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState({});
  const [IIaddress, setIIaddress] = useState('');

  // DDL
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [vehicleDDL, setVehicleDDL] = useState([
    {value: 0, label: 'No Vehicle'},
  ]);

  // Get Ueser Location (lat,lng)
  useEffect(() => {
    if (!params?.id) {
      getGeoLocation(setLocation);
    }
  }, []);

  // Get readable Address from (lat,lng)
  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      getII_address(setIIaddress, location?.latitude, location?.longitude);
      getWeatherInfo(location?.latitude ,location?.longitude,setWeatherInfo)
    }
  }, [location]);

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: params?.id
      ? {...singleData, ...params}
      : {...initValues, ...params},
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      saveHandler(values, () => {
        actions.resetForm();
        setRowData([]);
      });
    },
  });

  // Fetch Signle Data by Id
  useEffect(() => {
    if (params?.id) {
      getSummaryDeliveryById(params?.id, setSingleData, setLoading);
    }
  }, [params?.id]);

  // Set Row Data When Single Data come
  useEffect(() => {
    if (params?.id) {
      const newData = singleData?.row?.map((item) => {
        return {
          rowId: item?.rowId || 0,
          orderId: singleData?.orderId,
          orderQty: item?.deliveryQuantity,
          rate: item?.price,
          amount: item?.orderAmount,
          uomId: item?.uomid,
          uomName: item?.uomname,
          itemId: item?.productId,
          itemName: item?.productName,
          numFreeDelvQty: item?.numFreeDelvQty || 0,
          freeProductId: item?.freeProductId || 0,
          freeProductName: item?.freeProductName || '',
        };
      });
      setRowData(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    if (!params?.id) {
      if (
        profileData?.accountId &&
        selectedBusinessUnit?.value &&
        params?.distributor?.value
      ) {
        getdistributorChannelNameDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          params?.distributor?.value,
          setDistributionChannelDDL,
          formikprops?.setFieldValue,
        );
        getVehicleDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          params?.distributor?.value,
          setVehicleDDL,
        );
      }
    }
  }, [
    profileData?.accountId,
    selectedBusinessUnit?.value,
    params?.distributor?.value,
  ]);

  useEffect(() => {
    if (!params?.id) {
      if (
        profileData?.accountId &&
        selectedBusinessUnit?.value &&
        formikprops?.values?.distributionChannel?.value
      ) {
        getItemDDL(
          setRowData,
          profileData?.accountId,
          selectedBusinessUnit?.value,
          formikprops?.values?.distributionChannel?.value,
          setLoading,
        );
      }
    }
  }, [
    profileData,
    selectedBusinessUnit,
    formikprops?.values?.distributionChannel?.value,
  ]);

  // Count Sum of Order amount
  let totalAmount = rowData?.reduce(
    (total, obj) => total + +obj?.orderQty * obj?.rate,
    0,
  );

  // Row dto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl, rowItm) => {
    let newRowData = [...rowData];
    let _sl = newRowData[sl];
    _sl[name] = +value;
    setRowData(newRowData);

    if (name === 'orderQty') {
      freQtyOnChangeHandelarFunc(
        selectedBusinessUnit?.value,
        formikprops?.values,
        rowItm,
        sl,
        setRowData,
        newRowData,
      );
    }
  };

  const saveHandler = (values, cb) => {
    if (rowData?.length > 0) {
      if (!params?.id) {
        let newRowObj = rowData?.filter((itm) => itm?.orderQty > 0);

        if (newRowObj?.length === 0) {
          Toast.show({
            text: 'Please select atleast one item with Qty',
            type: 'warning',
            duration: 3000,
          });
          return;
        }

        let payload = {
          objHeader: {
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            territoryid: values?.territory?.value,
            routId: 0,
            beatId: 0,
            distributorId: values?.distributor?.value,
            distributorChannel: values?.distributionChannel?.value,
            distributorChannelName: values?.distributionChannel?.label,
            dteDeliveryDate: _todayDate(),
            numTotalDeliveryAmount: totalAmount,
            receiveAmount: +values?.receiveAmount,
            intActionBy: profileData?.userId,
            vehicleId: values?.vehicle?.value,
            vehicleNo: values?.vehicle?.label,
            latitude: location?.latitude?.toString() || '',
            longitude: location?.longitude?.toString() || '',
            llAddress: IIaddress || '',
            weatherInfo: weatherInfo?.main?.temp?.toString() || "",
          },
          objRow: newRowObj?.map((data) => {
            return {
              itemId: data?.itemId,
              itemName: data?.itemName,
              rate: data?.rate,
              orderQTY: data?.orderQty,
              uomid: data?.uomId,
              uomname: data?.uomName,
              actionBy: profileData?.userId,
              numFreeDelvQty: data?.numFreeDelvQty || 0,
              numFreeDelvAmount: 0,
              freeProductId: data?.freeProductId || 0,
              freeProductName: data?.freeProductName || '',
            };
          }),
        };
        createSummaryDeliveryOrder(payload, setLoading, cb);
      }
    }
  };

  return (
    <>
      <ScrollView>
        <CommonTopBar title={`${params?.type} Summary Delivery`} />
        <>
          <View style={{paddingHorizontal: 10, marginTop: 10}}>
            <ScrollView>
              <Row colGap={5}>
                <Col width="50%">
                  <ICustomPicker
                    label="Territory Name"
                    name="territory"
                    options={[]}
                    formikProps={formikprops}
                    disabled
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    label="Distributor"
                    name="distributor"
                    options={[]}
                    formikProps={formikprops}
                    disabled
                  />
                </Col>

                <Col width="50%">
                  <ICustomPicker
                    label="Distribution Channel"
                    name="distributionChannel"
                    options={distributionChannelDDL}
                    formikProps={formikprops}
                    disabled={params?.id ? true : false}
                  />
                </Col>

                <Col width="50%">
                  <ICustomPicker
                    label="Vehicle"
                    name="vehicle"
                    options={vehicleDDL}
                    onChange={(valueOption) => {
                      formikprops?.setFieldValue('vehicle', valueOption);
                    }}
                    formikProps={formikprops}
                    disabled={params?.id ? true : false}
                  />
                </Col>

                <Col width="50%">
                  <FormInput
                    label="Receive Amount"
                    placeholder="Receive Amount"
                    name="receiveAmount"
                    keyboardType="numeric"
                    formikProps={formikprops}
                    disabled={params?.id}
                  />
                </Col>

                <Col width="50%">
                  <FormInput
                    label="Total Delivery Amount"
                    placeholder="Total Delivery Amount"
                    value={totalAmount?.toFixed(2).toString()}
                    name="totalDeliveryAmount"
                    formikProps={formikprops}
                    disabled
                  />
                </Col>

                {!params.id && (
                  <Col width="100%">
                    <CustomButton
                      onPress={formikprops.handleSubmit}
                      btnTxt={'Save'}
                    />
                  </Col>
                )}
              </Row>
              {loading && <Spinner color="black" />}

              <>
                {rowData?.length > 0 ? (
                  <>
                    <Row style={[styles.cardStyle]}>
                      <Col style={{width: '50%'}}>
                        <Text
                          style={[
                            styles.employeeName,
                            globalStyles.fontSizeMedium,
                          ]}>
                          Item Name
                        </Text>
                        <Text
                          style={[
                            globalStyles.fontSizeMini,
                            {fontWeight: 'bold'},
                          ]}>
                          UoM
                        </Text>
                        <Text
                          style={[
                            globalStyles.fontSizeMini,
                            {fontWeight: 'bold', color: 'green'},
                          ]}>
                          Rate
                        </Text>
                      </Col>

                      <Col
                        style={{
                          width: '50%',
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          style={[
                            {
                              color: 'black',
                              fontWeight: 'bold',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          Free Item Name
                        </Text>
                        <Text
                          style={[
                            {
                              color: 'tomato',
                              fontWeight: 'bold',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          Free Qty
                        </Text>
                        <Text
                          style={[
                            {
                              color: tabBgPrimary,
                              fontWeight: 'bold',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          Amount
                        </Text>
                        <Text
                          style={[
                            {
                              color: 'green',
                              fontWeight: 'bold',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          Delivery Qty
                        </Text>
                      </Col>
                    </Row>
                  </>
                ) : null}

                <View style={{paddingBottom: 10}}>
                  {rowData?.map((item, index) => (
                    <Row key={index} style={[styles.cardStyle]}>
                      <Col style={{width: '50%'}}>
                        <Text
                          style={[
                            styles.employeeName,
                            globalStyles.fontSizeMedium,
                          ]}>
                          {item?.itemName}
                        </Text>
                        <Text
                          style={[
                            globalStyles.fontSizeMini,
                            {fontWeight: 'bold'},
                          ]}>
                          {item?.uomName}
                        </Text>
                        <Text
                          style={[
                            globalStyles.fontSizeMini,
                            {fontWeight: 'bold', color: 'green'},
                          ]}>
                          {item?.rate}
                        </Text>
                      </Col>

                      <Col
                        style={{
                          width: '50%',
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          style={[
                            {
                              color: 'black',
                              fontWeight: 'bold',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          {item?.freeProductName || '-'}
                        </Text>
                        <Text
                          style={[
                            {
                              color: 'tomato',
                              fontWeight: 'bold',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          {item?.numFreeDelvQty}
                        </Text>
                        <Text
                          style={[
                            {
                              color: tabBgPrimary,
                              fontWeight: 'bold',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          {(item?.orderQty * item?.rate)?.toFixed(2)}
                        </Text>

                        {params?.id ? (
                          <Text
                            style={[
                              {
                                color: 'green',
                                fontWeight: 'bold',
                              },
                              globalStyles.fontSizeMini,
                            ]}>
                            {rowData[index]?.orderQty}
                          </Text>
                        ) : (
                          <View style={{marginTop: 10}}>
                            <QuantityInputBox
                              value={rowData[index]?.orderQty?.toString()}
                              onChange={(value) => {
                                rowDtoHandler(
                                  'orderQty',
                                  Number(value),
                                  index,
                                  item,
                                );
                              }}
                              onIncrement={(e) => {
                                rowDtoHandler(
                                  'orderQty',
                                  Number(item?.orderQty) + 1,
                                  index,
                                  item,
                                );
                              }}
                              onDecrement={(e) => {
                                rowDtoHandler(
                                  'orderQty',
                                  Number(item?.orderQty) - 1,
                                  index,
                                  item,
                                  formikprops?.values,
                                );
                              }}
                            />
                          </View>
                        )}
                      </Col>
                    </Row>
                  ))}
                </View>
                {rowData?.length === 0 && <NoDataFoundGrid />}
              </>
            </ScrollView>
          </View>
        </>
      </ScrollView>
    </>
  );
}

export default summaryDeliveryForm;

const styles = StyleSheet.create({
  cardStyle: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  employeeName: {
    fontWeight: 'bold',
    color: 'black',
  },
});

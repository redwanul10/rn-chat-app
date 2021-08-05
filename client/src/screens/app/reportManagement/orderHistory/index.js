/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import {GlobalState} from '../../../../GlobalStateProvider';
import ICustomPicker from '../../../../common/components/ICustomPicker';
import CustomButton from '../../../../common/components/CustomButton';
import {getNotOrderBaseReport, getTotalOrderInfo} from './helper';
import {
  getTerritoryDDL,
  getRouteDDLByTerritoryId,
  getDristributorChannel,
} from '../../../../common/actions/helper';
import Icon from 'react-native-vector-icons/Entypo';
import ModalCloseIcon from 'react-native-vector-icons/AntDesign';

import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import {getOrderBaseReport} from './helper';
import IDatePicker from '../../../../common/components/IDatePicker';
import {_todayDate} from '../../../../common/functions/_todayDate';
import {getNotVisitReport} from './helper';
import NoDataFoundGrid from '../../../../common/components/NoDataFoundGrid';
import * as Yup from 'yup';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import {globalStyles} from '../../../../common/globalStyle/globalStyles';
import {useFormik} from 'formik';
import {routeSelectByDefault} from '../../../../common/functions/routeSelectedByDefault';
import {channelSelectedByDefault} from '../../../../common/functions/channelSelectedByDefault';

const validationSchema = Yup.object().shape({
  territory: Yup.object().shape({
    label: Yup.string().required('Territory Name is required'),
    value: Yup.string().required('Territory Name is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('Route Name is required'),
    value: Yup.string().required('Route Name is required'),
  }),
  type: Yup.object().shape({
    label: Yup.string().required('Type is required'),
    value: Yup.string().required('Type is required'),
  }),
});

const initValues = {
  territory: '',
  route: '',
  date: _todayDate(),
  type: '',
  distributorChannel:"",
};

function OrderHistory({navigation}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );

  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [distributorChannelDDL, setDistributorChannel] = useState([]);
  const [disableChannelDDL, setDisableChannelDDL] = useState(false);

  const [landingData, setLandingData] = useState();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(false);
  const [totalOrderInfo, setTotalOrderInfo] = useState();

  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setTerritoryDDL,
    );

    getDristributorChannel(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDistributorChannel,
    );
  }, [profileData, selectedBusinessUnit]);

  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: {...initValues},
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      viewHandler(values, () => {
        actions.resetForm();
      });
    },
  });

  useEffect(() => {
    channelSelectedByDefault(
      territoryInfo,
      distributorChannelDDL,
      (selectedRoute) => {
        formikprops?.setFieldValue('distributorChannel', selectedRoute);
        setDisableChannelDDL(true)
      },
    );
  }, [distributorChannelDDL]);

  const viewHandler = (values) => {
    switch (values?.type?.value) {
      case 1:
        getTotalOrderInfo(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          values?.territory?.value,
          values?.route?.value,
          values?.date || _todayDate(),
          setTotalOrderInfo,
        );
        getOrderBaseReport(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          values?.territory?.value,
          values?.route?.value,
          values?.date,
          values?.distributorChannel?.value,
          setLandingData,
          setLoading,
        );
        break;
      case 2:
        getNotOrderBaseReport(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          values?.territory?.value,
          values?.route?.value,
          values?.date,
          values?.distributorChannel?.value,
          setLandingData,
          setLoading,
        );
        break;
      case 3:
        getNotVisitReport(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          values?.territory?.value,
          values?.route?.value,
          values?.date,
          values?.distributorChannel?.value,
          setLandingData,
          setLoading,
        );
        break;
    }
  };
  useEffect(() => {
    routeSelectByDefault(territoryInfo, routeDDL, (selectedRoute) => {
      formikprops?.setFieldValue('route', selectedRoute);
      setTotalOrderInfo();
      setLandingData();
    });
  }, [routeDDL]);

  return (
    <>
      <ScrollView>
        <CommonTopBar title={'Outlet Order History'} />

        <>
          <View style={{paddingHorizontal: 10, marginTop: 10}}>
            <ScrollView>
              <Row colGap={5}>
                <Col width="50%">
                  <ICustomPicker
                    label="Territory Name"
                    name="territory"
                    options={territoryDDL}
                    wrapperStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 5,
                    }}
                    onChange={(item) => {
                      formikprops.setFieldValue('territory', item);
                      formikprops.setFieldValue('route', '');
                      setTotalOrderInfo();
                      setLandingData();
                      getRouteDDLByTerritoryId(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        item?.value,
                        setRouteDDL,
                      );
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    label="Route Name"
                    name="route"
                    options={routeDDL}
                    onChange={(item) => {
                      formikprops.setFieldValue('route', item);
                      setTotalOrderInfo();
                      setLandingData();
                    }}
                    wrapperStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 5,
                    }}
                    formikProps={formikprops}
                  />
                </Col>

                <Col width="50%">
                  <ICustomPicker
                    label="Type"
                    name="type"
                    options={[
                      {
                        value: 1,
                        label: 'Order Base',
                      },
                      {
                        value: 2,
                        label: 'No Order Base',
                      },
                      {
                        value: 3,
                        label: 'Not Visit',
                      },
                    ]}
                    wrapperStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 5,
                    }}
                    onChange={(item) => {
                      formikprops.setFieldValue('type', item);
                      setLandingData();
                      setTotalOrderInfo();
                    }}
                    formikProps={formikprops}
                  />
                </Col>

                <Col width="50%">
                  <ICustomPicker
                    label="Distribution Channel"
                    name="distributorChannel"
                    options={distributorChannelDDL}
                    onChange={(item) => {
                      formikprops.setFieldValue('distributorChannel', item);
                    }}
                    formikProps={formikprops}
                    disabled={disableChannelDDL}
                  />
                </Col>
                <Col width="50%">
                  <IDatePicker
                    label="Record Date"
                    name="date"
                    onChange={(selectedDate) => {
                      formikprops.setFieldValue(
                        'date',
                        _dateFormatter(selectedDate),
                      );
                    }}
                    wrapperStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 5,
                    }}
                    formikProps={formikprops}
                  />
                </Col>
              </Row>

              <CustomButton
                onPress={formikprops.handleSubmit}
                isLoading={loading}
                btnTxt="View"
              />

              <>
                {totalOrderInfo ? (
                  <>
                    <Row
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 5,
                        padding: 10,
                        backgroundColor: '#fff',
                      }}>
                      <Col width="50%">
                        <Text
                          style={[styles.infos, globalStyles.fontSizeMicro]}>
                          Order Quantity
                        </Text>
                        <Text
                          style={[styles.infos, globalStyles.fontSizeMicro]}>
                          {totalOrderInfo?.totalOrderQuantity || 0} pcs /{' '}
                          {totalOrderInfo?.totalOrderCaseQuantity || 0} case
                        </Text>
                      </Col>

                      <Col style={{alignItems: 'flex-end'}} width="50%">
                        <Text
                          style={[
                            styles.infos,
                            globalStyles.fontSizeMicro,
                            {
                              color: 'green',
                            },
                          ]}>
                          Order Amount
                        </Text>
                        <Text
                          style={[
                            styles.infos,
                            globalStyles.fontSizeMicro,
                            {
                              color: 'green',
                            },
                          ]}>
                          {totalOrderInfo?.totalOrderAmount?.toFixed(0)
                            ? totalOrderInfo?.totalOrderAmount?.toFixed(0)
                            : totalOrderInfo?.totalOrderAmount || 0}
                        </Text>
                      </Col>
                    </Row>
                  </>
                ) : null}
                <View
                  key={1}
                  style={[
                    styles.cardStyle,
                    {flexDirection: 'row', alignItems: 'center'},
                    {
                      marginTop: 10,
                      padding: 10,
                      borderRadius: 5,
                      backgroundColor: '#ffffff',
                    },
                  ]}>
                  <View style={{width: '50%'}}>
                    <Text style={{fontWeight: 'bold'}}>SL</Text>
                    <Text
                      style={[
                        {
                          fontWeight: 'bold',
                          color: 'black',
                        },
                        globalStyles.fontSizeSmall,
                      ]}>
                      Outlet Name
                    </Text>
                    {formikprops?.values?.type?.value === 1 && (
                      <Text style={globalStyles.fontSizeMedium}>Order No</Text>
                    )}
                    <Text style={globalStyles.fontSizeMini}>Address</Text>

                    {formikprops?.values?.type?.value === 2 && (
                      <>
                        <Text
                          style={[
                            {
                              color: 'tomato',
                            },
                            globalStyles.fontSizeMedium,
                          ]}>
                          Not Ordering Reason
                        </Text>
                      </>
                    )}
                  </View>

                  <View
                    style={{
                      width: '50%',
                      alignItems: 'flex-end',
                    }}>
                    {formikprops?.values?.type?.value === 1 && (
                      <Text style={{color: 'green', fontWeight: 'bold'}}>
                        Amount
                      </Text>
                    )}

                    {(formikprops?.values?.type?.value === 2 ||
                      formikprops?.values?.type?.value === 3) && (
                      <>
                        <Text
                          style={{
                            color: 'black',
                            fontWeight: 'bold',
                          }}>
                          Owner Name
                        </Text>
                        <Text
                          style={{
                            color: 'black',
                            fontWeight: 'bold',
                          }}>
                          Mobile Number
                        </Text>
                      </>
                    )}
                  </View>
                </View>

                {/* Grid Data */}
                <View style={{paddingTop: 10}}>
                  {landingData?.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        if (item?.image) {
                          setImage(item?.image);
                          setShowModal(true);
                        }
                      }}>
                      <View
                        key={index + 1}
                        style={[
                          styles.cardStyle,
                          {flexDirection: 'row', alignItems: 'center'},
                          {
                            marginVertical: 10,
                            padding: 10,
                            borderRadius: 5,
                            backgroundColor: '#ffffff',
                          },
                        ]}>
                        <View style={{width: '65%'}}>
                          <Text style={{fontWeight: 'bold'}}>{index + 1}</Text>
                          <Text
                            style={[
                              {
                                fontWeight: 'bold',
                                color: 'black',
                              },
                              globalStyles.fontSizeSmall,
                            ]}>
                            {item?.outletName} {item?.cooler && '(Cooler)'}
                          </Text>
                          {formikprops?.values?.type?.value === 1 && (
                            <>
                              <Text style={globalStyles.fontSizeMedium}>
                                {item?.orderCode}
                              </Text>
                            </>
                          )}
                          <Text style={globalStyles.fontSizeMini}>
                            {item?.address || item?.outletAddress}
                          </Text>
                          {formikprops?.values?.type?.value === 2 && (
                            <>
                              <Text
                                style={[
                                  {
                                    color: 'tomato',
                                  },
                                  globalStyles.fontSizeMedium,
                                ]}>
                                {item?.notOrderingReason}
                              </Text>
                            </>
                          )}
                        </View>
                        <View
                          style={{
                            width: '35%',
                            alignItems: 'flex-end',
                          }}>
                          {formikprops?.values?.type?.value === 1 && (
                            <Text
                              style={{
                                color: 'green',
                                fontWeight: 'bold',
                              }}>
                              {item?.totalOrderAmount}
                            </Text>
                          )}
                          {(formikprops?.values?.type?.value === 2 ||
                            formikprops?.values?.type?.value === 3) && (
                            <>
                              <Text
                                style={{
                                  color: 'black',
                                  fontWeight: 'bold',
                                  textAlign: 'right',
                                }}>
                                {item?.ownerName}
                              </Text>
                              <Text
                                style={{
                                  color: 'black',
                                  fontWeight: 'bold',
                                }}>
                                {item?.mobileNumber}
                              </Text>
                            </>
                          )}

                          {item?.image ? (
                            <>
                              <Text
                                style={{
                                  color: 'green',
                                  fontWeight: 'bold',
                                }}>
                                <Icon
                                  style={{color: 'black'}}
                                  name="eye"
                                  size={20}
                                />
                              </Text>
                            </>
                          ) : null}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>

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
            </ScrollView>
          </View>
          {landingData?.length === 0 && <NoDataFoundGrid />}
        </>
      </ScrollView>
    </>
  );
}

export default OrderHistory;

const styles = StyleSheet.create({
  calendarStyle: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalStyle: {
    width: 340,
    height: 183,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  infos: {
    fontWeight: 'bold',
  },
});

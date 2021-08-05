import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  // Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import {GlobalState} from '../../../../../GlobalStateProvider';
import {
  getRetaliOrderLandingData,
  getDistributorAndChannel,
  getTotalOutlet,
  getTotalOrderInfo,
} from '../helper';

import {
  getRouteDDL,
  getTerritoryDDL,
  getBeatDDL,
} from '../../../../../common/actions/helper';
import {useFormik} from 'formik';
import CustomButton from '../../../../../common/components/CustomButton';
import FabButton from '../../../../../common/components/FabButton';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';

import * as Yup from 'yup';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import IDatePicker from '../../../../../common/components/IDatePicker';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';
import MiniButton from '../../../../../common/components/MiniButton';
import Text from '../../../../../common/components/IText';
import {globalStyles} from '../../../../../common/globalStyle/globalStyles';
import {routeSelectByDefault} from '../../../../../common/functions/routeSelectedByDefault';

const validationSchema = Yup.object().shape({
  territory: Yup.object().shape({
    label: Yup.string().required('Territory Name is required'),
    value: Yup.string().required('Territory Name is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('Route is required'),
    value: Yup.string().required('Route is required'),
  }),
  beat: Yup.object().shape({
    label: Yup.string().required('Market is required'),
    value: Yup.string().required('Market is required'),
  }),
});

const title = 'Retail Order';
const initValues = {
  territory: '',
  route: '',
  beat: '',
  date: _todayDate(),
};
function LandingSecondary({navigation}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [beatDDL, setBeatDDL] = useState([]);
  const [landingData, setLandingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [totlaOutlet, setTotalOutlet] = useState({});
  const [totalOrderInfo, setTotalOrderInfo] = useState({});
  const [distributorAndChannel, setDistributorAndChannel] = useState({});

  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setTerritoryDDL,
    );
  }, [profileData, selectedBusinessUnit]);

  const viewHandler = (values) => {
    getRetaliOrderLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.territory?.value,
      values?.route?.value,
      values?.beat?.value,
      values?.date,
      setLandingData,
      setLoading,
    );
  };

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

  // Last Added | By Default Route Selected | login info wise (territoryInfo?.todayRouteId)
  useEffect(() => {
    routeSelectByDefault(territoryInfo, routeDDL, (selectedRoute) => {
      formikprops?.setFieldValue('route', selectedRoute);
      getBeatDDL(selectedRoute?.value, setBeatDDL);
      getTotalOutlet(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        selectedRoute?.value,
        formikprops?.values?.date || _todayDate(),
        setTotalOutlet,
      );
    });
  }, [routeDDL]);

  return (
    <>
      {/* component top bar */}
      <CommonTopBar title={title} />

      <ScrollView
        contentContainerStyle={{paddingHorizontal: 10, paddingTop: 10}}>
        <>
          <View>
            <ScrollView>
              <Row colGap={5}>
                <Col width="50%">
                  <ICustomPicker
                    label="Territory Name"
                    name="territory"
                    options={territoryDDL}
                    wrapperStyle={{backgroundColor: '#ffffff', borderRadius: 5}}
                    onChange={(item) => {
                      formikprops.setFieldValue('territory', item);
                      formikprops.setFieldValue('route', '');
                      formikprops.setFieldValue('market', '');
                      getDistributorAndChannel(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        item?.value,
                        setDistributorAndChannel,
                      );

                      getRouteDDL(
                        profileData?.accountId,

                        selectedBusinessUnit?.value,
                        item?.value,
                        setRouteDDL,
                      );

                      getTotalOrderInfo(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        item?.value,
                        formikprops?.values?.date || _todayDate(),
                        setTotalOrderInfo,
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
                    wrapperStyle={{backgroundColor: '#ffffff', borderRadius: 5}}
                    onChange={(item) => {
                      formikprops.setFieldValue('route', item);
                      getBeatDDL(item?.value, setBeatDDL);
                      getTotalOutlet(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        item?.value,
                        formikprops?.values?.date || _todayDate(),
                        setTotalOutlet,
                      );
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    label="Market Name"
                    name="beat"
                    options={beatDDL}
                    wrapperStyle={{backgroundColor: '#ffffff', borderRadius: 5}}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <IDatePicker
                    label="Order Date"
                    name="date"
                    wrapperStyle={{backgroundColor: '#ffffff', borderRadius: 5}}
                    formikProps={formikprops}
                    onChange={(selectedDate) => {
                      formikprops.setFieldValue(
                        'date',
                        _dateFormatter(selectedDate),
                      );
                      getTotalOrderInfo(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        formikprops?.values?.territory?.value,
                        _dateFormatter(selectedDate) || _todayDate(),
                        setTotalOrderInfo,
                      );
                      getTotalOutlet(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        formikprops?.values?.route?.value,
                        _dateFormatter(selectedDate),
                        setTotalOutlet,
                      );
                    }}
                  />
                </Col>
              </Row>

              {/* Outlet informations */}
              <View
                style={{
                  backgroundColor: '#ffffff',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={[styles.infos, globalStyles.fontSizeNano]}>
                    Total Outlet: {totlaOutlet?.totalOutlet || 0}
                  </Text>
                  <Text style={[styles.infos, globalStyles.fontSizeNano]}>
                    Order Outlet: {totlaOutlet?.totalOrderOutlet || 0}
                  </Text>
                  <Text style={[styles.infos, globalStyles.fontSizeNano]}>
                    No Order: {totlaOutlet?.totalNoOrderOutlet || 0}
                  </Text>
                  <Text style={[styles.infos, globalStyles.fontSizeNano]}>
                    Not Visited:{' '}
                    {totlaOutlet?.totalOutlet -
                      (totlaOutlet?.totalOrderOutlet +
                        totlaOutlet?.totalNoOrderOutlet) || 0}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 5,
                  }}>
                  <Text style={[styles.infos, globalStyles.fontSizeNano]}>
                    Order Quantity: {totalOrderInfo?.totalOrderQuantity || 0}{' '}
                    pcs / {totalOrderInfo?.totalOrderCaseQuantity || 0} case
                  </Text>

                  <Text
                    style={[
                      styles.infos,
                      globalStyles.fontSizeNano,
                      {color: 'green'},
                    ]}>
                    Order Amount:{' '}
                    {totalOrderInfo?.totalOrderAmount?.toFixed(0)
                      ? totalOrderInfo?.totalOrderAmount?.toFixed(0)
                      : totalOrderInfo?.totalOrderAmount || 0}
                  </Text>
                </View>
              </View>

              <CustomButton
                onPress={(e) => {
                  formikprops.handleSubmit();

                  if (formikprops?.values?.territory?.value) {
                    getTotalOrderInfo(
                      profileData?.accountId,
                      selectedBusinessUnit?.value,
                      formikprops?.values?.territory?.value,
                      formikprops?.values?.date || _todayDate(),
                      setTotalOrderInfo,
                    );
                  }

                  if (formikprops?.values?.route?.value) {
                    getTotalOutlet(
                      profileData?.accountId,
                      selectedBusinessUnit?.value,
                      formikprops?.values?.route?.value,
                      formikprops?.values?.date || _todayDate(),
                      setTotalOutlet,
                    );
                  }
                }}
                isLoading={loading}
                style={{marginTop: 10, marginBottom: 5}}
                btnTxt="View"
              />

              <Row style={globalStyles.cardStyle}>
                <Col width="50%" style={{justifyContent: 'center'}}>
                  {/* <Text style={{ fontWeight: 'bold' }}>SL</Text> */}
                  <Text
                    style={[styles.customerAmount, globalStyles.fontSizeSmall]}>
                    Outlet Name
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    {/* <Text style={[styles.completeButton, {color: '#00B44A'}]}>
                      Status
                    </Text> */}
                  </View>
                </Col>
                <Col width="50%">
                  <Text style={[{textAlign: 'right'}]}>Order Amount</Text>
                  <Text
                    style={[
                      styles.customerAmount,
                      globalStyles.fontSizeSmall,
                      {color: '#00B44A', textAlign: 'right'},
                    ]}>
                    Delivery Amount
                  </Text>
                  <Row>
                    <Col width="50%">
                      <Text style={{textAlign: 'right'}}>Delivery Qty</Text>
                    </Col>
                    <Col width="50%">
                      <Text style={{textAlign: 'right'}}>Order Qty</Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {landingData?.data?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate('View Retail Order', {
                      id: item?.orderId,
                    })
                  }
                  style={[globalStyles.cardStyle, {marginVertical: 4}]}>
                  <Row>
                    <Col width="60%" style={{justifyContent: 'center'}}>
                      {/* <Text style={{ fontWeight: 'bold' }}>{index + 1}</Text> */}
                      <Text
                        style={[
                          styles.customerAmount,
                          globalStyles.fontSizeSmall,
                        ]}>
                        {' '}
                        {item?.outletName} {item?.cooler && '(Cooler)'}
                      </Text>
                      <MiniButton
                        containerStyle={{justifyContent: 'flex-start'}}
                        onPress={() =>
                          navigation.navigate(`Edit Secondary Order`, {
                            id: item?.orderId,
                          })
                        }
                        btnText={'Edit'}
                      />
                    </Col>
                    <Col width="40%">
                      <Text style={[{textAlign: 'right'}]}>
                        {/* Assign By Iftakhar Alam */}
                        {item?.orderAmount?.toFixed(3)
                          ? item?.orderAmount?.toFixed(3)
                          : item?.orderAmount}
                      </Text>
                      <Text
                        style={[
                          styles.customerAmount,
                          globalStyles.fontSizeSmall,
                          {color: '#00B44A', textAlign: 'right'},
                        ]}>
                        {/* Assign By Iftakhar Alam */}
                        {item?.deliveryAmount?.toFixed(3)
                          ? item?.deliveryAmount?.toFixed(3)
                          : item?.deliveryAmount}
                      </Text>
                      <Row>
                        <Col width="50%">
                          <Text style={{textAlign: 'right'}}>
                            {item?.deliveryQuantity}
                          </Text>
                        </Col>
                        <Col width="50%">
                          <Text style={{textAlign: 'right'}}>
                            {item?.orderQuantity}
                          </Text>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
        {/* )}
        </Formik> */}
      </ScrollView>
      {formikprops?.values?.territory &&
      formikprops?.values?.route &&
      formikprops?.values?.beat ? (
        <FabButton
          onPress={() =>
            navigation.navigate('Create Secondary Order', {
              ...formikprops?.values,
              distributorName: {
                value: distributorAndChannel?.distributorId,
                label: distributorAndChannel?.distributorName,
              },
              distributorChannel: {
                value: distributorAndChannel?.distributionChannelId,
                label: distributorAndChannel?.distributionChannelName,
              },
            })
          }
        />
      ) : null}
    </>
  );
}

export default LandingSecondary;
const styles = StyleSheet.create({
  customerAmount: {
    fontWeight: 'bold',
  },
  infos: {
    fontWeight: 'bold',
    paddingVertical: 3,
    // backgroundColor: '#fff',
    borderRadius: 7,
  },

  cardStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teritoryText: {
    color: '#000000',
    paddingRight: 10,
    paddingVertical: 5,
    opacity: 0.75,
  },
  completeButton: {
    backgroundColor: '#D1FFDF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 5,
    borderRadius: 5,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#D2D2D2',
  },
  fabStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    top: '80%',

    right: 17,
    height: 60,
    backgroundColor: '#3A405A',
    borderRadius: 100,
  },
  createButton: {
    marginRight: 50,
    marginVertical: 5,
    paddingHorizontal: 2,
    paddingVertical: 2,
    backgroundColor: '#00cdac',
    borderRadius: 5,
    alignItems: 'center',
    width: 50,
  },
});

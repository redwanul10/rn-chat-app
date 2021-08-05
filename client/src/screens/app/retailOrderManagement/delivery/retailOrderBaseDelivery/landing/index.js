import React, {useState, useEffect, useContext} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CommonTopBar from '../../../../../../common/components/CommonTopBar';
import ICustomPicker from '../../../../../../common/components/ICustomPicker';
import IDatePicker from '../../../../../../common/components/IDatePicker';
import {useFormik} from 'formik';
import {GlobalState} from '../../../../../../GlobalStateProvider';
import {Radio} from 'native-base';

import {getRetailOrderDeliveryLandingData} from '../../helper';

import {
  getTerritoryDDL,
  getDistributorDDL,
  getRouteDDLByTerritoryId,
} from '../../../../../../common/actions/helper';
import CustomButton from '../../../../../../common/components/CustomButton';
import Demo from './demo';
import Row from '../../../../../../common/components/Row';
import Col from '../../../../../../common/components/Col';
import {_todayDate} from '../../../../../../common/functions/_todayDate';
import * as Yup from 'yup';
import {routeSelectByDefault} from '../../../../../../common/functions/routeSelectedByDefault';
import IRadioButton from '../../../../../../common/components/IRadioButton';

const validationSchema = Yup.object().shape({
  territory: Yup.object().shape({
    label: Yup.string().required('Territory Name is required'),
    value: Yup.string().required('Territory Name is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('Route Name is required'),
    value: Yup.string().required('Route Name is required'),
  }),
  distributor: Yup.object().shape({
    label: Yup.string().required('Distributor Name is required'),
    value: Yup.string().required('Distributor Name is required'),
  }),
});

const initValues = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  territory: '',
  distributor: '',
  route: '',
  status: 3,
};

function RetailOrderDeliveryLanding({navigation}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [distributorDDL, setDistributorDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [landingData, setLandingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [radioStatus, useRadioStatus] = useState();
  const [radioButtonStatus, setRadioButtonStatus] = useState(false);

  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setTerritoryDDL,
    );
  }, [profileData, selectedBusinessUnit]);

  const viewHandler = (values) => {
    useRadioStatus(values?.status);

    getRetailOrderDeliveryLandingData(
      values?.status,
      values?.distributor?.value,
      values?.route?.value,
      values?.fromDate,
      values?.toDate,
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
    });
  }, [routeDDL]);

  return (
    <>
      <ScrollView
        contentContainerStyle={{backgroundColor: 'transparent' || '#F4F6FC'}}>
        {/* <View style={{backgroundColor: '#F4F6FC', marginBottom: 10}}> */}
        <CommonTopBar />

        <>
          <View style={{marginHorizontal: 10, marginTop: 10}}>
            <Row colGap={5}>
              <Col width="50%">
                <IDatePicker
                  label="From"
                  name="fromDate"
                  formikProps={formikprops}
                />
              </Col>

              <Col width="50%">
                <IDatePicker
                  label="To"
                  name="toDate"
                  formikProps={formikprops}
                />
              </Col>

              <Col width="50%">
                <ICustomPicker
                  label="Territory Name"
                  name="territory"
                  options={territoryDDL}
                  onChange={(item) => {
                    formikprops.setFieldValue('territory', item);
                    formikprops.setFieldValue('route', '');

                    getDistributorDDL(
                      profileData?.accountId,
                      selectedBusinessUnit?.value,
                      item?.value,
                      setDistributorDDL,
                    );
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
                  label="Distributor Name"
                  name="distributor"
                  options={distributorDDL}
                  formikProps={formikprops}
                />
              </Col>

              <Col width="100%">
                <ICustomPicker
                  label="Route Name"
                  name="route"
                  options={routeDDL}
                  formikProps={formikprops}
                />
              </Col>
            </Row>

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Text style={{marginHorizontal: 10}}>Pending Delivery</Text>
              <IRadioButton
                onPress={() => formikprops.setFieldValue('status', 3)}
                selected={formikprops?.values?.status === 3 ? true : false}
              />
              {/* 
              <Radio
                color="#000000"
                onPress={() => formikprops.setFieldValue('status', 3)}
                // pending delivery radio
                selected={formikprops?.values?.status === 3}
              /> */}
              <Text style={{marginHorizontal: 10}}>Delivery</Text>
              <IRadioButton
                onPress={() => formikprops.setFieldValue('status', 1)}
                selected={formikprops?.values?.status === 1 ? true : false}
              />
              {/* <Radio
                color="#000000"
                onPress={() => formikprops.setFieldValue('status', 1)}
                // delivery radio
                selected={formikprops?.values?.status === 1}
              /> */}
            </View>

            <CustomButton
              onPress={formikprops.handleSubmit}
              isLoading={loading}
              btnTxt="View"
            />
          </View>

          <Demo />

          {landingData?.data?.map((item, index) => (
            <TouchableOpacity
              key={index}
              disabled={formikprops?.values?.status !== 1}
              onPress={() => {
                if (item?.orderStatus === true) {
                  navigation.navigate('Retail Order Base Delivery View', {
                    id: item?.deliveryId,
                    orderNo: item?.orderId,
                  });
                }
              }}
              style={{
                marginVertical: 10,
                padding: 10,
                marginHorizontal: 10,
                borderRadius: 5,
                backgroundColor: '#ffffff',
              }}>
              <View
                style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
                <Text style={{fontWeight: 'bold'}}>{item?.deliveryCode}</Text>
                <View style={{flexDirection: 'row'}}>
                  {/* Assign By Iftakhar Alam*/}
                  <Text style={{fontWeight: 'bold', fontSize: 12}}>
                    {item?.totalOrderAmount?.toFixed(3)
                      ? item?.totalOrderAmount?.toFixed(3)
                      : item?.totalOrderAmount}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 12,
                      marginLeft: 5,
                    }}>
                    {item?.totalDeliveryAmount.toFixed(3)
                      ? item?.totalDeliveryAmount.toFixed(3)
                      : item?.totalDeliveryAmount}
                  </Text>
                </View>
              </View>
              <View
                style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
                <Text style={styles.customerAmount}>
                  {item?.outletName} {item?.cooler && '(Cooler)'}
                </Text>
                {/* Assign By Iftakhar Alam*/}
                <Text style={[styles.customerAmount, {color: '#00B44A'}]}>
                  {item?.receiveAmount?.toFixed(3)
                    ? item?.receiveAmount?.toFixed(3)
                    : item?.receiveAmount}
                </Text>
              </View>
              <View>
                <Row
                  style={{
                    marginBottom: 5,
                  }}>
                  <Col width="50%">
                    <Text style={styles.teritoryText}>
                      {item?.outletAddress}
                    </Text>
                  </Col>

                  <Col width="50%">
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text style={[styles.teritoryText]}>
                        {item?.dueAmount?.toFixed(3)
                          ? item?.dueAmount.toFixed(3)
                          : item?.dueAmount}
                      </Text>
                      <Text style={styles.teritoryText}>
                        {item?.totalOrderQty}
                      </Text>
                    </View>
                  </Col>
                </Row>

                <Row>
                  {radioStatus === 1 ? (
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(
                            'Retail Order Base Delivery Create',
                            {
                              id: item?.deliveryId,
                              orderNo: item?.orderId,
                            },
                          )
                        }
                        style={styles.createButton}>
                        <Text style={{color: '#ffffff'}}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(
                            'Create Retail Order Base Delivery',
                            {
                              id: item?.orderId,
                            },
                          )
                        }
                        style={[styles.createButton]}>
                        <Text style={{color: '#ffffff'}}>Create</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Row>
              </View>
            </TouchableOpacity>
          ))}
        </>
        {/* </View> */}
      </ScrollView>
    </>
  );
}

export default RetailOrderDeliveryLanding;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F6FC',
    flex: 1,
  },
  createButton: {
    marginRight: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#00cdac',
    borderRadius: 7,
    alignItems: 'center',
  },
  box: {
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#ffffff',

    elevation: 5,
    // padding: 9,
    // paddingLeft: 12,
  },
  label: {
    fontSize: 14,
    // fontFamily: 'Rubik-Regular',
    color: '#636363',
  },
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
    paddingVertical: 5,
    opacity: 0.75,
    width: 150,
  },
  completeButton: {
    marginLeft: 10,
    backgroundColor: '#D1FFDF',
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    bottom: 55,
    right: 17,
    height: 60,
    backgroundColor: '#3A405A',
    borderRadius: 100,
  },
  dateStyle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 7,
    height: 40,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

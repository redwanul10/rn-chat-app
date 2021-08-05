import React, {useState, useEffect, useContext} from 'react';
import {
  ScrollView,
  View,
  // Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import CommonTopBar from '../../../../../common/components/CommonTopBar';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import IDatePicker from '../../../../../common/components/IDatePicker';
import {useFormik} from 'formik';
import CustomButton from '../../../../../common/components/CustomButton';
import {GlobalState} from '../../../../../GlobalStateProvider';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';
import {getRetailOrderDirectDeliveryLandingData} from '../helper';

import {
  getRouteDDLByTerritoryId,
  getTerritoryDDL,
  getDistributorDDL,
} from '../../../../../common/actions/helper';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import FabButton from '../../../../../common/components/FabButton';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import {Radio} from 'native-base';
import * as Yup from 'yup';
import Text from '../../../../../common/components/IText';
import {routeSelectByDefault} from '../../../../../common/functions/routeSelectedByDefault';
import IRadioButton from '../../../../../common/components/IRadioButton';

const validationSchema = Yup.object().shape({
  territory: Yup.object().shape({
    label: Yup.string().required('Territory Name Name is required'),
    value: Yup.string().required('Territory Name Name is required'),
  }),
  distributor: Yup.object().shape({
    label: Yup.string().required('Distributor Name is required'),
    value: Yup.string().required('Distributor Name is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('Route is required'),
    value: Yup.string().required('Route is required'),
  }),
});

let initValues = {
  territory: '',
  distributor: '',
  route: '',
  fromDate: _todayDate(),
  toDate: _todayDate(),
  status: 1,
};

function RetailOrderDirectDelivery({navigation}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [distributorDDL, setDistributorDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [landingData, setLandingData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setTerritoryDDL,
    );
  }, [profileData, selectedBusinessUnit]);

  const viewHandler = (values) => {
    // setFormValues(values);
    getRetailOrderDirectDeliveryLandingData(
      values?.fromDate,
      values?.toDate,
      values?.distributor?.value,
      values?.route?.value,
      values?.status,
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
      <ScrollView>
        <CommonTopBar title="Outlet Direct Delivery" />

        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <Row colGap={5}>
            <Col width="50%">
              <ICustomPicker
                label="Territory Name"
                name="territory"
                options={territoryDDL}
                onChange={(item) => {
                  formikprops.setFieldValue('territory', item);
                  formikprops?.setFieldValue('route', '');

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
                label="Route"
                name="route"
                options={routeDDL}
                formikProps={formikprops}
              />
            </Col>

            <Col width="50%">
              <ICustomPicker
                label="Distributor"
                name="distributor"
                options={distributorDDL}
                formikProps={formikprops}
              />
            </Col>
            <Col width="50%">
              <IDatePicker
                label="From Date"
                name="fromDate"
                formikProps={formikprops}
              />
            </Col>
            <Col width="50%">
              <IDatePicker
                label="To Date"
                name="toDate"
                formikProps={formikprops}
              />
            </Col>
            <Col width="100%">
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text style={{marginHorizontal: 10}}>All</Text>
                <IRadioButton
                  onPress={() => formikprops.setFieldValue('status', 1)}
                  selected={formikprops?.values?.status === 1 ? true : false}
                />

                {/* <Radio
                  color="#000000"
                  onPress={() => formikprops.setFieldValue('status', 1)}
                  // pending delivery radio
                  selected={formikprops?.values?.status === 1}
                /> */}

                <Text style={{marginHorizontal: 10}}>Complete</Text>
                <IRadioButton
                  onPress={() => formikprops.setFieldValue('status', 2)}
                  selected={formikprops?.values?.status === 2 ? true : false}
                />
                {/* <Radio
                  color="#000000"
                  onPress={() => formikprops.setFieldValue('status', 2)}
                  // delivery radio
                  selected={formikprops?.values?.status === 2}
                /> */}

                <Text style={{marginHorizontal: 10}}>Due</Text>
                <IRadioButton
                  onPress={() => formikprops.setFieldValue('status', 3)}
                  selected={formikprops?.values?.status === 3 ? true : false}
                />
                {/* <Radio
                  color="#000000"
                  onPress={() => formikprops.setFieldValue('status', 3)}
                  // delivery radio
                  selected={formikprops?.values?.status === 3}
                /> */}
              </View>
            </Col>
          </Row>

          <CustomButton
            onPress={formikprops.handleSubmit}
            isLoading={loading}
            btnTxt="View"
          />

          <View
            style={{
              marginVertical: 10,
              padding: 10,
              // marginHorizontal: 10,
              borderRadius: 5,
              backgroundColor: '#ffffff',
            }}>
            <View style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
              <Text style={{fontWeight: 'bold'}}>SL</Text>
            </View>
            <View style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
              <Text style={styles.customerAmount}>Delivery Date</Text>
              <Text style={[styles.customerAmount, {color: '#00B44A'}]}>
                Receive Amount
              </Text>
            </View>
            <View
              style={[
                styles.cardStyle,
                {marginBottom: 5, justifyContent: 'space-between'},
              ]}>
              <Text style={styles.teritoryText}>Total Delivery Amount</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.teritoryText, {paddingRight: 10}]}>
                  Due
                </Text>
                <Text style={styles.teritoryText}>Qty</Text>
              </View>
            </View>
          </View>
          {landingData?.data?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate(
                  'Retail Order Direct Delivery View' ||
                    'Create Retail Order Direct Delivery',
                  {
                    id: item?.deliveryId,
                    ...formikprops?.values,
                  },
                )
              }
              style={{
                marginVertical: 10,
                padding: 10,
                // marginHorizontal: 10,
                borderRadius: 5,
                backgroundColor: '#ffffff',
              }}>
              <View
                style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
                <Text style={{fontWeight: 'bold'}}>{item?.sl}</Text>
              </View>
              <View
                style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
                <Text style={styles.customerAmount}>
                  {_dateFormatter(item?.deliveryDate)}
                </Text>
                <Text style={[styles.customerAmount, {color: '#00B44A'}]}>
                  {/* Assign By Iftakhar Alam*/}
                  {item?.receiveAmount?.toFixed(3)
                    ? item?.receiveAmount?.toFixed(3)
                    : item?.receiveAmount}
                </Text>
              </View>
              <View
                style={[
                  styles.cardStyle,
                  {marginBottom: 5, justifyContent: 'space-between'},
                ]}>
                <Text style={styles.teritoryText}>
                  {/* Assign By Iftakhar Alam*/}
                  {item?.totalDeliveryAmount?.toFixed(3)
                    ? item?.totalDeliveryAmount?.toFixed(3)
                    : item?.totalDeliveryAmount}
                </Text>

                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.teritoryText, {paddingRight: 10}]}>
                    {item?.dueAmount}
                  </Text>
                  <Text style={styles.teritoryText}>{item?.qty}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {formikprops?.values?.territory &&
      formikprops?.values?.distributor &&
      formikprops?.values?.route ? (
        <FabButton
          onPress={() =>
            navigation.navigate('Create Retail Order Direct Delivery', {
              ...formikprops?.values,
            })
          }
        />
      ) : null}
    </>
  );
}

export default RetailOrderDirectDelivery;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F6FC',
    flex: 1,
  },
  createButton: {
    marginRight: 50,
    padding: 6,
    backgroundColor: '#6c757d',
    borderRadius: 7,
    alignItems: 'center',
    width: 70,
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
    fontSize: 15,
  },

  cardStyle: {
    flexDirection: 'row',
  },
  teritoryText: {
    color: '#000000',
    // paddingRight: 10,
    paddingVertical: 5,
    opacity: 0.75,
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

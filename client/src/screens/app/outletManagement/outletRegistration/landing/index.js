/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import IconThree from 'react-native-vector-icons/Entypo';
import CommonTopBar from '../../../../../common/components/CommonTopBar';

import {getOutletLandingData, getRouteDDL} from './helper';
import {GlobalState} from '../../../../../GlobalStateProvider';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import CustomButton from '../../../../../common/components/CustomButton';
import {useFormik} from 'formik';
import {getTerritoryDDL} from '../../../../../common/actions/helper';
import * as Yup from 'yup';
import Col from '../../../../../common/components/Col';
import Row from '../../../../../common/components/Row';
import {Radio} from 'native-base';
import {routeSelectByDefault} from '../../../../../common/functions/routeSelectedByDefault';
import IRadioButton from '../../../../../common/components/IRadioButton';

const validationSchema = Yup.object().shape({
  territory: Yup.object().shape({
    label: Yup.string().required('Territory Name is required'),
    value: Yup.string().required('Territory Name is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('Route is required'),
    value: Yup.string().required('Route is required'),
  }),
  approve: Yup.object().shape({
    label: Yup.string().required('Approval Status is required'),
    value: Yup.string().required('Approval Status is required'),
  }),
});

const title = 'Outlet Registration';
const initValues = {
  route: '',
  beat: '',
  territory: '',
  approve: '',
  check: 1,
};
const statusDDL = [
  {value: 1, label: 'Approve', isStatus: true},
  {value: 2, label: 'Unapprove', isStatus: false},
];

function OutLetRegLanding({navigation}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [loading, setLoading] = useState(false);
  const [landingData, setLandingData] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [territoryDDL, setTerritoryDDL] = useState([]);

  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setTerritoryDDL,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const viewHandler = (values) => {
    getOutletLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.route?.value,
      0,
      values?.approve?.isStatus,
      values?.check,
      setLoading,
      setLandingData,
    );
  };

  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: {...initValues, approve: statusDDL[0]},
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
        <CommonTopBar title={title} />
        <>
          <View style={{marginHorizontal: 10, marginTop: 20}}>
            <Row colGap={10}>
              <Col width={'50%'}>
                <ICustomPicker
                  label="Select Territory"
                  name="territory"
                  options={territoryDDL}
                  onChange={(item) => {
                    formikprops.setFieldValue('territory', item);
                    formikprops?.setFieldValue('route', '');
                    getRouteDDL(
                      profileData?.accountId,
                      selectedBusinessUnit?.value,
                      item?.value,
                      setRouteDDL,
                    );
                  }}
                  formikProps={formikprops}
                />
              </Col>
              <Col width={'50%'}>
                <ICustomPicker
                  label="Select Route"
                  name="route"
                  options={routeDDL}
                  onChange={(item) => {
                    formikprops.setFieldValue('route', item);
                  }}
                  formikProps={formikprops}
                />
              </Col>
              <Col width={'50%'}>
                <ICustomPicker
                  label="Select Approval Status"
                  name="approve"
                  options={statusDDL}
                  onChange={(valueOption) => {
                    formikprops.setFieldValue('approve', valueOption);
                    setLandingData([]);
                  }}
                  formikProps={formikprops}
                />
              </Col>
              <Col width="50%">
                <Row colGap={2}>
                  <Col>
                    <Text style={{fontWeight: 'bold'}}>Cooler</Text>
                    <IRadioButton
                      style={{alignSelf: 'center'}}
                      onPress={() => {
                        formikprops.setFieldValue('check', 3);
                        setLandingData([]);
                      }}
                      selected={formikprops?.values?.check === 3 ? true : false}
                    />
                    {/* <Radio
                      style={{alignSelf: 'center'}}
                      color="#000000"
                      onPress={() => {
                        formikprops.setFieldValue('check', 3);
                        setLandingData([]);
                      }}
                      // Cooler radio
                      selected={formikprops?.values?.check === 3}
                    /> */}
                  </Col>
                  <Col>
                    <Text style={{fontWeight: 'bold'}}>Non Cooler</Text>
                    <IRadioButton
                      style={{alignSelf: 'center'}}
                      onPress={() => {
                        formikprops.setFieldValue('check', 2);
                        setLandingData([]);
                      }}
                      selected={formikprops?.values?.check === 2 ? true : false}
                    />
                    {/* <Radio
                      style={{alignSelf: 'center'}}
                      color="#000000"
                      onPress={() => {
                        formikprops.setFieldValue('check', 2);
                        setLandingData([]);
                      }}
                      // Non cooler radio
                      selected={formikprops?.values?.check === 2}
                    /> */}
                  </Col>
                  <Col>
                    <Text style={{marginLeft: 2, fontWeight: 'bold'}}>All</Text>
                    <IRadioButton
                      style={{alignSelf: 'center'}}
                      onPress={() => {
                        formikprops.setFieldValue('check', 1);
                        setLandingData([]);
                      }}
                      selected={formikprops?.values?.check === 1 ? true : false}
                    />
                    {/* 
                    <Radio
                      style={{alignSelf: 'center'}}
                      color="#000000"
                      onPress={() => {
                        formikprops.setFieldValue('check', 1);
                        setLandingData([]);
                      }}
                      // All radio
                      selected={formikprops?.values?.check === 1}
                    /> */}
                  </Col>
                </Row>
              </Col>
            </Row>

            <CustomButton
              onPress={formikprops.handleSubmit}
              isLoading={loading}
              btnTxt="View"
            />
          </View>
          {landingData?.data?.length > 0 && (
            <>
              <Row
                style={{
                  padding: 10,
                  marginVertical: 5,
                  marginHorizontal: 10,
                  marginBottom: 0,
                  borderRadius: 5,
                  backgroundColor: '#ffffff',
                }}>
                <Text style={{fontSize: 12, fontWeight: 'bold'}}>
                  Total Outlet: {landingData?.data?.length}
                </Text>
              </Row>
              <Row
                style={{
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  marginVertical: 10,
                  marginHorizontal: 10,
                  borderRadius: 5,
                  backgroundColor: '#ffffff',
                }}
                colGap={5}>
                <Col style={{alignItems: 'flex-start'}} width="50%">
                  <Text style={[styles.customerAmount]}>Outlet Name</Text>
                  <Text style={[styles.teritoryText, {fontWeight: 'bold'}]}>
                    Outlet Type
                  </Text>
                  <Text style={styles.teritoryText}>Outlet Address</Text>
                </Col>
                <Col style={{alignItems: 'flex-end'}} width="50%">
                  <Text
                    style={[
                      styles.customerAmount,
                      {color: 'green', textAlign: 'right'},
                    ]}>
                    Owner Name
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'black',
                    }}>
                    Mobile Number
                  </Text>
                  {formikprops.values.approve?.isStatus && (
                    <View>
                      <Text
                        style={[
                          styles.editButton,
                          {marginTop: 5, textAlign: 'center'},
                        ]}>
                        Action
                      </Text>
                    </View>
                  )}
                </Col>
              </Row>
            </>
          )}

          {landingData?.data?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate('View Outlet Profile', {
                  id: item?.outletId,
                })
              }>
              <Row
                style={{
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  marginBottom: 10,
                  marginHorizontal: 10,
                  borderRadius: 5,
                  backgroundColor: '#ffffff',
                }}
                colGap={5}>
                <Col style={{alignItems: 'flex-start'}} width="50%">
                  <Text style={[styles.customerAmount]}>
                    {item?.outletName}
                  </Text>
                  <Text style={[styles.teritoryText, {fontWeight: 'bold'}]}>
                    {item?.outletTypeName}
                  </Text>
                  <Text style={styles.teritoryText}>{item?.outletAddress}</Text>
                </Col>
                <Col style={{alignItems: 'flex-end'}} width="50%">
                  <Text
                    style={[
                      styles.customerAmount,
                      {color: 'green', textAlign: 'right'},
                    ]}>
                    {item?.ownerName}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'black',
                    }}>
                    {item?.mobileNumber}
                  </Text>

                  {formikprops.values.approve?.isStatus && (
                    <View>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Edit Outlet Profile', {
                            id: item?.outletId,
                          })
                        }>
                        <Text
                          style={[
                            styles.editButton,
                            {marginTop: 5, textAlign: 'center'},
                          ]}>
                          Edit
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Col>
              </Row>
            </TouchableOpacity>
          ))}
        </>
      </ScrollView>
      {/* Was used before && formikprops?.values?.beat */}
      {formikprops?.values?.route ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Outlet Add Edit', {
              routeName: formikprops?.values?.route,
              beatName: formikprops?.values?.beat,
            })
          }
          style={styles.fabStyle}>
          <IconThree name="plus" size={40} color="#ffffff" />
        </TouchableOpacity>
      ) : null}
    </>
  );
}

export default OutLetRegLanding;

const styles = StyleSheet.create({
  total: {color: '#919191'},
  cardColor: {color: '#57606F'},
  outLetName: {fontWeight: 'bold', fontSize: 16},
  edit: {
    height: 17,
    width: 17,
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#AEAEAE',
    marginVertical: 2,
  },
  infoSerial: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  fabStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: 55,
    right: 17,
    height: 60,
    backgroundColor: '#00cdac',
    borderRadius: 100,
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
    opacity: 0.75,
  },
  editButton: {
    color: 'white',
    backgroundColor: '#00cdac',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 2,
  },
});

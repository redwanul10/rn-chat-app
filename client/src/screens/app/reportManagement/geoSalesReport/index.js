/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import {Formik, useFormik} from 'formik';
import {GlobalState} from '../../../../GlobalStateProvider';
import ICustomPicker from '../../../../common/components/ICustomPicker';
import CustomButton from '../../../../common/components/CustomButton';
import Text from '../../../../common/components/IText';
import Map from './components/Map';

import {
  getTerritoryDDL,
  getRouteDDLByTerritoryId,
} from '../../../../common/actions/helper';

import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import {getEmployeesLocation, getOrderBaseReport} from './helper';
import IDatePicker from '../../../../common/components/IDatePicker';
import {_todayDate} from '../../../../common/functions/_todayDate';

import * as Yup from 'yup';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import SoMapHtml from './components/SoMapContent';
import mapHtml from './components/MapContent';
import {routeSelectByDefault} from '../../../../common/functions/routeSelectedByDefault';

const validationSchema = Yup.object().shape({
  territory: Yup.object().shape({
    label: Yup.string().required('Territory Name is required'),
    value: Yup.string().required('Territory Name is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('Route Name is required'),
    value: Yup.string().required('Route Name is required'),
  }),
});

const initValues = {
  territory: '',
  route: '',
  date: _todayDate(),
  type: '',
  mapType: 'outletMap',
};

function GeoSalesReport({navigation}) {
  const {
    profileData,
    selectedBusinessUnit,
    userRole,
    territoryInfo,
  } = useContext(GlobalState);
  const [territoryDDL, setTerritoryDDL] = useState([]);
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
    getOrderBaseReport(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.route?.value,
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
      viewHandler(values);
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
      <ScrollView contentContainerStyle={{flex: 1}}>
        <CommonTopBar title="Outlet Location Visit" />

        <View style={{paddingHorizontal: 10, marginTop: 10}}>
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
                  formikprops?.setFieldValue('route', '');
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
                wrapperStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: 5,
                }}
                formikProps={formikprops}
              />
            </Col>

            <Col width="50%">
              <IDatePicker
                label="Record Date"
                name="date"
                wrapperStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: 5,
                }}
                formikProps={formikprops}
              />
            </Col>

            {/* Track Team Membr BTN*/}
            {userRole === 'TSM' && (
              <Col width="50%">
                <CustomButton
                  style={{marginTop: 16}}
                  onPress={() => {
                    formikprops?.setFieldValue('mapType', 'teamMap');
                    getEmployeesLocation(
                      profileData?.accountId,
                      selectedBusinessUnit?.value,
                      profileData?.userId,
                      setLandingData,
                    );
                  }}
                  btnTxt="Team Memeber"
                />
              </Col>
            )}
          </Row>

          <CustomButton
            onPress={() => {
              formikprops?.setFieldValue('mapType', 'outletMap');
              formikprops.handleSubmit();
            }}
            isLoading={loading}
            btnTxt="View"
          />

          {/* Map Marker Color Defination */}

          <View style={styles.colorContainer}>
            <Row colGap={5}>
              <Col width="25%" style={styles.colStyle}>
                <View style={[styles.box, {backgroundColor: '#5DE17F'}]}></View>
                <Text>order</Text>
              </Col>

              <Col width="25%" style={styles.colStyle}>
                <View style={[styles.box, {backgroundColor: '#FFE92D'}]}></View>
                <Text>no-order</Text>
              </Col>

              <Col width="25%" style={styles.colStyle}>
                <View style={[styles.box, {backgroundColor: '#F462A8'}]}></View>
                <Text>no-visit</Text>
              </Col>

              <Col width="25%" style={styles.colStyle}>
                <View style={[styles.box, {backgroundColor: '#5992FC'}]}></View>
                <Text>over 25M</Text>
              </Col>
            </Row>
          </View>

          {/* {formikprops?.values?.mapType === 'teamMap' && (
                    <Map
                      locations={landingData}
                      location={{}}
                      lat={landingData[0]?.outletLat}
                      long={landingData[0]?.outletLong}
                      userName={''}
                      type="teamMap"
                      content={SoMapHtml}
                    />
                  )}

                  {formikprops?.values?.mapType === 'outletMap' && (
                    <Map
                      locations={landingData}
                      location={{}}
                      lat={landingData[0]?.outletLat}
                      long={landingData[0]?.outletLong}
                      userName={''}
                      type="outletMap"
                      content={mapHtml}
                    />
                  )} */}
          {/* <Map
                    locations={landingData}
                    location={{}}
                    lat={landingData[0]?.outletLat}
                    long={landingData[0]?.outletLong}
                    userName={''}
                    type={formikprops?.values?.mapType}
                  /> */}
        </View>

        <View style={{flex: 1, paddingBottom: 10}}>
          {/* Team Member Map */}
          {formikprops?.values?.mapType === 'teamMap' && (
            <Map
              locations={landingData}
              location={{}}
              lat={landingData[0]?.outletLat}
              long={landingData[0]?.outletLong}
              userName={''}
              type="teamMap"
              content={SoMapHtml}
            />
          )}

          {/* Outlet Map */}
          {formikprops?.values?.mapType === 'outletMap' && (
            <Map
              locations={landingData}
              location={{}}
              lat={landingData[0]?.outletLat}
              long={landingData[0]?.outletLong}
              userName={''}
              type="outletMap"
              content={mapHtml}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
}

export default GeoSalesReport;

const styles = StyleSheet.create({
  colStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {width: 15, height: 15, marginRight: 5},
  colorContainer: {
    backgroundColor: 'white',
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
  },
});

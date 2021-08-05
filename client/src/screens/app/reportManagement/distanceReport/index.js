/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import {GlobalState} from '../../../../GlobalStateProvider';
import CustomButton from '../../../../common/components/CustomButton';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import IDatePicker from '../../../../common/components/IDatePicker';
import {_todayDate} from '../../../../common/functions/_todayDate';
import {getLandingData} from './helper';
import NoDataFoundGrid from '../../../../common/components/NoDataFoundGrid';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import ICustomPicker from '../../../../common/components/ICustomPicker';
import {getTerritoryDDL, getRouteDDL} from '../../../../common/actions/helper';
import FormInput from '../../../../common/components/TextInput';
import {Radio} from 'native-base';
import * as Yup from 'yup';
import {globalStyles} from '../../../../common/globalStyle/globalStyles';
import {useFormik} from 'formik';
import {routeSelectByDefault} from '../../../../common/functions/routeSelectedByDefault';
import IRadioButton from '../../../../common/components/IRadioButton';

const initValues = {
  territory: '',
  route: '',
  transactionType: 1,
  distance: '',
  date: _todayDate(),
};

const validationSchema = Yup.object().shape({
  territory: Yup.object().shape({
    label: Yup.string().required('Territory Name is required'),
    value: Yup.string().required('Territory Name is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('Route Name is required'),
    value: Yup.string().required('Route Name is required'),
  }),
  distance: Yup.number().required('Distance is required'),
});

function DistanceReport({navigation}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [landingData, setLandingData] = useState();
  const [loading, setLoading] = useState(false);

  // DDL State
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: initValues,
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      viewHandler(values);
    },
  });

  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setTerritoryDDL,
    );
  }, [profileData, selectedBusinessUnit]);

  const viewHandler = (values) => {
    getLandingData(
      formikprops?.values?.route?.value,
      formikprops?.values?.distance,
      formikprops?.values?.transactionType,
      formikprops?.values?.date,
      setLandingData,
      setLoading,
    );
  };

  useEffect(() => {
    routeSelectByDefault(territoryInfo, routeDDL, (selectedRoute) => {
      formikprops?.setFieldValue('route', selectedRoute);
    });
  }, [routeDDL]);
  return (
    <>
      <ScrollView>
        <CommonTopBar title={'Distance Report'} />
        <>
          <View style={{paddingHorizontal: 10, marginTop: 10}}>
            <ScrollView>
              <Row colGap={5}>
                <Col width="50%">
                  <ICustomPicker
                    label="Territory Name"
                    name="territory"
                    options={territoryDDL}
                    onChange={(valueOption) => {
                      formikprops.setFieldValue('territory', valueOption);
                      formikprops.setFieldValue('route', '');
                      getRouteDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
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
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <FormInput
                    label="Distance (Meter)"
                    name="distance"
                    keyboardType="numeric"
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <IDatePicker
                    label="Date"
                    name="date"
                    onChange={(selectedDate) => {
                      formikprops.setFieldValue(
                        'date',
                        _dateFormatter(selectedDate),
                      );
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={{marginHorizontal: 10}}>Order Base</Text>
                    <IRadioButton
                      onPress={() => {
                        formikprops.setFieldValue('transactionType', 1);
                      }}
                      selected={
                        formikprops?.values?.transactionType === 1
                          ? true
                          : false
                      }
                    />
                    {/* <Radio
                      color="#000000"
                      onPress={() => {
                        formikprops.setFieldValue('transactionType', 1);
                      }}
                      selected={formikprops?.values?.transactionType === 1}
                    /> */}
                    <Text style={{marginHorizontal: 10}}>No Order Base</Text>
                    <IRadioButton
                      onPress={() => {
                        formikprops.setFieldValue('transactionType', 2);
                      }}
                      selected={
                        formikprops?.values?.transactionType === 2
                          ? true
                          : false
                      }
                    />
                    {/* <Radio
                      color="#000000"
                      onPress={() => {
                        formikprops.setFieldValue('transactionType', 2);
                      }}
                      selected={formikprops?.values?.transactionType === 2}
                    /> */}
                  </View>
                </Col>
                <Col width="100%" style={{marginTop: 10}}>
                  <CustomButton
                    onPress={formikprops.handleSubmit}
                    isLoading={loading}
                    btnTxt="View"
                  />
                </Col>
              </Row>

              <>
                {landingData?.length > 0 ? (
                  <>
                    <Row style={[styles.cardStyle]}>
                      <Col style={{width: '50%'}}>
                        <Text
                          style={[
                            {fontWeight: 'bold'},
                            globalStyles.fontSizeMicro,
                          ]}>
                          Total Outlet: {landingData?.length}
                        </Text>
                      </Col>
                    </Row>

                    <Row style={[styles.cardStyle]}>
                      <Col style={{width: '50%'}}>
                        <Text
                          style={[
                            styles.employeeName,
                            globalStyles.fontSizeMedium,
                          ]}>
                          Outlet Name
                        </Text>
                        <Text style={globalStyles.fontSizeMini}>
                          Outlet Address
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
                              color: 'green',
                              fontWeight: 'bold',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          Distance (Meter)
                        </Text>
                        <Text
                          style={[
                            {
                              color: 'black',
                              fontWeight: 'bold',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          Order Location Address
                        </Text>
                      </Col>
                    </Row>
                  </>
                ) : null}

                {/* Grid Data */}
                <View style={{paddingBottom: 10}}>
                  {landingData?.map((item, index) => (
                    <Row key={index} style={[styles.cardStyle]}>
                      <Col style={{width: '50%'}}>
                        <Text
                          style={[
                            styles.employeeName,
                            globalStyles.fontSizeMedium,
                          ]}>
                          {item?.outletName} {item?.isCooler && '(Cooler)'}
                        </Text>

                        <Text style={globalStyles.fontSizeMini}>
                          {item?.address}
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
                              color: 'green',
                              fontWeight: 'bold',
                              textAlign: 'right',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          {item?.distance}
                        </Text>
                        <Text
                          style={[
                            {
                              color: 'black',
                              fontWeight: 'bold',
                              textAlign: 'right',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          {item?.orderAddress}
                        </Text>
                      </Col>
                    </Row>
                  ))}
                </View>
              </>
            </ScrollView>
          </View>
          {landingData?.length === 0 && <NoDataFoundGrid />}
        </>
      </ScrollView>
    </>
  );
}

export default DistanceReport;

const styles = StyleSheet.create({
  cardStyle: {
    flexDirection: 'row',
    alignItems: 'center',
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

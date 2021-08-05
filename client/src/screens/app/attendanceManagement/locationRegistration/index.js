import React, {useEffect, useState, useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {Button, Spinner} from 'native-base';
import Map from './components/Map';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import FormInput from '../../../../common/components/TextInput';
import ICustomPicker from '../../../../common/components/ICustomPicker';
import {Formik} from 'formik';
import {GlobalState} from '../../../../GlobalStateProvider';
import {getCustomerDDL, registerLatLng} from './helper';
import {getTerritoryDDL} from '../../../../common/actions/helper';
import * as Yup from 'yup';
import {_todayDate} from '../../../../common/functions/_todayDate';
import getGeoLocation from '../../../../common/functions/getGeoLocation';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import Text from '../../../../common/components/IText';

const initValues = {
  teritory: '',
  customer: '',
  customerAddress: '',
  latitude: '',
  longitude: '',
};

const validationSchema = Yup.object().shape({
  teritory: Yup.object().shape({
    label: Yup.string().required('Territory Name is required'),
    value: Yup.string().required('Territory Name is required'),
  }),
  customer: Yup.object().shape({
    label: Yup.string().required('customer is required'),
    value: Yup.string().required('customer is required'),
  }),
});

const LocationRegistration = () => {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [location, setLocation] = useState({});
  const [initPageLoading, setInitPageLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  //   DDL State
  const [teritoryDDL, setTeritoryDDL] = useState([]);
  const [customerDDL, setCustomerDDL] = useState([]);

  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setTeritoryDDL,
    );
  }, []);

  useEffect(() => {
    getGeoLocation(setLocation, setIsLocationLoading);
  }, []);

  const saveHandler = (values) => {
    const payload = {
      langLatId: 0,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      customerId: values?.customer ? values?.customer?.value : 0,
      name: values?.customer?.label || '',
      address: values?.customerAddress,
      lang: +values?.longitude,
      lat: +values?.latitude,
      isActive: true,
      actionBy: profileData?.userId,
    };

    registerLatLng(payload, setIsLoading);
  };

  return (
    <>
      <CommonTopBar />
      <ScrollView 
      showsVerticalScrollIndicator={false} 
      style={style.container}
      bounces={false}
      >
        <View style={{marginVertical: 20}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={style.boldText}>Today</Text>
            <Text style={style.text}>{new Date().toDateString()}</Text>
          </View>
        </View>

        <Formik
          enableReinitialize={true}
          initialValues={initValues}
          initialValues={{
            latitude: location?.latitude?.toString() || '',
            longitude: location?.longitude?.toString() || '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            saveHandler(values, () => {
              actions.resetForm();
            });
          }}>
          {(formikprops) => (
            <View style={{paddingBottom: 20}}>
              <Row colGap={2}>
                <Col width="50%">
                  <ICustomPicker
                    label="Territory Name"
                    name="teritory"
                    options={teritoryDDL}
                    formikProps={formikprops}
                    // disabled={!location?.latitude}
                    onChange={(selectedOption) => {
                      formikprops.setFieldValue('teritory', selectedOption);
                      formikprops.setFieldValue('customer', '');
                      formikprops.setFieldValue('customerAddress', '');
                      getCustomerDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        selectedOption?.value,
                        setCustomerDDL,
                      );
                    }}
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    label="Customer Name"
                    name="customer"
                    options={customerDDL}
                    formikProps={formikprops}
                    onChange={(selectedOption) => {
                      formikprops.setFieldValue('customer', selectedOption);
                      formikprops.setFieldValue(
                        'customerAddress',
                        selectedOption?.address || '',
                      );
                    }}
                  />
                </Col>
                <Col width="100%">
                  <FormInput
                    name="customerAddress"
                    label="Customer Address"
                    placeholder="Enter Address"
                    inputStyle={style?.inputStyle}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <FormInput
                    name="latitude"
                    label="latitude"
                    placeholder="Enter latitude"
                    inputStyle={style?.inputStyle}
                    formikProps={formikprops}
                    disabled={true}
                  />
                </Col>
                <Col width="50%">
                  <FormInput
                    name="longitude"
                    label="longitude"
                    placeholder="Enter longitude"
                    inputStyle={style?.inputStyle}
                    formikProps={formikprops}
                    disabled={true}
                  />
                </Col>
              </Row>

              <View>
                {/* <Map /> */}
                {location?.latitude && (
                  <>
                    <Text style={style.boldText}>My Location</Text>
                    <Map
                      location={location}
                      lat={location.latitude}
                      long={location.longitude}
                      userName={''}
                    />
                  </>
                )}

                {isLocationLoading && (
                  <View style={style.spinnerText}>
                    <Text>Getting Your Loaction....</Text>
                    <Spinner color="black" style={style.mediumSpinner} />
                  </View>
                )}

                {location?.latitude && (
                  <Button
                    block
                    style={{backgroundColor: '#063197', borderRadius: 20}}
                    onPress={formikprops?.handleSubmit}>
                    <Text style={style.btnText}>Register</Text>
                    {isLoading && (
                      <Spinner color="white" style={style.spinner} />
                    )}
                  </Button>
                )}

                {/* Page Spinner */}
                {initPageLoading && <Spinner color="black" />}
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </>
  );
};

export default LocationRegistration;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  boldText: {
    marginBottom: 8,
  },
  smallTxt: {
    fontSize: 10,
  },
  text: {
    // fontFamily: fontsFamily.RUBIK_REGULAR,
    // color: "#59A3EE" || colors.GREY
  },
  col: {
    borderWidth: 2,
    marginHorizontal: 5,
    alignItems: 'center',
    paddingVertical: 5,
  },
  lattitude: {
    backgroundColor: '#E1F0FF',
    borderColor: '#0080FF',
  },
  longitude: {
    backgroundColor: '#FFF4DE',
    borderColor: '#FFA800',
  },
  fingerPrint: {
    width: 130,
    height: 130,
    alignSelf: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  greyColor: {
    color: '#989898',
  },
  btnText: {
    textTransform: 'uppercase',
    color: 'white',
  },
  spinner: {
    transform: [{scaleX: 0.6}, {scaleY: 0.6}],
  },
  time: {
    alignItems: 'flex-end',
    width: '100%',
    padding: 5,
    backgroundColor: '#FAFAFA',
    marginBottom: 5,
  },
  inputStyle: {
    borderWidth: 0,
    borderBottomWidth: 1,
    marginTop: 0,
    backgroundColor: 'transparent',
  },
  mediumSpinner: {
    marginTop: -10,
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
  },
  spinnerText: {justifyContent: 'center', alignItems: 'center'},
});

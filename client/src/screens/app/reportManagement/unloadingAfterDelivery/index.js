/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import {GlobalState} from '../../../../GlobalStateProvider';
import ICustomPicker from '../../../../common/components/ICustomPicker';
import CustomButton from '../../../../common/components/CustomButton';

import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import {getLandingData} from './helper';
import IDatePicker from '../../../../common/components/IDatePicker';
import {_todayDate} from '../../../../common/functions/_todayDate';
import NoDataFoundGrid from '../../../../common/components/NoDataFoundGrid';
import * as Yup from 'yup';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import {TouchableOpacity} from 'react-native';
import MiniButton from '../../../../common/components/MiniButton';
import {getDistributorAndDistributorChannelNameDDL} from './helper';
import {
  getRouteListDDLByVehicleId,
  getVehicleDDLByDistributorId,
  getTerritoryDDL,
  getDristributorChannel,
} from '../../../../common/actions/helper';
import {globalStyles} from '../../../../common/globalStyle/globalStyles';
import {useFormik} from 'formik';
import {routeSelectByDefault} from '../../../../common/functions/routeSelectedByDefault';
import { channelSelectedByDefault } from '../../../../common/functions/channelSelectedByDefault';
const validationSchema = Yup.object().shape({
  territory: Yup.object().shape({
    label: Yup.string().required('Territory Name is required'),
    value: Yup.string().required('Territory Name is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('Route is required'),
    value: Yup.string().required('Route is required'),
  }),
  vehicle: Yup.object().shape({
    label: Yup.string().required('Vehicle No is required'),
    value: Yup.string().required('Vehicle No is required'),
  }),
  distributor: Yup.object().shape({
    label: Yup.string().required('Distributor is required'),
    value: Yup.string().required('Distributor is required'),
  }),
  distributorChannel: Yup.object().shape({
    label: Yup.string().required('Distribution Channel is required'),
    value: Yup.string().required('Distribution Channel is required'),
  }),
});

const initValues = {
  date: _todayDate(),
  territory: '',
  distributor: '',
  vehicle: '',
  route: '',
  distributorChannel:'',
};

function UnloadingAfterDelivery({navigation}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [landingData, setLandingData] = useState();
  const [loading, setLoading] = useState(false);

  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [distributor, setDistributor] = useState();
  const [vehicleDDL, setVehicleDDL] = useState([]);
  const [distributorChannelDDL, setDistributorChannel] = useState([]);
  const [disableChannelDDL, setDisableChannelDDL] = useState(false);


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
      viewHandler(values);
    },
  });

  const viewHandler = (values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.route?.value,
      values?.vehicle?.value,
      values?.distributorChannel?.value,
      values?.date,
      setLandingData,
      setLoading,
    );
  };

  useEffect(() => {
    if (distributor?.value) {
      getVehicleDDLByDistributorId(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        distributor?.value,
        setVehicleDDL,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distributor]);

  useEffect(() => {
    routeSelectByDefault(territoryInfo, routeDDL, (selectedRoute) => {
      formikprops?.setFieldValue('route', selectedRoute);
    });
  }, [routeDDL]);

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

  return (
    <>
      <ScrollView>
        <CommonTopBar title={'Unloading After Delivery'} />

        <>
          <View style={{paddingHorizontal: 10, marginTop: 10}}>
            <ScrollView>
              <Row colGap={5}>
                <Col width="50%">
                  <ICustomPicker
                    label="Territory"
                    name="territory"
                    options={territoryDDL}
                    wrapperStyle={styles.wrapperStyle}
                    onChange={(valueOption) => {
                      formikprops.setFieldValue('territory', valueOption);
                      formikprops.setFieldValue('distributor', '');
                      formikprops.setFieldValue('route', '');

                      getDistributorAndDistributorChannelNameDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        formikprops.setFieldValue,
                        setDistributor,
                      );
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    label="Vehicle No"
                    name="vehicle"
                    options={vehicleDDL}
                    wrapperStyle={styles.wrapperStyle}
                    onChange={(valueOption) => {
                      formikprops.setFieldValue('vehicle', valueOption);
                      getRouteListDDLByVehicleId(
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
                    wrapperStyle={styles.wrapperStyle}
                    onChange={(valueOption) => {
                      formikprops.setFieldValue('route', valueOption);
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
                    label="Loaded Date"
                    name="date"
                    wrapperStyle={styles.wrapperStyle}
                    formikProps={formikprops}
                  />
                </Col>
              </Row>

              <CustomButton
                onPress={formikprops.handleSubmit}
                isLoading={loading}
                btnTxt="View"
              />
              <Row style={styles.headerCard}>
                <Col width="50%">
                  <Text
                    style={[styles.productName, globalStyles.fontSizeLarge]}>
                    Unloading Date
                  </Text>
                  <Text
                    style={[
                      styles.qtyStyle('green', 'left'),
                      globalStyles.fontSizeSmall,
                    ]}>
                    Quantity
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <MiniButton btnText="Action" />
                  </View>
                </Col>
                <Col width="50%">
                  <Text style={[styles.qtyStyle(), globalStyles.fontSizeSmall]}>
                    Collection
                  </Text>
                  <Text style={[styles.qtyStyle(), globalStyles.fontSizeSmall]}>
                    Receive
                  </Text>
                  <Text
                    style={[
                      styles.qtyStyle('gray'),
                      globalStyles.fontSizeSmall,
                    ]}>
                    Balance
                  </Text>
                </Col>
              </Row>

              {landingData?.data?.length > 0 && (
                <>
                  {/* Grid Data */}
                  <View style={{paddingTop: 10}}>
                    {landingData?.data?.map((item, index) => (
                      <>
                        <Row
                          key={index + 1}
                          style={styles.headerCard}
                          colGap={5}>
                          <Col width="50%">
                            <Text
                              style={[
                                styles.productName,
                                globalStyles.fontSizeLarge,
                              ]}>
                              {item?.dteUnloadingDate &&
                                _dateFormatter(item?.dteUnloadingDate)}
                            </Text>
                            <Text
                              style={[
                                styles.qtyStyle('green', 'left'),
                                globalStyles.fontSizeSmall,
                              ]}>
                              {item?.value}
                            </Text>
                            <MiniButton
                              onPress={() =>
                                navigation.navigate(
                                  'unloadingAfterDeliveryView',
                                  {
                                    id: item?.vehicleUnloadingHeaderId,
                                  },
                                )
                              }
                              btnText="View"
                            />
                          </Col>
                          <Col width="50%">
                            <Text
                              style={[
                                styles.qtyStyle(),
                                globalStyles.fontSizeSmall,
                              ]}>
                              {item?.collection}
                            </Text>
                            <Text
                              style={[
                                styles.qtyStyle(),
                                globalStyles.fontSizeSmall,
                              ]}>
                              {item?.received}
                            </Text>
                            <Text
                              style={[
                                styles.qtyStyle('gray'),
                                globalStyles.fontSizeSmall,
                              ]}>
                              {item?.balance}
                            </Text>
                          </Col>
                        </Row>
                      </>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
          {landingData?.length === 0 && <NoDataFoundGrid />}
        </>
      </ScrollView>
    </>
  );
}

export default UnloadingAfterDelivery;

const styles = StyleSheet.create({
  wrapperStyle: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 2.5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  productName: {
    fontWeight: 'bold',
    color: 'black',
  },

  qtyStyle: (color = 'green', align = 'right') => ({
    color: color,
    textAlign: align,
    fontWeight: 'bold',
  }),
});

/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import {useFormik} from 'formik';
import {GlobalState} from '../../../../GlobalStateProvider';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import IDatePicker from '../../../../common/components/IDatePicker';
import {_todayDate} from '../../../../common/functions/_todayDate';
import {getSummaryDeliveryLandingData} from './helper';
import NoDataFoundGrid from '../../../../common/components/NoDataFoundGrid';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import {globalStyles} from '../../../../common/globalStyle/globalStyles';
import FabButton from '../../../../common/components/FabButton';
import {TouchableOpacity} from 'react-native';
import ICustomPicker from '../../../../common/components/ICustomPicker';
import CustomButton from '../../../../common/components/CustomButton';
import * as Yup from 'yup';
import {tabBgPrimary} from '../../../../common/theme/color';
import {
  getDistributorDDL,
  getDristributorChannel,
  getTerritoryDDL,
} from '../../../../common/actions/helper';
import { channelSelectedByDefault } from '../../../../common/functions/channelSelectedByDefault';

const initValues = {
  territory: '',
  distributor: '',
  fromDate: _todayDate(),
  toDate: _todayDate(),
  distributorChannel:""
};

const validationSchema = Yup.object().shape({
  territory: Yup.object().required('Territory Name is required'),
  distributor: Yup.object().required('Distributor is required'),
  distributorChannel: Yup.object().required('Distribution Channel is required'),
});

function summaryDeliveryLanding({navigation}) {
  const {profileData, selectedBusinessUnit,territoryInfo} = useContext(GlobalState);
  const [landingData, setLandingData] = useState();
  const [loading, setLoading] = useState(false);
  const [territoryNameDDL, setTerritoryNameDDL] = useState([]);
  const [distributorDDL, setDistributorDDL] = useState([]);
  const [distributorChannelDDL, setDistributorChannel] = useState([]);
  const [disableChannelDDL, setDisableChannelDDL] = useState(false);


  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: initValues,
    onSubmit: (values, actions) => {
      viewHandler(values);
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

  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      null,
      setTerritoryNameDDL,
    );

    getDristributorChannel(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDistributorChannel,
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const viewHandler = (values) => {
    getSummaryDeliveryLandingData(
      values?.fromDate,
      values?.toDate,
      values?.distributor?.value,
      values?.distributorChannel?.value,
      setLoading,
      setLandingData,
    );
  };

  return (
    <>
      <ScrollView>
        <CommonTopBar title={'Summary Delivery'} />
        <>
          <View style={{paddingHorizontal: 10, marginTop: 10}}>
            <ScrollView>
              <Row colGap={5}>
                <Col width="50%">
                  <ICustomPicker
                    label="Territory Name"
                    name="territory"
                    options={territoryNameDDL}
                    onChange={(valueOption) => {
                      formikprops?.setFieldValue('territory', valueOption);
                      formikprops?.setFieldValue('distributor', '');
                      setLandingData();
                      getDistributorDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setDistributorDDL,
                      );
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    label="Distributor"
                    name="distributor"
                    options={distributorDDL}
                    onChange={(valueOption) => {
                      formikprops?.setFieldValue('distributor', valueOption);
                      setLandingData();
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
                  <CustomButton
                    onPress={formikprops.handleSubmit}
                    isLoading={loading}
                    btnTxt="View"
                  />
                </Col>
              </Row>

              <>
                {landingData?.data?.length > 0 ? (
                  <>
                    <Row style={[styles.cardStyle]}>
                      <Col style={{width: '50%'}}>
                        <Text
                          style={[
                            styles.employeeName,
                            globalStyles.fontSizeMedium,
                          ]}>
                          Delivery Date
                        </Text>
                        <Text
                          style={[
                            globalStyles.fontSizeMini,
                            {fontWeight: 'bold'},
                          ]}>
                          Quantity
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
                          Receive Amount
                        </Text>
                        <Text
                          style={[
                            {
                              color: 'tomato',
                              fontWeight: 'bold',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          Due Amount
                        </Text>
                        <Text
                          style={[
                            {
                              color: tabBgPrimary,
                              fontWeight: 'bold',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          Total Delivery Amount
                        </Text>
                      </Col>
                    </Row>
                  </>
                ) : null}

                {/* Grid Data */}
                <View style={{paddingBottom: 10}}>
                  {landingData?.data?.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('summaryDeliveryCreate', {
                          ...formikprops?.values,
                          type: 'View',
                          id: item?.delivaryId,
                        });
                      }}
                      key={index}>
                      <Row style={[styles.cardStyle]}>
                        <Col style={{width: '50%'}}>
                          <Text
                            style={[
                              styles.employeeName,
                              globalStyles.fontSizeMedium,
                            ]}>
                            {_dateFormatter(item?.delivaryDate)}
                          </Text>
                          <Text
                            style={[
                              globalStyles.fontSizeMini,
                              {fontWeight: 'bold'},
                            ]}>
                            {item?.qty}
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
                            {item?.receiveAmount?.toFixed(0)}
                          </Text>
                          <Text
                            style={[
                              {
                                color: 'tomato',
                                fontWeight: 'bold',
                              },
                              globalStyles.fontSizeMini,
                            ]}>
                            {item?.dueAmount?.toFixed(0)}
                          </Text>
                          <Text
                            style={[
                              {
                                color: tabBgPrimary,
                                fontWeight: 'bold',
                              },
                              globalStyles.fontSizeMini,
                            ]}>
                            {item?.totalDeliveryAmount?.toFixed(0)}
                          </Text>
                        </Col>
                      </Row>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            </ScrollView>
          </View>
          {landingData?.data?.length === 0 && <NoDataFoundGrid />}
        </>
      </ScrollView>
      {formikprops?.values?.distributor ? (
        <FabButton
          onPress={() =>
            navigation.navigate('summaryDeliveryCreate', {
              ...formikprops?.values,
              type: 'Create',
            })
          }
        />
      ) : null}
    </>
  );
}

export default summaryDeliveryLanding;

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

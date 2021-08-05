/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import CommonTopBar from '../../../../common/components/CommonTopBar';
import {Formik, useFormik} from 'formik';
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
import Text from '../../../../common/components/IText';
import {globalStyles} from '../../../../common/globalStyle/globalStyles';
import {getDristributorChannel} from '../../../../common/actions/helper';
import {channelSelectedByDefault} from '../../../../common/functions/channelSelectedByDefault';

const validationSchema = Yup.object().shape({
  type: Yup.object().shape({
    label: Yup.string().required('Type is required'),
    value: Yup.string().required('Type is required'),
  }),
  distributorChannel: Yup.object().shape({
    label: Yup.string().required('Distribution Channel is required'),
    value: Yup.string().required('Distribution Channel is required'),
  }),
});

const initValues = {
  distributorChannel:"",
  date: _todayDate(),
  type: '',
};

function OutletDeliveryReport({navigation}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [landingData, setLandingData] = useState();
  const [loading, setLoading] = useState(false);
  const [totalOrderInfo, setTotalOrderInfo] = useState({});
  const [distributorChannelDDL, setDistributorChannel] = useState([]);
  const [disableChannelDDL, setDisableChannelDDL] = useState(false);


  // Formik Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: {...initValues},
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      viewHandler(values);
    },
  });

  useEffect(() => {
    getDristributorChannel(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDistributorChannel,
    );
  }, [profileData, selectedBusinessUnit]);

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
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      values?.type?.value,
      values?.date,
      values?.distributorChannel?.value,
      setLandingData,
      setLoading,
      setTotalOrderInfo,
    );
  };

  return (
    <>
      <ScrollView>
        <CommonTopBar title={'Order Delivery Report'} />
        {/* <Formik
          enableReinitialize={true}
          initialValues={{...initValues}}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            viewHandler(values);
          }}>
          {(formikprops) => ( */}
        <>
          <View style={{paddingHorizontal: 10, marginTop: 10}}>
            <ScrollView>
              <Row colGap={5}>
                <Col width="50%">
                  <ICustomPicker
                    label="Type"
                    name="type"
                    options={[
                      {
                        value: 1,
                        label: 'Order',
                      },
                      {
                        value: 2,
                        label: 'Delivery',
                      },
                      {
                        value: 3,
                        label: 'Pending',
                      },
                    ]}
                    wrapperStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 5,
                    }}
                    onChange={(item) => {
                      formikprops?.setFieldValue('type', item);
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
                    label="Report Date"
                    name="date"
                    wrapperStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 5,
                    }}
                    formikProps={formikprops}
                  />
                </Col>
              </Row>

              <CustomButton
                style={{marginBottom: 10, marginTop: 5}}
                onPress={formikprops?.handleSubmit}
                isLoading={loading}
                btnTxt="View"
              />
              {landingData?.length > 0 && (
                <>
                  <Row
                    style={{
                      flexDirection: 'row',
                      padding: 10,
                      backgroundColor: '#ffffff',
                    }}>
                    <Col width="65%">
                      <View style={{paddingRight: 10}}>
                        <Text
                          style={[
                            styles.infos,
                            globalStyles.fontSizeMicro,
                            {fontWeight: 'bold'},
                          ]}>
                          {(formikprops?.values?.type?.value === 1 &&
                            'Order') ||
                            (formikprops?.values?.type?.value === 2 &&
                              'Delivery') ||
                            (formikprops?.values?.type?.value === 3 &&
                              'Pending')}{' '}
                          Qty: {totalOrderInfo?.totalPscQuantity || 0} pcs /{' '}
                          {totalOrderInfo?.totalCaseQuantity?.toFixed(2)
                            ? totalOrderInfo?.totalCaseQuantity?.toFixed(2)
                            : totalOrderInfo?.totalCaseQuantity || 0}{' '}
                          case
                        </Text>
                      </View>
                    </Col>
                    <Col width="35%">
                      <View style={{alignItems: 'flex-end'}}>
                        <Text
                          style={[
                            styles.infos,
                            globalStyles.fontSizeMicro,
                            {
                              fontWeight: 'bold',
                              color: 'green',
                            },
                          ]}>
                          Amount:{' '}
                          {totalOrderInfo?.totalAmount?.toFixed(0)
                            ? totalOrderInfo?.totalAmount?.toFixed(0)
                            : totalOrderInfo?.totalAmount || 0}
                        </Text>
                      </View>
                    </Col>
                  </Row>
                  <Col key={1} style={styles.headerCard}>
                    <Row>
                      <Col style={{width: '45%', justifyContent: 'center'}}>
                        <Text style={styles.productName}>Product</Text>
                      </Col>
                      <Col
                        style={{
                          width: '30%',
                          alignItems: 'flex-end',
                        }}>
                        {(formikprops?.values?.type?.value === 1 ||
                          formikprops?.values?.type?.value === 3) && (
                          <Text
                            style={[
                              styles.cardQtyStyle,
                              globalStyles.fontSizeMicro,
                              {color: 'black'},
                            ]}>
                            Order Qty/psc
                          </Text>
                        )}

                        {(formikprops?.values?.type?.value === 2 ||
                          formikprops?.values?.type?.value === 3) && (
                          <Text
                            style={[
                              styles.cardQtyStyle,
                              globalStyles.fontSizeMicro,
                            ]}>
                            Delivery Qty/psc
                          </Text>
                        )}

                        {formikprops?.values?.type?.value === 3 && (
                          <Text
                            style={[
                              styles.cardQtyStyle,
                              globalStyles.fontSizeMicro,
                              {color: 'tomato'},
                            ]}>
                            Pending Qty/psc
                          </Text>
                        )}
                      </Col>
                      <Col
                        style={{
                          width: '25%',
                          alignItems: 'flex-end',
                        }}>
                        {(formikprops?.values?.type?.value === 1 ||
                          formikprops?.values?.type?.value === 3) && (
                          <Text
                            style={[
                              styles.cardQtyStyle,
                              globalStyles.fontSizeMicro,
                              {color: 'black'},
                            ]}>
                            Qty/case
                          </Text>
                        )}

                        {(formikprops?.values?.type?.value === 2 ||
                          formikprops?.values?.type?.value === 3) && (
                          <Text
                            style={[
                              styles.cardQtyStyle,
                              globalStyles.fontSizeMicro,
                            ]}>
                            Qty/case
                          </Text>
                        )}

                        {formikprops?.values?.type?.value === 3 && (
                          <Text
                            style={[
                              styles.cardQtyStyle,
                              globalStyles.fontSizeMicro,
                              {color: 'tomato'},
                            ]}>
                            Qty/case
                          </Text>
                        )}
                      </Col>
                    </Row>
                  </Col>

                  {/* Grid Data */}
                  <View>
                    {landingData?.map((item, index) => (
                      <View key={index + 1} style={styles.headerCard}>
                        <Col style={{width: '45%'}}>
                          <Text style={styles.productName}>
                            {item?.itemCode}
                          </Text>
                        </Col>
                        <Col
                          style={{
                            width: '30%',
                            alignItems: 'flex-end',
                          }}>
                          {(formikprops?.values?.type?.value === 1 ||
                            formikprops?.values?.type?.value === 3) && (
                            <Text
                              style={[
                                styles.cardQtyStyle,
                                globalStyles.fontSizeMicro,
                                {color: 'black'},
                              ]}>
                              {item?.orderQuantity || 0}
                            </Text>
                          )}

                          {(formikprops?.values?.type?.value === 2 ||
                            formikprops?.values?.type?.value === 3) && (
                            <Text
                              style={
                                (styles.cardQtyStyle,
                                globalStyles.fontSizeMicro)
                              }>
                              {item?.deliveryQuantity || 0}
                            </Text>
                          )}

                          {formikprops?.values?.type?.value === 3 && (
                            <Text
                              style={[
                                styles.cardQtyStyle,
                                globalStyles.fontSizeMicro,
                                {color: 'tomato'},
                              ]}>
                              {item?.pendingQuantity || 0}
                            </Text>
                          )}
                        </Col>
                        <Col
                          style={{
                            width: '25%',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                          }}>
                          <View>
                            {(formikprops?.values?.type?.value === 1 ||
                              formikprops?.values?.type?.value === 3) && (
                              <Text
                                style={[
                                  styles.cardQtyStyle,
                                  globalStyles.fontSizeMicro,
                                  {textAlign: 'right', color: 'black'},
                                ]}>
                                {item?.orderCaseQuantity?.toFixed(3)
                                  ? item?.orderCaseQuantity?.toFixed(3)
                                  : item?.orderCaseQuantity || 0}
                              </Text>
                            )}

                            {(formikprops?.values?.type?.value === 2 ||
                              formikprops?.values?.type?.value === 3) && (
                              <Text
                                style={[
                                  styles.cardQtyStyle,
                                  globalStyles.fontSizeMicro,
                                  {textAlign: 'right'},
                                ]}>
                                {item?.deliveryCaseQuantity?.toFixed(3)
                                  ? item?.deliveryCaseQuantity?.toFixed(3)
                                  : item?.deliveryCaseQuantity || 0}
                              </Text>
                            )}

                            {formikprops?.values?.type?.value === 3 && (
                              <Text
                                style={[
                                  styles.cardQtyStyle,
                                  globalStyles.fontSizeMicro,
                                  {color: 'tomato', textAlign: 'right'},
                                ]}>
                                {item?.pendingCaseQuantity?.toFixed(3)
                                  ? item?.pendingCaseQuantity?.toFixed(3)
                                  : item?.pendingCaseQuantity || 0}
                              </Text>
                            )}
                          </View>
                        </Col>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
          {landingData?.length === 0 && <NoDataFoundGrid />}
        </>
        {/* )}
        </Formik> */}
      </ScrollView>
    </>
  );
}

export default OutletDeliveryReport;

const styles = StyleSheet.create({
  calendarStyle: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  cardQtyStyle: {color: 'green', fontWeight: 'bold'},
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

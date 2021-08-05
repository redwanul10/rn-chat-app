import React, {useState, useEffect, useContext} from 'react';
import * as Yup from 'yup';
import {
  ScrollView,
  View,
  // Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {useFormik} from 'formik';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import ICustomPicker from '../../../../common/components/ICustomPicker';
import CustomButton from '../../../../common/components/CustomButton';
import {GlobalState} from '../../../../GlobalStateProvider';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import FabButton from '../../../../common/components/FabButton';
import {_todayDate} from '../../../../common/functions/_todayDate';
import {
  getRouteDDLByTerritoryId,
  getBeatDDL,
} from '../../../../common/actions/helper';
import {
  getLandingData,
  getChannelDDL,
  getTerritoryDDL,
  getPiontDDL,
  getSectionDDL,
  getRouteDDL,
  getItemApiDDL,
  getLandingReqData,
} from './helper';
import NoDataFoundGrid from '../../../../common/components/NoDataFoundGrid';
import Text from '../../../../common/components/IText';
import {routeSelectByDefault} from '../../../../common/functions/routeSelectedByDefault';
import MiniButton from '../../../../common/components/MiniButton';
const validationSchema = Yup.object().shape({
  channel: Yup.object().shape({
    label: Yup.string().required('Channel Name is required'),
    value: Yup.string().required('Channel Name is required'),
  }),
  territory: Yup.object().shape({
    label: Yup.string().required('Territory Name is required'),
    value: Yup.string().required('Territory Name is required'),
  }),
  point: Yup.object().shape({
    label: Yup.string().required('Point Name is required'),
    value: Yup.string().required('Point Name is required'),
  }),
  section: Yup.object().shape({
    label: Yup.string().required('Section Name is required'),
    value: Yup.string().required('Section Name is required'),
  }),
  asset: Yup.object().shape({
    label: Yup.string().required('Asset Name is required'),
    value: Yup.string().required('Asset Name is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('Route is required'),
    value: Yup.string().required('Route is required'),
  }),
});

const initValues = {
  channel: '',
  territory: '',
  point: '',
  section: '',
  route: '',
  asset: '',
};

function AssetRequestFieldEmployee({navigation}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [loading, setLoading] = useState(false);
  const [landingData, setLandingData] = useState([]);

  // DDL State
  const [channelDDL, setChannelDDL] = useState([]);
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [pointDDL, setPointDDL] = useState([]);
  const [sectionDDL, setSectionDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [assetDDL, setAssetDDL] = useState([]);
  const [landingReqData, setLandingReqData] = useState([]);
  const requestDDL = [
    {value: 1, label: 'Maintenance', isStatus: true},
    {value: 2, label: 'Pull Out', isStatus: false},
    {value: 3, label: 'Transfer', isStatus: false},
  ];

  // Formiks Setup
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

  useEffect(() => {
    getChannelDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setChannelDDL,
    );
    getItemApiDDL(setAssetDDL);
  }, [profileData, selectedBusinessUnit]);

  const viewHandler = (values) => {
    setLandingReqData([]);
    getLandingData(
      values?.route?.value,
      values?.asset?.value,
      setLoading,
      setLandingData,
    );
  };

  // Last Added | By Default Route Selected | login info wise (territoryInfo?.todayRouteId)
  // useEffect(() => {
  //   routeSelectByDefault(territoryInfo, routeDDL, (selectedRoute) => {
  //     formikprops?.setFieldValue('route', selectedRoute);
  //   });
  // }, [routeDDL]);

  return (
    <>
      <ScrollView>
        <CommonTopBar />

        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <Row colGap={5}>
            <Col width="50%">
              <ICustomPicker
                label="Channel Name"
                name="channel"
                options={channelDDL}
                onChange={(item) => {
                  formikprops.setFieldValue('channel', item);
                  getTerritoryDDL(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    item?.value,
                    setTerritoryDDL,
                  );
                }}
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
                  getPiontDDL(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    formikprops?.values?.channel?.value,
                    item?.value,
                    setPointDDL,
                  );
                }}
                formikProps={formikprops}
              />
            </Col>
            <Col width="50%">
              <ICustomPicker
                label="Point Name"
                name="point"
                options={pointDDL}
                onChange={(item) => {
                  formikprops.setFieldValue('point', item);
                  getSectionDDL(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    formikprops?.values?.channel?.value,
                    item?.value,
                    setSectionDDL,
                  );
                }}
                formikProps={formikprops}
              />
            </Col>
            <Col width="50%">
              <ICustomPicker
                label="Section Name"
                name="section"
                options={sectionDDL}
                onChange={(item) => {
                  formikprops.setFieldValue('section', item);

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

            <Col width="50%">
              <ICustomPicker
                label="Route Name"
                name="route"
                options={routeDDL}
                formikProps={formikprops}
              />
            </Col>

            <Col width="50%">
              <ICustomPicker
                label="Asset Name"
                name="asset"
                options={[{label: 'All', value: 0}, ...assetDDL]}
                formikProps={formikprops}
              />
            </Col>
          </Row>

          <CustomButton
            onPress={formikprops.handleSubmit}
            isLoading={loading}
            btnTxt="View"
          />
          <Col width="100%">
            <ICustomPicker
              label="Request View"
              name="request"
              options={requestDDL}
              onChange={(item) => {
                formikprops.setFieldValue('request', item);
                setLandingData([]);
                getLandingReqData(
                  item?.value,
                  profileData?.accountId,
                  selectedBusinessUnit?.value,
                  setLandingReqData,
                );
              }}
              formikProps={formikprops}
            />
          </Col>

          {/* Header Part */}

          {landingData?.length > 0 ? (
            <>
              <Row
                style={{
                  marginVertical: 10,
                  padding: 10,
                  borderRadius: 5,
                  backgroundColor: '#ffffff',
                }}>
                <Col width="50%">
                  <Text style={styles.customerAmount}>Outlet Name</Text>
                  <Text style={[styles.address]}>Outlet Address</Text>
                </Col>
                <Col width="50%">
                  <Text style={styles.date}>Asset Name</Text>
                  <Text style={styles.date}>Quantity</Text>
                </Col>
                <View style={{marginRight: 3}}>
                  <MiniButton
                    style={{padding: 12}}
                    disabled={true}
                    btnText="Maintenance"
                  />
                </View>
                <View style={{marginRight: 3}}>
                  <MiniButton disabled={true} btnText="Pull out" />
                </View>
                <View style={{marginRight: 3}}>
                  <MiniButton disabled={true} btnText="Transfer" />
                </View>
              </Row>
              <View>
                {landingData?.map((item, index) => (
                  <Row
                    style={{
                      marginVertical: 10,
                      padding: 10,
                      borderRadius: 5,
                      backgroundColor: '#ffffff',
                    }}>
                    <Col width="50%">
                      <Text style={styles.customerAmount}>
                        {item?.outletName}
                      </Text>
                      <Text style={[styles.address]}>{item?.address}</Text>
                    </Col>
                    <Col width="50%">
                      <Text style={styles.date}>{item?.name}</Text>
                      <Text style={styles.date}>{item?.qty}</Text>
                    </Col>
                    <View style={{marginRight: 3}}>
                      <MiniButton
                        style={{padding: 12}}
                        onPress={() => {
                          navigation.navigate('Asset Request Maintenance', {
                            ...item,
                            ...formikprops?.values,
                            title: 'Maintenance Request',
                            btnTypeId: 1,
                          });
                        }}
                        btnText="Maintenance"
                      />
                    </View>
                    <View style={{marginRight: 3}}>
                      <MiniButton
                        onPress={() => {
                          navigation.navigate('Asset Request Maintenance', {
                            ...item,
                            ...formikprops?.values,
                            title: 'PullOut Request',
                            btnTypeId: 2,
                          });
                        }}
                        btnText="Pull out"
                      />
                    </View>
                    <View style={{marginRight: 3}}>
                      <MiniButton
                        onPress={() => {
                          navigation.navigate('Asset Request Maintenance', {
                            ...item,
                            ...formikprops?.values,
                            title: 'Transfer Request',
                            btnTypeId: 3,
                          });
                        }}
                        btnText="Transfer"
                      />
                    </View>
                  </Row>
                ))}
              </View>
            </>
          ) : null}
          {landingReqData?.length > 0 ? (
            <>
              <Row
                style={{
                  marginVertical: 10,
                  padding: 10,
                  borderRadius: 5,
                  backgroundColor: '#ffffff',
                }}>
                <Col width="50%">
                  <Text style={styles.customerAmount}>Outlet Name</Text>
                  <Text style={[styles.address]}>Outlet Address</Text>
                </Col>
                <Col width="50%">
                  <Text style={styles.date}>Asset Name</Text>
                  <Text style={styles.date}>Quantity</Text>
                </Col>
              </Row>
              <View>
                {landingReqData?.map((item, index) => (
                  <Row
                    style={{
                      marginVertical: 10,
                      padding: 10,
                      borderRadius: 5,
                      backgroundColor: '#ffffff',
                    }}>
                    <Col width="50%">
                      <Text style={styles.customerAmount}>
                        {item?.outletName}
                      </Text>
                      <Text style={[styles.address]}>{item?.address}</Text>
                    </Col>
                    <Col width="50%">
                      <Text style={styles.date}>{item?.assetName}</Text>
                      <Text style={styles.date}>{item?.quantity}</Text>
                    </Col>
                  </Row>
                ))}
              </View>
            </>
          ) : null}
        </View>
        {/* {landingData?.length === 0 ||
          (landingReqData?.length === 0 && <NoDataFoundGrid />)} */}
      </ScrollView>
    </>
  );
}

export default AssetRequestFieldEmployee;

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
    color: '#636363',
  },
  customerAmount: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  cardStyle: {
    flexDirection: 'row',
  },
  date: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
  },
  address: {color: '#00B44A', fontWeight: 'bold', fontSize: 12},
  editBtn: {
    backgroundColor: '#00cdac',
    color: 'white',
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
});

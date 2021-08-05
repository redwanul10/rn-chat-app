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
  getTerritoryDDL,
  getBeatDDL,
} from '../../../../common/actions/helper';
import {getLandingData} from './helper';
import NoDataFoundGrid from '../../../../common/components/NoDataFoundGrid';
import Text from '../../../../common/components/IText';
import {routeSelectByDefault} from '../../../../common/functions/routeSelectedByDefault';

const validationSchema = Yup.object().shape({
  territory: Yup.object().shape({
    label: Yup.string().required('Territory Name is required'),
    value: Yup.string().required('Territory Name is required'),
  }),
  market: Yup.object().shape({
    label: Yup.string().required('Market Name is required'),
    value: Yup.string().required('Market Name is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('Route is required'),
    value: Yup.string().required('Route is required'),
  }),
});

const initValues = {
  territory: '',
  market: '',
  route: '',
};

function AssetRequest({navigation}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [loading, setLoading] = useState(false);
  const [landingData, setLandingData] = useState([]);

  // DDL State
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [marketDDL, setMarketDDL] = useState([]);

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
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setTerritoryDDL,
    );
  }, [profileData, selectedBusinessUnit]);

  const viewHandler = (values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      formikprops?.values?.route?.value,
      formikprops?.values?.market?.value,
      0,
      1000,
      setLoading,
      setLandingData,
    );
  };

  // Last Added | By Default Route Selected | login info wise (territoryInfo?.todayRouteId)
  useEffect(() => {
    routeSelectByDefault(territoryInfo, routeDDL, (selectedRoute) => {
      formikprops?.setFieldValue('route', selectedRoute);
      formikprops?.setFieldValue('market', '');
      setLandingData([]);
      getBeatDDL(selectedRoute?.value, setMarketDDL);
    });
  }, [routeDDL]);

  return (
    <>
      <ScrollView>
        <CommonTopBar title="Outlet Asset Request" />

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
                  setLandingData([]);
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
                onChange={(item) => {
                  formikprops.setFieldValue('route', item);
                  formikprops.setFieldValue('market', '');
                  setLandingData([]);
                  getBeatDDL(item?.value, setMarketDDL);
                }}
                options={routeDDL}
                formikProps={formikprops}
              />
            </Col>

            <Col width="50%">
              <ICustomPicker
                label="Market Name"
                name="market"
                onChange={(item) => {
                  formikprops.setFieldValue('market', item);
                  setLandingData([]);
                }}
                options={marketDDL}
                formikProps={formikprops}
              />
            </Col>
          </Row>

          <CustomButton
            onPress={formikprops.handleSubmit}
            isLoading={loading}
            btnTxt="View"
          />

          {/* Header Part */}
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
              <Text style={styles.date}>Date</Text>
              <Text style={styles.date}>Action</Text>
            </Col>
          </Row>

          {landingData?.data?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate('createAssetRequest', {
                  id: item?.intAssetRequestId,
                  ...formikprops?.values,
                  type: 'view',
                })
              }>
              <Row
                style={{
                  marginVertical: 10,
                  padding: 10,
                  borderRadius: 5,
                  backgroundColor: '#ffffff',
                }}>
                <Col width="50%">
                  <Text style={styles.customerAmount}>{item?.outletName}</Text>
                  <Text style={[styles.address]}>{item?.outletAddress}</Text>
                </Col>
                <Col width="50%">
                  <Text style={styles.date}>
                    {_dateFormatter(item?.dteRequiredDate)}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      marginTop: 5,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('createAssetRequest', {
                          id: item?.intAssetRequestId,
                          ...formikprops?.values,
                          type: 'edit',
                        });
                      }}>
                      <Text style={styles.editBtn}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </Col>
              </Row>
            </TouchableOpacity>
          ))}
        </View>
        {landingData?.data?.length === 0 && <NoDataFoundGrid />}
      </ScrollView>

      {formikprops?.values?.territory?.value &&
      formikprops?.values?.route?.value &&
      formikprops?.values?.market?.value ? (
        <FabButton
          onPress={() =>
            navigation.navigate('createAssetRequest', {
              ...formikprops?.values,
              type: 'create',
            })
          }
        />
      ) : null}
    </>
  );
}

export default AssetRequest;

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

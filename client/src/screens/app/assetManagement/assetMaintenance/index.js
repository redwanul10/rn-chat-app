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
  getOutletNameDDL,
} from '../../../../common/actions/helper';
import {getLandingData} from './helper';
import NoDataFoundGrid from '../../../../common/components/NoDataFoundGrid';
import MiniButton from '../../../../common/components/MiniButton';
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
  outlet: Yup.object().shape({
    label: Yup.string().required('Outlet Name is required'),
    value: Yup.string().required('Outlet Name is required'),
  }),
});

const initValues = {
  territory: '',
  market: '',
  route: '',
  outlet: '',
};

function AssetMaintenance({navigation}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [loading, setLoading] = useState(false);
  const [landingData, setLandingData] = useState([]);

  // DDL State
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [marketDDL, setMarketDDL] = useState([]);
  const [outletDDL, setOutletDDL] = useState([]);

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
      formikprops?.values?.outlet?.value,
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
        <CommonTopBar title="Outlet Asset Maintenance" />

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
                  getOutletNameDDL(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    formikprops.values?.route?.value,
                    item?.value,
                    setOutletDDL,
                  );
                }}
                options={marketDDL}
                formikProps={formikprops}
              />
            </Col>

            <Col width="50%">
              <ICustomPicker
                label="Outlet Name"
                name="outlet"
                onChange={(item) => {
                  formikprops.setFieldValue('outlet', item);
                  setLandingData([]);
                }}
                options={outletDDL}
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
              <Text style={[styles.address, {color: 'black'}]}>
                Item Issue Date
              </Text>
            </Col>
            <Col width="50%">
              <Text style={styles.date}>Asset Name</Text>
              <Text style={styles.date}>Quantity</Text>
            </Col>
          </Row>

          {landingData?.data?.map((item, index) => (
            <Row
              key={index}
              style={{
                marginVertical: 10,
                padding: 10,
                borderRadius: 5,
                backgroundColor: '#ffffff',
              }}>
              <Col width="50%">
                <Text style={styles.customerAmount}>{item?.outletName}</Text>
                <Text style={[styles.address]}>{item?.outletAddress}</Text>
                <Text style={[styles.address, {color: 'black'}]}>
                  {_dateFormatter(item?.itemIssueDate)}
                </Text>
              </Col>
              <Col width="50%">
                <Text style={styles.date}>
                  {item?.itemName}{' '}
                  {item?.assetItemCode && `[${item?.assetItemCode}]`}
                </Text>
                <Text style={styles.date}>{item?.itemQuantity}</Text>
                <MiniButton
                  containerStyle={{justifyContent: 'flex-end'}}
                  onPress={() => {
                    navigation.navigate('assetMaintenanceView', {
                      ...formikprops?.values,
                      assetItemCode: item?.assetItemCode,
                      id: item?.assetMaintenanceId,
                      item: {
                        label: item?.itemName,
                        value: item?.itemId,
                      },
                    });
                  }}
                  btnText={'View'}
                />
              </Col>
            </Row>
          ))}
        </View>

        {landingData?.data?.length === 0 && <NoDataFoundGrid />}
      </ScrollView>

      {formikprops?.values?.territory?.value &&
      formikprops?.values?.route?.value &&
      formikprops?.values?.market?.value ? (
        <FabButton
          onPress={() =>
            navigation.navigate('createAssetMaintenance', {
              ...formikprops?.values,
              type: 'create',
            })
          }
        />
      ) : null}
    </>
  );
}

export default AssetMaintenance;

const styles = StyleSheet.create({
  customerAmount: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  date: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
  },
  address: {color: '#00B44A', fontWeight: 'bold', fontSize: 13},
});

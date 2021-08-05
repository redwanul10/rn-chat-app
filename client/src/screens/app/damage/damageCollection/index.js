import React, {useState, useEffect, useContext} from 'react';
import {
  ScrollView,
  View,
  // Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import CommonTopBar from '../../../../common/components/CommonTopBar';
import ICustomPicker from '../../../../common/components/ICustomPicker';
import IDatePicker from '../../../../common/components/IDatePicker';
import {useFormik} from 'formik';
import CustomButton from '../../../../common/components/CustomButton';
import {GlobalState} from '../../../../GlobalStateProvider';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import {
  getDistributorAndChannel,
  getDamageCategoryDDL,
  getDamageCollectionLandingData,
} from './helper';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import FabButton from '../../../../common/components/FabButton';
import {_todayDate} from '../../../../common/functions/_todayDate';
import * as Yup from 'yup';
import {getTerritoryDDL, getRouteDDL} from '../../../../common/actions/helper';
import Text from '../../../../common/components/IText';
import {routeSelectByDefault} from '../../../../common/functions/routeSelectedByDefault';

const validationSchema = Yup.object().shape({
  territory: Yup.object().shape({
    label: Yup.string().required('Territory Name is required'),
    value: Yup.string().required('Territory Name is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('Route is required'),
    value: Yup.string().required('Route is required'),
  }),
  damageCategoryHeader: Yup.object().shape({
    label: Yup.string().required('Damage Category is required'),
    value: Yup.string().required('Damage Category is required'),
  }),
});

const initValues = {
  territory: '',
  distributor: '',
  distributorChannel: '',
  damageCategoryHeader: '',
  route: '',
  beat: '',
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function DamageCollection({navigation}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [damageCateDDL, setDamageCateDDL] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [landingData, setLandingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distributorAndChannel, setDistributorAndChannel] = useState({});

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: initValues,
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
    getDamageCategoryDDL(setDamageCateDDL);
  }, [profileData, selectedBusinessUnit]);

  const viewHandler = (values) => {
    setFormValues(values);
    getDamageCollectionLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.territory?.value,
      values?.route?.value,
      values?.beat?.value,
      values?.outlet?.value,
      values?.damageCategoryHeader?.value,
      values?.fromDate,
      values?.toDate,
      setLoading,
      setLandingData,
    );
  };

  // Last Added | By Default Route Selected | login info wise (territoryInfo?.todayRouteId)
  useEffect(() => {
    routeSelectByDefault(territoryInfo, routeDDL, (selectedRoute) => {
      formikprops?.setFieldValue('route', selectedRoute);
      setFormValues({
        ...formValues,
        route: selectedRoute,
      });
    });
  }, [routeDDL]);

  return (
    <>
      <ScrollView>
        <CommonTopBar />
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

                  setFormValues({
                    ...formValues,
                    territory: item,
                  });
                  getDistributorAndChannel(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    item?.value,
                    setDistributorAndChannel,
                  );
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
                onChange={(item) => {
                  formikprops.setFieldValue('route', item);
                  setFormValues({
                    ...formValues,
                    route: item,
                  });
                }}
                formikProps={formikprops}
              />
            </Col>

            <Col width="50%">
              <ICustomPicker
                label="Damage Category"
                name="damageCategoryHeader"
                options={damageCateDDL}
                onChange={(item) => {
                  formikprops.setFieldValue('damageCategoryHeader', item);
                  setFormValues({
                    ...formValues,
                    damageCategoryHeader: item,
                  });
                }}
                formikProps={formikprops}
              />
            </Col>
            <Col width="50%">
              <IDatePicker
                label="Select From Date"
                name="fromDate"
                formikProps={formikprops}
              />
            </Col>
            <Col width="50%">
              <IDatePicker
                label="Select To Date"
                name="toDate"
                formikProps={formikprops}
              />
            </Col>
          </Row>

          <CustomButton
            onPress={formikprops.handleSubmit}
            isLoading={loading}
            btnTxt="Show"
          />

          <View
            style={{
              marginVertical: 10,
              padding: 10,
              borderRadius: 5,
              backgroundColor: '#ffffff',
            }}>
            <View style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
              <Text style={{fontWeight: 'bold'}}>SL</Text>
              <Text style={{fontWeight: 'bold'}}>Date</Text>
            </View>
            <View style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
              <Text style={styles.customerAmount}>Outlet Name</Text>
              <Text style={[styles.customerAmount, {color: '#00B44A'}]}>
                Total Damage Qty
              </Text>
            </View>
            <View
              style={[
                styles.cardStyle,
                {marginBottom: 5, justifyContent: 'space-between'},
              ]}>
              <Text style={styles.teritoryText}>Outlet Address</Text>
            </View>
          </View>
          {landingData?.data?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate('View Damage Collection', {
                  id: item?.damageEntryId,
                })
              }
              style={{
                marginVertical: 10,
                padding: 10,
                borderRadius: 5,
                backgroundColor: '#ffffff',
              }}>
              <View
                style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
                <Text style={{fontWeight: 'bold'}}>{item?.sl}</Text>
                <Text style={{fontWeight: 'bold'}}>
                  {_dateFormatter(item?.damageEntryDate)}
                </Text>
              </View>
              <View
                style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
                <Text style={styles.customerAmount}>
                  {item?.outletName} {item?.cooler && '(Cooler)'}
                </Text>
                <Text style={[styles.customerAmount, {color: '#00B44A'}]}>
                  {item?.numDamageItemQty}
                </Text>
              </View>
              <View
                style={[
                  styles.cardStyle,
                  {marginBottom: 5, justifyContent: 'space-between'},
                ]}>
                <Text style={styles.teritoryText}>{item?.outletAddress}</Text>

                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.teritoryText, {paddingRight: 10}]}>
                    {item?.dueAmount}
                  </Text>
                  <Text style={styles.teritoryText}>{item?.qty}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {formValues?.territory &&
        formValues?.route &&
        formValues?.damageCategoryHeader && (
          <FabButton
            onPress={() =>
              navigation.navigate('Create Damage Collection', {
                ...formValues,
                distributorName: {
                  value: distributorAndChannel?.distributorId,
                  label: distributorAndChannel?.distributorName,
                },
                distributorChannel: {
                  value: distributorAndChannel?.distributionChannelId,
                  label: distributorAndChannel?.distributionChannelName,
                },
              })
            }
          />
        )}
    </>
  );
}

export default DamageCollection;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F6FC',
    flex: 1,
  },
  createButton: {
    marginRight: 50,
    padding: 6,
    backgroundColor: '#6c757d',
    borderRadius: 7,
    alignItems: 'center',
    width: 70,
  },
  box: {
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    elevation: 5,
  },
  label: {
    fontSize: 14,
    // fontFamily: 'Rubik-Regular',
    color: '#636363',
  },
  customerAmount: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  cardStyle: {
    flexDirection: 'row',
  },
  teritoryText: {
    color: '#000000',
    paddingVertical: 5,
    opacity: 0.75,
  },
  completeButton: {
    marginLeft: 10,
    backgroundColor: '#D1FFDF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#D2D2D2',
  },
  fabStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: 55,
    right: 17,
    height: 60,
    backgroundColor: '#3A405A',
    borderRadius: 100,
  },
  dateStyle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 7,
    height: 40,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

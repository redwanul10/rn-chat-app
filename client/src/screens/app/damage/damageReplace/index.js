/* eslint-disable react-native/no-inline-styles */
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
import {Formik} from 'formik';
import CustomButton from '../../../../common/components/CustomButton';
import {
  getDamageCategoryDDL,
  getGridData,
  getDistributorAndDistributorChannelNameDDL,
} from './helper';

import {
  getTerritoryDDL,
  getRouteDDLByTerritoryId,
  getBeatDDL,
  getOutletNameDDL,
} from '../../../../common/actions/helper';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import * as Yup from 'yup';
import {_todayDate} from '../../../../common/functions/_todayDate';
import {GlobalState} from '../../../../GlobalStateProvider';
import {Radio} from 'native-base';
import NoDataFoundGrid from '../../../../common/components/NoDataFoundGrid';
import {Spinner} from 'native-base';
import {FlatList} from 'react-native';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import Text from '../../../../common/components/IText';
import {useFormik} from 'formik';
import {routeSelectByDefault} from '../../../../common/functions/routeSelectedByDefault';
import IRadioButton from '../../../../common/components/IRadioButton';

const initValues = {
  territory: '',
  distributor: '',
  beat: '',
  outlet: '',
  route: '',
  damageType: '',
  dueAmount: '',
  distributorChannel: '',
  entryMonth: '',
  damageCategory: '',
  status: 1,
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const validationSchema = Yup.object().shape({
  territory: Yup.object().shape({
    label: Yup.string().required('Territory Name is required'),
    value: Yup.string().required('Territory Name is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('Route is required'),
    value: Yup.string().required('Route is required'),
  }),
  beat: Yup.object().shape({
    label: Yup.string().required('Market is required'),
    value: Yup.string().required('Market is required'),
  }),
  outlet: Yup.object().shape({
    label: Yup.string().required('Outlet is required'),
    value: Yup.string().required('Outlet is required'),
  }),
  damageCategory: Yup.object().shape({
    label: Yup.string().required('Damage Category is required'),
    value: Yup.string().required('Damage Category is required'),
  }),
});

function DamageReplaceLanding({navigation}) {
  const [isDisabled, setDisabled] = useState(false);
  const [gridData, setGridData] = useState();

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: initValues,
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      viewHandler(values);
    },
  });

  // Global Data
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );

  // All DDL
  const [routeDDL, setRouteDDL] = useState([]);
  const [beatDDL, setBeatDDL] = useState([]);
  const [outletDDL, setOutletDDL] = useState([]);
  const [territoryNameDDL, setTerritoryNameDDL] = useState([]);
  const [damageCategoryDDL, setDamageCategoryDDL] = useState([]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getTerritoryDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.employeeId,
        setTerritoryNameDDL,
      );
      getDamageCategoryDDL(setDamageCategoryDDL);
    }
  }, [profileData, selectedBusinessUnit]);

  const viewHandler = async (values) => {
    getGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.status,
      values?.route?.value,
      values?.outlet?.value,
      values?.damageCategory?.value,
      values?.fromDate,
      values?.toDate,
      0,
      100,
      setGridData,
      setDisabled,
    );
  };

  const beatOutletEmpty = (value, name, setFieldValue) =>
    value !== 0 && setFieldValue(name, '');

  // Last Added | By Default Route Selected | login info wise (territoryInfo?.todayRouteId)
  useEffect(() => {
    routeSelectByDefault(territoryInfo, routeDDL, (selectedRoute) => {
      formikprops?.setFieldValue('route', selectedRoute);
      beatOutletEmpty(
        formikprops.values?.outlet?.value,
        'outlet',
        formikprops.setFieldValue,
      );
      beatOutletEmpty(
        formikprops.values?.beat?.value,
        'beat',
        formikprops.setFieldValue,
      );
      getBeatDDL(selectedRoute?.value, setBeatDDL);
    });
  }, [routeDDL]);

  return (
    <>
      <CommonTopBar />
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View style={{marginHorizontal: 10, marginTop: 20}}>
              <Row colGap={5}>
                <Col width="50%">
                  <ICustomPicker
                    label="Territory"
                    name="territory"
                    options={territoryNameDDL}
                    onChange={(valueOption) => {
                      formikprops.setFieldValue('territory', valueOption);
                      formikprops.setFieldValue('distributor', '');
                      formikprops.setFieldValue('route', '');

                      getRouteDDLByTerritoryId(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setRouteDDL,
                      );
                      getDistributorAndDistributorChannelNameDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        formikprops.setFieldValue,
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
                    onChange={(valueOption) => {
                      formikprops.setFieldValue('route', valueOption);
                      beatOutletEmpty(
                        formikprops.values?.outlet?.value,
                        'outlet',
                        formikprops.setFieldValue,
                      );
                      beatOutletEmpty(
                        formikprops.values?.beat?.value,
                        'beat',
                        formikprops.setFieldValue,
                      );

                      getBeatDDL(valueOption.value, setBeatDDL);
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    label="Market Name"
                    name="beat"
                    options={beatDDL}
                    onChange={(valueOption) => {
                      formikprops.setFieldValue('beat', valueOption);
                      getOutletNameDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        formikprops.values?.route.value,
                        valueOption.value,
                        setOutletDDL,
                      );
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    label="Outlet Name"
                    name="outlet"
                    options={outletDDL}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    label="Damage Category"
                    name="damageCategory"
                    options={damageCategoryDDL}
                    formikProps={formikprops}
                  />
                </Col>

                {formikprops.values?.status === 1 && (
                  <>
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
                  </>
                )}

                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <Text style={{marginHorizontal: 10}}>Replace</Text>
                  <IRadioButton
                    onPress={() => {
                      formikprops.setFieldValue('status', 1);
                      setGridData([]);
                    }}
                    selected={formikprops?.values?.status === 1 ? true : false}
                  />
                  {/* <Radio
                    color="#000000"
                    onPress={() => {
                      formikprops.setFieldValue('status', 1);
                      setGridData([]);
                    }}
                    selected={formikprops?.values?.status === 1}
                  /> */}
                  <Text style={{marginHorizontal: 10}}>Not Replace</Text>
                  <IRadioButton
                    onPress={() => {
                      formikprops.setFieldValue('status', 2);
                      setGridData([]);
                    }}
                    selected={formikprops?.values?.status === 2 ? true : false}
                  />
                  {/* <Radio
                    color="#000000"
                    onPress={() => {
                      formikprops.setFieldValue('status', 2);
                      setGridData([]);
                    }}
                    selected={formikprops?.values?.status === 2}
                  /> */}
                </View>
              </Row>

              <CustomButton
                onPress={formikprops.handleSubmit}
                isLoading={isDisabled}
                btnTxt="Show"
              />

              {/* Header Card */}
              {gridData?.data?.length > 0 && (
                <View
                  style={{
                    padding: 15,
                    borderRadius: 5,
                    backgroundColor: '#ffffff',
                  }}>
                  <View
                    style={[
                      styles.cardStyle,
                      {justifyContent: 'space-between'},
                    ]}>
                    <Text style={{fontWeight: 'bold'}}>SL</Text>
                  </View>
                  <View
                    style={[
                      styles.cardStyle,
                      {justifyContent: 'space-between'},
                    ]}>
                    <Text style={styles.customerAmount}>Damage Category</Text>
                    <Text style={[styles.customerAmount, {color: 'tomato'}]}>
                      Damaged Item Qty
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.cardStyle,
                      {justifyContent: 'space-between'},
                    ]}>
                    <Text style={styles.teritoryText}>
                      {formikprops?.values?.status === 2
                        ? 'Damge Entry Date'
                        : 'Damage Replace Date'}
                    </Text>
                    <Text style={{fontWeight: 'bold', color: 'black'}}>
                      Pending Qty
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.cardStyle,
                      {justifyContent: 'space-between'},
                    ]}>
                    <Text style={styles.editButton}>Action</Text>
                    <Text style={{color: 'green'}}>Replacement Qty</Text>
                  </View>
                </View>
              )}

              {gridData?.data?.length === 0 && <NoDataFoundGrid />}
            </View>
          </>
        )}
        data={gridData?.data}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.5}
        renderItem={({item, index}) => (
          <View
            key={index}
            style={{
              marginVertical: 10,
              marginHorizontal: 10,
              paddingHorizontal: 5,
              borderRadius: 5,
              backgroundColor: '#ffffff',
            }}>
            <View
              style={{
                marginVertical: 10,
                borderRadius: 5,
                paddingHorizontal: 10,
                backgroundColor: '#ffffff',
              }}>
              <View
                style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
                <Text style={{fontWeight: 'bold'}}>{index + 1}</Text>
              </View>
              <View
                style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
                <Text style={styles.customerAmount}>
                  {item?.dmgCategoryName}
                </Text>
                <Text style={[styles.customerAmount, {color: 'tomato'}]}>
                  {item?.totalDamageItemQty}
                </Text>
              </View>
              <View
                style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
                <Text style={styles.teritoryText}>
                  {item?.damageDate && _dateFormatter(item?.damageDate)}
                </Text>
                <Text style={{fontWeight: 'bold', color: 'black'}}>
                  {item?.totalPendingQuantity}
                </Text>
              </View>
              <View
                style={[styles.cardStyle, {justifyContent: 'space-between'}]}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Edit Damage Replace', {
                      id: item?.damageEntryId,
                      ...formikprops?.values,
                    })
                  }>
                  <Text style={styles.editButton}>
                    {formikprops?.values?.status === 1 ? 'View' : 'Edit'}
                  </Text>
                </TouchableOpacity>
                <Text style={{color: 'green'}}>
                  {item?.totalReplaceQuantity}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </>
  );
}

export default DamageReplaceLanding;

const styles = StyleSheet.create({
  customerAmount: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  cardStyle: {
    flexDirection: 'row',
  },
  teritoryText: {
    color: '#000000',
    // paddingRight: 10,
    opacity: 0.75,
  },
  editButton: {
    color: 'white',
    backgroundColor: '#00cdac',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 2,
  },
});

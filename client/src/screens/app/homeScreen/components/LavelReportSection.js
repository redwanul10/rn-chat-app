import React, {useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {GlobalState} from '../../../../GlobalStateProvider';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {_todayDate} from '../../../../common/functions/_todayDate';
import {
  getStrikeRateDashboardValue,
  getLpcDashboardValue,
  getAchievementsDashboardValue,
  getProductivityDashboardValue,
  getNoBillDashboardValue,
  getRegulerBillDashboardValue,
  getHEDashboardValue,
  getADTDashboardValue,
  getRADTDashboardValue,
  getPJPDashboardValue,
  getVPCDashboardValue,
} from './componentHelper';

/* Background Color use */
// #28a745
// '#353f65'
// '#35363c',
// '#155233',
// 'rgb(23, 162, 184)'

export default function LavelReportSection({
  formikprops,
  tourData,
  targetInfo,
}) {
  const navigation = useNavigation();

  // Global Data State
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );

  const commonFunc = (cb) => {
    cb(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      _todayDate(),
      _todayDate(),
      territoryInfo?.empLevelId,
      territoryInfo?.empTerritoryId,
      formikprops?.setFieldValue,
    );
  };

  // Dashboard Api Called
  useEffect(() => {
    commonFunc(getAchievementsDashboardValue); // Target By Achievements
    commonFunc(getLpcDashboardValue); // LPC
    commonFunc(getStrikeRateDashboardValue); // Strike Rate
    commonFunc(getProductivityDashboardValue); // Productivity Call
    commonFunc(getNoBillDashboardValue); // No Bill
    commonFunc(getRegulerBillDashboardValue); // Reguler Bill
    commonFunc(getHEDashboardValue); // HE
    commonFunc(getADTDashboardValue); // ADT
    commonFunc(getRADTDashboardValue); // RADT
    commonFunc(getPJPDashboardValue); // PJP
    commonFunc(getVPCDashboardValue); // VPC
  }, [
    profileData?.accountId,
    selectedBusinessUnit?.value,
    territoryInfo?.empTerritoryId,
    territoryInfo?.empLevelId,
  ]);

  return (
    <>
      <View style={[styles.shortInfo, {padding: 20}]}>
        <View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            contentContainerStyle={[styles.content, {width: 'auto'}]}>
            {/* Target By Achievement */}
            {/* <TouchableOpacity
              onPress={() => {
                navigation.navigate('dashboardReportDetails', {
                  key: formikprops?.values?.achievements?.key,
                  pageTitle: 'Sales Target Achievements Report',
                });
              }}>
              <View
                style={[
                  styles.single,
                  {backgroundColor: '#353f65', width: 140},
                ]}>
                <Text style={[styles.singleCardText]}>
                  {formikprops?.values?.achievements?.label}
                </Text>
                <Text style={styles.amountStyle}>
                  {formikprops?.values?.achievements?.value}%
                </Text>
              </View>
            </TouchableOpacity> */}

            {/* LPC Report */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('dashboardReportDetails', {
                  pageTitle: 'LPC Report',
                  key: formikprops?.values?.lpc?.key,
                });
              }}>
              <View style={[styles.single, {backgroundColor: '#28a745'}]}>
                <Text style={[styles.singleCardText]}>
                  {formikprops?.values?.lpc?.label}
                </Text>
                <Text style={styles.amountStyle}>
                  {formikprops?.values?.lpc?.value}%
                </Text>
              </View>
            </TouchableOpacity>

            {/* Strike Rate Report */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('dashboardReportDetails', {
                  pageTitle: 'Strike Rate Report',
                  key: formikprops?.values?.strikeRate?.key,
                });
              }}>
              <View style={[styles.single, {backgroundColor: '#35363c'}]}>
                <Text style={[styles.singleCardText]}>
                  {formikprops?.values?.strikeRate?.label}
                </Text>
                <Text style={styles.amountStyle}>
                  {formikprops?.values?.strikeRate?.value}%
                </Text>
              </View>
            </TouchableOpacity>

            {/* Productivity Call Report */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('dashboardReportDetails', {
                  pageTitle: 'Productivity Call Report',
                  key: formikprops?.values?.productivityCall?.key,
                });
              }}>
              <View
                style={[
                  styles.single,
                  {backgroundColor: 'rgb(23, 162, 184)', width: 150},
                ]}>
                <Text style={[styles.singleCardText]}>
                  {formikprops?.values?.productivityCall?.label}
                </Text>
                <Text style={styles.amountStyle}>
                  {formikprops?.values?.productivityCall?.value}%
                </Text>
              </View>
            </TouchableOpacity>

            {/* Non Bill Report */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('dashboardReportDetails', {
                  pageTitle: 'Non Bill Report',
                  key: formikprops?.values?.noBill?.key,
                });
              }}>
              <View style={[styles.single, {backgroundColor: '#353f65'}]}>
                <Text style={[styles.singleCardText]}>
                  {formikprops?.values?.noBill?.label}
                </Text>
                <Text style={styles.amountStyle}>
                  {formikprops?.values?.noBill?.value}%
                </Text>
              </View>
            </TouchableOpacity>

            {/* Numeric Distribution Report */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('dashboardReportDetails', {
                  pageTitle: 'Numeric Distribution Report',
                  key: formikprops?.values?.numericBill?.key,
                });
              }}>
              <View style={[styles.single, {backgroundColor: '#28a745'}]}>
                <Text style={[styles.singleCardText]}>
                  {formikprops?.values?.numericBill?.label}
                </Text>
                <Text style={styles.amountStyle}>
                  {formikprops?.values?.numericBill?.value}%
                </Text>
              </View>
            </TouchableOpacity>

            {/* HE Report */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('dashboardReportDetails', {
                  pageTitle: 'HE Report',
                  key: formikprops?.values?.he?.key,
                });
              }}>
              <View style={[styles.single, {backgroundColor: '#35363c'}]}>
                <Text style={[styles.singleCardText]}>
                  {formikprops?.values?.he?.label}
                </Text>
                <Text style={styles.amountStyle}>
                  {formikprops?.values?.he?.value}%
                </Text>
              </View>
            </TouchableOpacity>

            {/* ADT Report */}
            {/* <TouchableOpacity
              onPress={() => {
                navigation.navigate('dashboardReportDetails', {
                  key: formikprops?.values?.adt?.key,
                  pageTitle: 'ADT Report',
                });
              }}>
              <View style={[styles.single, {backgroundColor: '#353f65'}]}>
                <Text style={[styles.singleCardText]}>
                  {formikprops?.values?.adt?.label}
                </Text>
                <Text style={styles.amountStyle}>
                  ৳{formikprops?.values?.adt?.value}
                </Text>
              </View>
            </TouchableOpacity> */}

            {/* RADT Report */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('dashboardReportDetails', {
                  key: formikprops?.values?.radt?.key,
                  pageTitle: 'RADT Report',
                });
              }}>
              <View style={[styles.single, {backgroundColor: '#28a745'}]}>
                <Text style={[styles.singleCardText]}>
                  {formikprops?.values?.radt?.label}
                </Text>
                <Text style={styles.amountStyle}>
                  ৳{formikprops?.values?.radt?.value}
                </Text>
              </View>
            </TouchableOpacity>

            {/* PJP Report */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('dashboardReportDetails', {
                  key: formikprops?.values?.pjp?.key,
                  pageTitle: 'PJP Report',
                });
              }}>
              <View style={[styles.single, {backgroundColor: '#353f65'}]}>
                <Text style={[styles.singleCardText]}>
                  {formikprops?.values?.pjp?.label}
                </Text>
                <Text style={styles.amountStyle}>
                  {formikprops?.values?.pjp?.value}%
                </Text>
              </View>
            </TouchableOpacity>

            {/* VPC Report */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('dashboardReportDetails', {
                  key: formikprops?.values?.vpc?.key,
                  pageTitle: 'VPC Report',
                });
              }}>
              <View style={[styles.single, {backgroundColor: '#35363c'}]}>
                <Text style={[styles.singleCardText]}>
                  {formikprops?.values?.vpc?.label}
                </Text>
                <Text style={styles.amountStyle}>
                  ৳{formikprops?.values?.vpc?.value}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Today Tour | Next Tour */}
            <TouchableOpacity
              onPress={() => {
                if (tourData?.territoryName) {
                  navigation.navigate('tourPlanDrillDown', {
                    pageTitle: 'Route Plan By Location',
                    key: 'tourPlanByLocation',
                    type: 1,
                  });
                }
              }}>
              <View
                style={[
                  styles.single,
                  {
                    alignItems: 'flex-start',
                    backgroundColor: 'rgb(23, 162, 184)',
                    width: 'auto',
                    paddingHorizontal: 10,
                  },
                ]}>
                <Text style={{color: '#ffffff'}}>Today Tour</Text>
                <Text style={{color: '#ffffff', fontWeight: 'bold'}}>
                  {tourData?.territoryName || 'No Data Set'}
                </Text>
                <Text style={{color: '#ffffff'}}>Next Tour</Text>
                <Text style={{color: '#ffffff', fontWeight: 'bold'}}>
                  {tourData?.nextTerritoryName || 'No Data Set'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Today Target | Next Target */}
            <TouchableOpacity>
              <View
                style={[
                  styles.single,
                  {
                    alignItems: 'flex-start',
                    backgroundColor: '#353f65',
                    paddingHorizontal: 10,
                  },
                ]}>
                <Text style={{color: '#ffffff'}}>Today Target</Text>
                <Text style={[styles.amountStyle, {fontSize: 13}]}>
                  {targetInfo?.todayTarget}
                </Text>
                <Text style={{color: '#ffffff'}}>Next Target</Text>
                <Text style={[styles.amountStyle, {fontSize: 13}]}>
                  {targetInfo?.nextTarget}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flexDirection: 'row',
    width: 1650,
  },
  shortInfo: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 28,
  },
  amountStyle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  single: {
    width: 120,
    marginRight: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 15,
    height: 90,
  },
  singleCardText: {
    color: '#ffffff',
    textAlign: 'center',
    // fontWeight: 'bold',
  },
  moneyScene: {
    width: 130,
    marginBottom: 10,
    marginRight: 5,
    borderRadius: 10,
  },
});

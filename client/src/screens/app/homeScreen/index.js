/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {useFormik} from 'formik';
import Graph from './components/Graph';
import DonutChart from '../../../common/components/DonutChart';
import Gauge from './components/Gauge';
import User from '../../../common/components/User';

import {
  GetDashBoardData_api,
  GetEmployeeRanking_api,
  GetTourData,
  performanceValue,
  getTodaySales,
  GetOutletVisitData,
  createUserLogInfo,
} from './helper';
import {GlobalState} from '../../../GlobalStateProvider';
import {_todayDate} from '../../../common/functions/_todayDate';
import {headerBgPrimary} from '../../../common/theme/color';
import Text from '../../../common/components/IText';
import LavelReportSection from './components/LavelReportSection';
import {btnBgSecondary} from '../../../common/theme/color';
import TodaysSalesAndTwdDwdRdwSection from './components/todaySalesAndTWD_DWD_RWD_Section';
import {useIsFocused} from '@react-navigation/native';

/*
 *** if you change this initial Value then you need to change also in componentHelper.js > every dashboard api called > in catch and try method ***
 */
const initValues = {
  lpc: {
    value: 0,
    label: 'LPC',
    key: 'lpc',
  },
  strikeRate: {
    value: 0,
    label: 'Strike Rate',
    key: 'strikeRate',
  },
  productivityCall: {
    value: 0,
    label: 'Call Productivity',
    key: 'productivityCall',
  },
  achievements: {
    value: 0,
    label: 'Sales Target Achievements',
    key: 'achievements',
  },
  noBill: {
    value: 0,
    label: 'Non Bill',
    key: 'noBill',
  },
  numericBill: {
    value: 0,
    label: 'Numeric Distribution',
    key: 'numericBill',
  },
  he: {
    value: 0,
    label: 'HE',
    key: 'he',
  },
  adt: {
    value: 0,
    label: 'ADT',
    key: 'adt',
  },
  radt: {
    value: 0,
    label: 'RADT',
    key: 'radt',
  },
  pjp: {
    value: 0,
    label: 'PJP',
    key: 'pjp',
  },
  vpc: {
    value: 0,
    label: 'VPC',
    key: 'vpc',
  },
};

function HomeScreen({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const isFocused = useIsFocused();

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: initValues,
    onSubmit: (values, actions) => {
      // viewHandler(values);
    },
  });

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false); // this state for outlet visit and achivements report

  const [gaugeData, setgaugeData] = useState('');
  const [tourData, setTourData] = useState();
  const [employeeRanking, setEmployeeRanking] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [targetInfo, setTargetInfo] = useState({
    todayTarget: 0,
    nextTarget: 0,
  });

  // Donut Chart Data outlet Visit
  const [outletVisitData, setOutletVisitData] = useState({});

  const [infoArry, setInfoArry] = useState([
    {
      title: 'TWD',
      amount: '0',
      bg: '#155233',
    },
    {
      title: 'DWD',
      amount: '0',
      bg: '#353f65',
    },
    {
      title: 'RWD',
      amount: '0',
      bg: '#353f65',
    },
    {
      title: 'Total Target',
      amount: '৳00',
      bg: '#353f65',
    },
    {
      title: 'Total Sales',
      amount: '৳00',
      bg: '#35363c',
    },

    {
      title: 'ADS',
      amount: '৳00',
      bg: '#353f65',
    },

    {
      title: 'Average Achievement',
      amount: '0%',
      bg: '#35363c',
    },
  ]);

  // Disabled Default Back Button
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
  }, []);

  // Called User Log Info Save API
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      createUserLogInfo({
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        actionBy: profileData?.userId,
      });
    }
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  // Tab Change And Necessary API Called
  useEffect(() => {
    if (isFocused) {
      // Today Sales API Called
      getTodaySales(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        _todayDate(),
        setTodaySales,
      );
      // Outlet Visit Donut Chart API called
      GetOutletVisitData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        _todayDate(),
        territoryInfo?.empLevelId,
        territoryInfo?.empTerritoryId,
        setOutletVisitData,
      );
    }
  }, [isFocused]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      // Gauge API Called
      performanceValue(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        _todayDate(),
        territoryInfo?.empLevelId, // Last Change gauge API
        territoryInfo?.empTerritoryId, // Last Change gauge API
        setgaugeData,
      );

      // First Section All card API Called
      GetDashBoardData_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        _todayDate(),
        territoryInfo?.empTerritoryId,
        territoryInfo?.empLevelId,
        setInfoArry,
        infoArry,
        setLoading,
        setTargetInfo,
      );

      // Ranking API Change
      GetEmployeeRanking_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.employeeId,
        territoryInfo?.empLevelId,
        territoryInfo?.empTerritoryId,
        setEmployeeRanking,
        setLoading,
      );

      // Tour Plan API called
      GetTourData(profileData?.userId, _todayDate(), setTourData, setLoading);

      // Outlet Visit Donut Chart API called
      GetOutletVisitData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        _todayDate(),
        territoryInfo?.empLevelId,
        territoryInfo?.empTerritoryId,
        setOutletVisitData,
      );

      // Today Sales API Called
      getTodaySales(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        _todayDate(),
        setTodaySales,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    profileData?.accountId,
    selectedBusinessUnit?.value,
    territoryInfo?.empTerritoryId,
    territoryInfo?.empLevelId,
  ]);

  return (
    <>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}>
        <View style={styles.userSection}>
          <User />
          <TodaysSalesAndTwdDwdRdwSection
            infoArry={infoArry}
            todaySales={todaySales}
          />
        </View>

        {/* Both wrapping info section */}
        <View style={{marginTop: -70}}>
          {/* First short info section */}
          <View style={[styles.shortInfo, {padding: 20}]}>
            <View>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                contentContainerStyle={styles.content}>
                {/* Ranking Value */}
                <TouchableOpacity
                  onPress={() => {
                    if (employeeRanking?.employeePosition) {
                      navigation.navigate('tourPlanDrillDown', {
                        pageTitle: 'Ranking Report',
                        key: 'rankingReport',
                        type: 2,
                      });
                    }
                  }}
                  style={[
                    styles.moneyScene,
                    {backgroundColor: '#28a745'},
                    {justifyContent: 'center', alignItems: 'center'},
                  ]}>
                  <Text style={{color: '#ffffff'}}>Ranking</Text>
                  <Text style={styles.amountStyle}>
                    {employeeRanking?.employeePosition}
                    {'/'}
                    {employeeRanking?.totalRanking}
                  </Text>
                </TouchableOpacity>

                {/* Sales Target Achivement */}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('dashboardReportDetails', {
                      key: formikprops?.values?.achievements?.key,
                      pageTitle: 'Sales Target Achievements Report',
                    });
                  }}
                  style={[
                    styles.moneyScene,
                    {backgroundColor: '#353f65'},
                    {justifyContent: 'center', alignItems: 'center'},
                  ]}>
                  <Text style={{color: '#ffffff', textAlign: 'center'}}>
                    {formikprops?.values?.achievements?.label}
                  </Text>
                  <Text style={styles.amountStyle}>
                    {formikprops?.values?.achievements?.value}%
                  </Text>
                </TouchableOpacity>

                {/* Section 1 All Card List */}
                {infoArry?.map((item, index) => (
                  <React.Fragment key={index}>
                    {item?.isShow && (
                      <TouchableOpacity
                        onPress={() => {
                          if (item?.key) {
                            navigation.navigate('dashboardReportDetails', {
                              // Key and Page Title set from helper.js
                              pageTitle: item?.pageTitle,
                              key: item?.key,
                            });
                          }
                        }}
                        key={index}
                        style={[
                          styles.moneyScene,
                          {
                            backgroundColor:
                              index === 3
                                ? 'rgb(23, 162, 184)'
                                : item?.bg || 'rgb(40, 167, 69)',
                          },
                          {justifyContent: 'center', alignItems: 'center'},
                        ]}>
                        <Text
                          style={{
                            color: '#ffffff',
                            // margin: 10,
                            textAlign: 'center',
                          }}>
                          {item?.title}
                        </Text>
                        <Text style={styles.amountStyle}>
                          {item?.amount || 0}
                        </Text>
                      </TouchableOpacity>
                    )}
                    {/* ADT Card */}
                    {index === 4 && (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('dashboardReportDetails', {
                            key: formikprops?.values?.adt?.key,
                            pageTitle: 'ADT Report',
                          });
                        }}
                        style={[
                          styles.moneyScene,
                          {backgroundColor: 'rgb(23, 162, 184)'},
                          {justifyContent: 'center', alignItems: 'center'},
                        ]}>
                        <Text
                          style={{
                            color: '#ffffff',
                            // margin: 10,
                            textAlign: 'center',
                          }}>
                          {formikprops?.values?.adt?.label}
                        </Text>
                        <Text style={styles.amountStyle}>
                          ৳{formikprops?.values?.adt?.value}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </React.Fragment>
                ))}
                {/* Today Tour | Today Target Card */}
              </ScrollView>
            </View>

            {/* Gauge | Perfomance */}
            <Text style={styles.storeVisitStyle}>Performance</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('dashboardReportDetails', {
                  key: 'achievements',
                  pageTitle: 'Sales Target Achievements Report',
                });
              }}>
              <View>
                <Gauge
                  GaugeData={{
                    targetAmount: gaugeData || 0, // Last Change gauge API
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Drill Down Report Section 2 | LPC, Strike Rate, Achivement, Prductivity Call | No Bill | Reguler Bill | HE */}
          <LavelReportSection
            formikprops={formikprops}
            tourData={tourData}
            targetInfo={targetInfo}
          />

          {/* Achievements and Outlet section */}
          <View style={{flexDirection: 'row'}}>
            {/* Only Outlet Visit | Assign By HM Ikbal */}
            <Text style={styles.inActiveAchieve}>Outlet Visit</Text>

            {/*  =========== Old Code | Don't Remove =========== */}
            {/* <TouchableOpacity onPress={(e) => setStatus(true)}>
              <Text
                style={
                  status === true
                    ? styles.activeAchieve
                    : styles.inActiveAchieve
                }>
                Achievements
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={(e) => setStatus(false)}>
              <Text style={status === false ? styles.active : styles.inActive}>
                Outlet Visit
              </Text>
            </TouchableOpacity> */}
            {/*  =========== Old Code | Don't Remove =========== */}
          </View>
          {status === true ? (
            <View style={styles.achievementGraph}>
              <Text
                style={[
                  styles.storeVisitStyle,
                  {paddingHorizontal: 20, paddingTop: 15},
                ]}>
                Achievements
              </Text>
              <Graph />
            </View>
          ) : (
            <View style={[styles.shortInfo, {padding: 20}]}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('outletVisitDonutDrillDown', {
                    key: 'outletVisit',
                    pageTitle: 'Outlet Visit Report',
                  });
                }}>
                <Text style={styles.storeVisitStyle}>Outlet Visit</Text>
                <DonutChart
                  totalTarget={outletVisitData?.target}
                  // Percentage by visited Data
                  percentage={Number(
                    (outletVisitData?.visited / outletVisitData?.target) * 100,
                  )}
                />
                {/* Visited | Pending Section */}
                <View style={styles.overView}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View style={{top: -100}}>
                      <Text style={styles.infoNum}>
                        {outletVisitData?.visited}
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.pointer} />
                        <Text style={styles.infoText}>Visited</Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View style={{top: -100}}>
                      <Text style={styles.infoNum}>
                        {outletVisitData?.pending}
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={[styles.pointer]} />
                        <Text style={styles.infoText}>Pending</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Order | No Order Section */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: -55,
                  }}>
                  <View>
                    <Text style={styles.infoNum}>{outletVisitData?.order}</Text>
                    <Text style={[styles.infoText]}>Order</Text>
                  </View>
                  <View>
                    <Text style={styles.infoNum}>
                      {outletVisitData?.noOrder}
                    </Text>
                    <Text style={[styles.infoText]}>No Order</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flexDirection: 'row',
    width: 'auto',
  },
  userSection: {
    backgroundColor: headerBgPrimary,
    height: 300,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
  },
  shortInfo: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 28,
  },
  amountStyle: {
    color: '#ffffff',
    fontSize: 15,
    marginHorizontal: 9,
    fontWeight: 'bold',
  },
  month: {
    color: '#ffffff',
    marginHorizontal: 10,
    marginTop: 3,
    fontSize: 12,
  },
  monthSales: {
    color: '#ffffff',
    marginHorizontal: 10,
    fontSize: 15,
  },
  activeAchieve: {
    fontWeight: 'bold',
    marginHorizontal: 25,
  },
  inActiveAchieve: {
    fontWeight: 'bold',
    marginHorizontal: 25,
    opacity: 0.5,
  },
  active: {
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  inActive: {
    fontWeight: 'bold',
    marginHorizontal: 10,
    opacity: 0.5,
  },
  overView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moneyScene: {
    width: 130,
    marginBottom: 10,
    marginRight: 5,
    borderRadius: 10,
    height: 90,
  },
  storeVisitStyle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  achievementGraph: {
    height: 370,
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 28,
  },
  infoText: {
    left: 5,
    color: btnBgSecondary,
    fontWeight: 'bold',
  },
  infoNum: {
    alignSelf: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  pointer: {
    backgroundColor: btnBgSecondary,
    borderRadius: 5,
    height: 5,
    width: 5,
  },
  singleCardText: {
    color: '#ffffff',
    textAlign: 'center',
    // fontWeight: 'bold',
  },
});

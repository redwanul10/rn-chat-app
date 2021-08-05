/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {ScrollView, View, TouchableOpacity, Text} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {useFormik} from 'formik';
import {GlobalState} from '../../../../../GlobalStateProvider';

import NoDataFoundGrid from '../../../../../common/components/NoDataFoundGrid';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import {getDrillDownGridData} from './helper';
import MiniButton from '../../../../../common/components/MiniButton';
import {Spinner} from 'native-base';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import IDatePicker from '../../../../../common/components/IDatePicker';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';
import TourPlanCard from './tourPlanCard';
import RankingCard from './rankingCard';
import Icon from 'react-native-vector-icons/AntDesign';
import IconEntypo from 'react-native-vector-icons/Entypo';

const initValues = {
  date: _todayDate(),
};

function TourPlanDrillDown({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState();

  // Ranking
  const [currentMenu, setCurrentMenu] = useState();
  const [menu, setMenu] = useState();

  // Tour Plan
  const [tourMenu, setTourMenu] = useState();

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: initValues,
    onSubmit: (values, actions) => {
      viewHandler(values);
    },
  });

  useEffect(() => {
    viewHandler(formikprops?.values);
  }, [formikprops?.values?.date]);

  // Grid Data Handler
  const viewHandler = (values) => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      territoryInfo?.empTerritoryId
    ) {
      // Ranking
      if (params?.type === 2) {
        getDrillDownGridData(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          profileData?.employeeId,
          values?.date,
          territoryInfo?.empLevelId + 1,
          territoryInfo?.empTerritoryId,
          setRowData,
          setLoading,
          params?.type,
        );
        setCurrentMenu(territoryInfo?.empLevelId + 1);
        setMenu([
          {
            tabName: <IconEntypo name="home" color="white" size={16} />,
            id: territoryInfo?.empTerritoryId,
            tabId: territoryInfo?.empLevelId,
          },
        ]);
      }
      // Route Plan
      if (params?.type === 1) {
        getDrillDownGridData(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          profileData?.employeeId,
          values?.date,
          territoryInfo?.empLevelId + 1,
          territoryInfo?.empTerritoryId,
          setRowData,
          setLoading,
          params?.type,
        );
        setTourMenu([
          {
            tabName: profileData?.employeeFullName,
            id: profileData?.employeeId,
          },
        ]);
      }
    }
  };

  // Single Card Click
  const nestedClickHandler = (item, index) => {
    // 9 (Section) Last Lavel
    if (currentMenu < 9) {
      // Ranking
      if (params?.type === 2) {
        getDrillDownGridData(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          profileData?.employeeId,
          formikprops?.values?.date,
          currentMenu + 1,
          item?.locationId,
          setRowData,
          setLoading,
          params?.type,
        );
        setMenu([
          ...menu,
          {
            tabName: item?.locationName,
            id: item?.locationId,
            tabId: currentMenu,
          },
        ]);
        setCurrentMenu(currentMenu + 1);
      }
    }
    // Route Plan
    if (params?.type === 1) {
      getDrillDownGridData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        item?.employeeId,
        formikprops?.values?.date,
        currentMenu + 1,
        item?.territoryId,
        setRowData,
        setLoading,
        params?.type,
      );
      setTourMenu([
        ...tourMenu,
        {
          tabName: item?.employeeName,
          id: item?.employeeId,
        },
      ]);
    }
  };

  // Tab Click
  const tabChangeHandler = (item, index) => {
    // Ranking
    if (params?.type === 2) {
      const arr = [...menu];
      arr?.splice(++index, menu?.length - 1);
      setMenu(arr);
      setCurrentMenu(item?.tabId + 1);

      getDrillDownGridData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        formikprops?.values?.date,
        profileData?.employeeId,
        item?.tabId + 1,
        item?.id,
        setRowData,
        setLoading,
        params?.type,
      );
    }
    // Route Plan
    if (params?.type === 1) {
      const arr = [...tourMenu];
      arr?.splice(++index, tourMenu?.length - 1);
      setTourMenu(arr);

      getDrillDownGridData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        item?.id,
        formikprops?.values?.date,
        currentMenu + 1,
        item?.territoryId,
        setRowData,
        setLoading,
        params?.type,
      );
    }
  };

  return (
    <>
      <ScrollView>
        <CommonTopBar title={params?.pageTitle} />

        {params?.type !== 2 ? (
          <Row
            style={{marginHorizontal: 10, marginTop: 5, marginBottom: 0}}
            colGap={5}>
            <Col width="50%">
              <IDatePicker label="Date" name="date" formikProps={formikprops} />
            </Col>
          </Row>
        ) : null}
        <ScrollView horizontal={true}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 10,
            }}>
            {/* Render Menu */}
            {menu?.map((item, index) => (
              <View
                key={index}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <MiniButton
                  textStyle={{margin: 5, paddingVertical: 5}}
                  btnText={item?.tabName}
                  onPress={() => tabChangeHandler(item, index)}
                />
                {index !== menu?.length - 1 ? (
                  <Icon name="arrowright" color="black" size={14} />
                ) : null}
              </View>
            ))}
            {tourMenu?.map((item, index) => (
              <View
                key={index}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <MiniButton
                  textStyle={{margin: 5, paddingVertical: 5}}
                  btnText={item?.tabName}
                  onPress={() => tabChangeHandler(item, index)}
                />
                {index !== tourMenu?.length - 1 ? (
                  <Icon name="arrowright" color="black" size={14} />
                ) : null}
              </View>
            ))}
          </View>
        </ScrollView>

        {loading && <Spinner color="black" />}
        <Row colGap={5} style={{marginTop: 10, marginHorizontal: 10}}>
          {rowData?.map((item, index) => (
            <Col width={params?.type === 2 ? '50%' : '100%'} key={index}>
              <TouchableOpacity
                onPress={() => {
                  nestedClickHandler(item, index);
                }}>
                {params?.type === 1 ? (
                  <TourPlanCard item={item} />
                ) : (
                  <RankingCard item={item} />
                )}
              </TouchableOpacity>
            </Col>
          ))}
        </Row>
        <>{rowData?.length === 0 && <NoDataFoundGrid />}</>
      </ScrollView>
    </>
  );
}

export default TourPlanDrillDown;

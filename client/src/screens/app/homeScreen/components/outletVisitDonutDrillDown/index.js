/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {useFormik} from 'formik';
import {GlobalState} from '../../../../../GlobalStateProvider';

import NoDataFoundGrid from '../../../../../common/components/NoDataFoundGrid';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import DonutCardComponent from './donutCardComponent';
import {getDrillDownGridData} from './helper';
import MiniButton from '../../../../../common/components/MiniButton';
import {Spinner} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import IDatePicker from '../../../../../common/components/IDatePicker';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';
import IconEntypo from 'react-native-vector-icons/Entypo';

const initValues = {
  date: _todayDate(),
};

function OutletVisitDonutDrillDown({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState();

  const [currentMenu, setCurrentMenu] = useState();
  const [menu, setMenu] = useState([]);

  // // Formiks Setup
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
      setCurrentMenu(territoryInfo?.empLevelId + 1);
      setMenu([
        {
          tabName: <IconEntypo name="home" color="white" size={16} />,
          id: territoryInfo?.empTerritoryId,
          tabId: territoryInfo?.empLevelId,
        },
      ]);
      getDrillDownGridData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.date,
        territoryInfo?.empLevelId + 1,
        territoryInfo?.empTerritoryId,
        setRowData,
        setLoading,
      );
    }
  };

  // Single Card Click
  const nestedClickHandler = (item, index) => {
    // 9 (Section) Last Lavel
    if (currentMenu < 9) {
      getDrillDownGridData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        formikprops?.values?.date,
        currentMenu + 1,
        item?.territoryId,
        setRowData,
        setLoading,
      );
      setMenu([
        ...menu,
        {
          tabName: item?.territoryName,
          id: item?.territoryId,
          tabId: currentMenu,
        },
      ]);
      setCurrentMenu(currentMenu + 1);
    }
  };

  // Tab Click
  const tabChangeHandler = (item, index) => {
    const arr = [...menu];
    arr?.splice(++index, menu?.length - 1);
    setMenu(arr);
    setCurrentMenu(item?.tabId + 1);

    getDrillDownGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      formikprops?.values?.date,
      item?.tabId + 1,
      item?.id,
      setRowData,
      setLoading,
    );
  };

  return (
    <>
      <ScrollView>
        <CommonTopBar title={params?.pageTitle} />
        <Row
          style={{marginHorizontal: 10, marginTop: 5, marginBottom: 0}}
          colGap={5}>
          <Col width="50%">
            <IDatePicker label="Date" name="date" formikProps={formikprops} />
          </Col>
        </Row>
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
                {index !== menu.length - 1 ? (
                  <Icon name="arrowright" color="black" size={14} />
                ) : null}
              </View>
            ))}
          </View>
        </ScrollView>

        {loading && <Spinner color="black" />}
        <View style={{marginTop: 10}}>
          {rowData?.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() => {
                  nestedClickHandler(item, index);
                }}>
                <DonutCardComponent outletVisitData={item} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <>{rowData?.length === 0 && <NoDataFoundGrid />}</>
      </ScrollView>
    </>
  );
}

export default OutletVisitDonutDrillDown;

/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {useFormik} from 'formik';
import {GlobalState} from '../../../../../GlobalStateProvider';
// import CustomButton from '../../../../../common/components/CustomButton';

import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import IDatePicker from '../../../../../common/components/IDatePicker';

import NoDataFoundGrid from '../../../../../common/components/NoDataFoundGrid';
import MiniButton from '../../../../../common/components/MiniButton';

import ProgressBarCard from './progressBarCard';
import {getDownGridData, getStartAndEndDate} from './helper';
import IconEntypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/AntDesign';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import {Spinner} from 'native-base';

const initValues = {
  fromDate: '',
  toDate: '',
};

function DashboardReportDetails({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );

  const [landingData, setLandingData] = useState();
  const [loading, setLoading] = useState(false);

  const [currentMenu, setCurrentMenu] = useState();
  const [menu, setMenu] = useState([]);

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initValues,
      fromDate:
        params?.key === 'pjp' ||
        params?.key === 'vpc' ||
        params?.key === 'strikeRate' ||
        params?.key === 'productivityCall'
          ? _todayDate()
          : '',
      toDate:
        params?.key === 'pjp' ||
        params?.key === 'vpc' ||
        params?.key === 'strikeRate' ||
        params?.key === 'productivityCall'
          ? _todayDate()
          : '',
    },
    onSubmit: (values, actions) => {
      viewHandler(values);
    },
  });

  // Condition Assign by Md Jahed (Frontend)
  const monthIdGen = (todayDate) => {
    return todayDate.getDate() < 26
      ? todayDate.getMonth() + 1
      : todayDate.getMonth() + 2;
  };

  useEffect(() => {
    // Fetch start/End Date
    if (
      params?.key !== 'pjp' &&
      params?.key !== 'vpc' &&
      params?.key !== 'strikeRate' &&
      params?.key !== 'productivityCall'
    ) {
      const todayDate = new Date();
      getStartAndEndDate(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        monthIdGen(todayDate),
        todayDate.getFullYear(),
        formikprops?.setFieldValue,
      );
    }
    // Set Menu by logged in user territoryInfo
    setCurrentMenu(territoryInfo?.empLevelId + 1);
    setMenu([
      {
        tabName: <IconEntypo name="home" color="white" size={16} />,
        id: territoryInfo?.empTerritoryId,
        tabId: territoryInfo?.empLevelId,
      },
    ]);
  }, [
    profileData?.accountId,
    selectedBusinessUnit?.value,
    territoryInfo?.empTerritoryId,
  ]);

  // onChange Date and Load grid data
  useEffect(() => {
    if (formikprops?.values?.fromDate && formikprops?.values?.toDate) {
      viewHandler(formikprops?.values);
    }
  }, [formikprops?.values?.fromDate, formikprops?.values?.toDate]);

  // Grid Data Handler
  const viewHandler = (values) => {
    setCurrentMenu(territoryInfo?.empLevelId + 1);
    setMenu([
      {
        tabName: <IconEntypo name="home" color="white" size={16} />,
        id: territoryInfo?.empTerritoryId,
        tabId: territoryInfo?.empLevelId,
      },
    ]);
    getDownGridData(
      params?.key,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      formikprops?.values?.fromDate,
      formikprops?.values?.toDate,
      territoryInfo?.empLevelId + 1,
      territoryInfo?.empTerritoryId,
      setLandingData,
      setLoading,
    );
  };

  // Single Card Click
  const nestedClickHandler = (item, index) => {
    // 9 (Section) Last Lavel
    if (currentMenu < 9) {
      getDownGridData(
        params?.key,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        formikprops?.values?.fromDate,
        formikprops?.values?.toDate,
        currentMenu + 1,
        item?.id,
        setLandingData,
        setLoading,
      );
      setMenu([
        ...menu,
        {
          tabName: item?.location,
          id: item?.id,
          tabId: currentMenu,
        },
      ]);
      setCurrentMenu(currentMenu + 1);
    }
    // Unlimited Click Logic
    // if (item?.id) {
    //   getDownGridData(
    //     params?.key,
    //     profileData?.accountId,
    //     selectedBusinessUnit?.value,
    //     formikprops?.values?.fromDate,
    //     formikprops?.values?.toDate,
    //     currentMenu + 1,
    //     item?.id,
    //     setLandingData,
    //     setLoading,
    //   );
    //   setMenu([
    //     ...menu,
    //     {
    //       tabName: item?.location,
    //       id: item?.id,
    //       tabId: currentMenu,
    //     },
    //   ]);
    //   setCurrentMenu(currentMenu + 1);
    // }
  };

  // Tab Click
  const tabChangeHandler = (item, index) => {
    const arr = [...menu];
    arr?.splice(++index, menu?.length - 1);
    setMenu(arr);
    setCurrentMenu(item?.tabId + 1);

    getDownGridData(
      params?.key,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      formikprops?.values?.fromDate,
      formikprops?.values?.toDate,
      item?.tabId + 1,
      item?.id,
      setLandingData,
      setLoading,
    );
  };

  return (
    <>
      <ScrollView>
        <CommonTopBar title={params?.pageTitle} />
        <>
          <View style={{paddingHorizontal: 10, marginTop: 10}}>
            <ScrollView>
              {params?.key !== 'achievements' &&
              params?.key !== 'adt' &&
              params?.key !== 'radt' ? (
                <>
                  <Row colGap={5}>
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
                  </Row>

                  {/* View Button Remove View handler will call onChange Date as like as WEB */}
                  {/* <CustomButton
                    onPress={formikprops.handleSubmit}
                    isLoading={loading}
                    btnTxt="View"
                  /> */}
                </>
              ) : null}

              <ScrollView horizontal={true}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {/* Render Menu */}
                  {menu?.map((item, index) => (
                    <View
                      style={{flexDirection: 'row', alignItems: 'center'}}
                      key={index}>
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

              {/* Loading Component */}
              {loading && <Spinner color="black" />}

              <>
                {/* Render Progress Bar */}
                {landingData?.map((item, index) => (
                  <View key={index}>
                    <ProgressBarCard
                      onPress={() => {
                        nestedClickHandler(item, index);
                      }}
                      title={item?.location}
                      width={item?.strikeRate}
                      strikeRateNotPercentage={item?.strikeRateNotPercentage}
                      totalWidth={item?.totalWidth}
                      isTakaSign={item?.isTakaSign}
                    />
                  </View>
                ))}
              </>
            </ScrollView>
          </View>
          {landingData?.length === 0 && <NoDataFoundGrid />}
        </>
      </ScrollView>
    </>
  );
}

export default DashboardReportDetails;

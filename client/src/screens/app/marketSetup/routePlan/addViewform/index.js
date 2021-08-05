/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {useFormik} from 'formik';
import {GlobalState} from '../../../../../GlobalStateProvider';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import IDatePicker from '../../../../../common/components/IDatePicker';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import {
  getVisitWiseApi_Action,
  getEmployeeDDL,
  GetTerritotoryWithLevelByEmpDDLNew,
  getRouteDDLModify,
  saveRoutePlanWeekWiseAction,
} from '../helper';
import NoDataFoundGrid from '../../../../../common/components/NoDataFoundGrid';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';
import FabButton from '../../../../../common/components/FabButton';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import {Toast} from 'native-base';
import {btnBgSecondary} from '../../../../../common/theme/color';
import CustomButton from '../../../../../common/components/CustomButton';

const initValues = {
  date: _todayDate(),
  employee: '',
};

function CreateRoutePlanLanding({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [landingData, setLandingData] = useState();
  const [loading, setLoading] = useState(false);
  const [visitFlag, setVisitFlag] = useState([]);
  const [weeklyRowDto, setWeeklyRowDto] = useState([]);

  // DDL
  const [territoryNameDDL, setTerritoryNameDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const tourCategoryLocationDDL = [
    {value: 1, label: 'Market Visit'},
    {value: 2, label: 'Leave'},
    {value: 3, label: 'Movement'},
    {value: 4, label: 'Meeting'},
  ];

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: {...initValues, date: params?.date},
    onSubmit: (values, actions) => {
      saveHandler(values, () => {
        actions.resetForm();
        setVisitFlag([]);
      });
    },
  });

  useEffect(() => {
    setWeeklyRowDto([
      {
        strDayName: 'Saturday',
        routeCategory: {
          value: 1,
          label: 'Market Visit',
        },
        routeLocation: '',
        route: '',
      },
      {
        strDayName: 'Sunday',
        routeCategory: {
          value: 1,
          label: 'Market Visit',
        },
        routeLocation: '',
        route: '',
      },
      {
        strDayName: 'Monday',
        routeCategory: {
          value: 1,
          label: 'Market Visit',
        },
        routeLocation: '',
        route: '',
      },
      {
        strDayName: 'Tuesday',
        routeCategory: {
          value: 1,
          label: 'Market Visit',
        },
        routeLocation: '',
        route: '',
      },
      {
        strDayName: 'Wednesday',
        routeCategory: {
          value: 1,
          label: 'Market Visit',
        },
        routeLocation: '',
        route: '',
      },
      {
        strDayName: 'Thursday',
        routeCategory: {
          value: 1,
          label: 'Market Visit',
        },
        routeLocation: '',
        route: '',
      },
      {
        strDayName: 'Friday',
        routeCategory: {
          value: 1,
          label: 'Market Visit',
        },
        routeLocation: '',
        route: '',
      },
    ]);
  }, [territoryNameDDL]);

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      getEmployeeDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.employeeId,
        setEmployeeDDL,
      );
      GetTerritotoryWithLevelByEmpDDLNew(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        territoryInfo?.empLevelId,
        territoryInfo?.empTerritoryId,
        setTerritoryNameDDL,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    profileData?.accountId,
    selectedBusinessUnit?.value,
    territoryInfo?.empTerritoryId,
  ]);

  const setWeeklyCategoryHandler = (sl, value, name) => {
    const cloneArr = [...weeklyRowDto];
    cloneArr[sl][name] = value;
    setWeeklyRowDto([...cloneArr]);
  };

  const saveHandler = (values, cb) => {
    if (visitFlag?.routeWiseVisit) {
      let isValid = weeklyRowDto?.every((item) =>
        item?.routeCategory?.value &&
        item?.routeCategory?.label.toLowerCase() === 'leave'
          ? true
          : (item?.routeLocation || item?.routeLocation?.value) &&
            item?.routeCategory?.label.toLowerCase() === 'leave'
          ? true
          : item?.route || item?.route?.value,
      );

      const weeklyObj = weeklyRowDto?.map((itm, idx) => {
        return {
          intTourId: 0,
          intEmployeeId: values?.employee?.value,
          strCategory: itm?.routeCategory?.label || '',
          dteTourDate: values?.date,
          day: itm?.strDayName,
          intTerritoryId: itm?.routeLocation?.value || 0,
          strTerritoryName: itm?.routeLocation?.label || '',
          dteAttendanceTime: _todayDate(),
          intAttendanceLocationId: 0,
          strAttendanceLocationName: 'string',
          routeId: itm?.route?.value || 0,
          routeName: itm?.route?.label || '',
        };
      });
      const payload = {
        objCreateHeader: {
          intAccountId: profileData?.accountId,
          intBusinessUnitId: selectedBusinessUnit?.value,
          intEmployeeId: values?.employee?.value,
          intApproveBy: 0,
          dteCurrentDate: _todayDate(),
          dteTourMonth: values?.date,
          intActionBy: profileData?.userId,
        },
        objCreateRowList: weeklyObj,
      };

      if (isValid) {
        saveRoutePlanWeekWiseAction(payload, cb, setLoading);
      } else {
        Toast.show({
          text: 'Please add all row values',
          type: 'warning',
          duration: 3000,
        });
      }
    }
  };

  return (
    <>
      <ScrollView>
        <CommonTopBar title={'Create Route Plan'} />
        <>
          <View style={{paddingHorizontal: 10, marginTop: 10}}>
            <ScrollView>
              <Row colGap={5}>
                <Col width="50%">
                  <IDatePicker
                    label="Tour Month"
                    name="date"
                    onChange={(selectedDate) => {
                      formikprops.setFieldValue(
                        'date',
                        _dateFormatter(selectedDate),
                      );
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    label="Employee Name"
                    name="employee"
                    options={employeeDDL}
                    onChange={(valueOption) => {
                      getVisitWiseApi_Action(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setVisitFlag,
                      );

                      if (valueOption.level === 0) {
                        Toast.show({
                          text: 'Set Your Employee Level',
                          type: 'warning',
                          duration: 3000,
                        });
                      }

                      formikprops?.setFieldValue('employee', valueOption);
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="100%">
                  <CustomButton
                    onPress={formikprops.handleSubmit}
                    btnTxt={'Save'}
                    isLoading={loading}
                  />
                </Col>
              </Row>

              <>
                {/* Grid Data */}
                {visitFlag?.routeWiseVisit ? (
                  <View style={{paddingBottom: 10}}>
                    {weeklyRowDto?.map((item, index) => (
                      <Row colGap={5} key={index} style={[styles.cardStyle]}>
                        <Col
                          style={{
                            width: '50%',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text style={styles.dayNameStyle(item?.strDayName)}>
                              {item?.strDayName}
                            </Text>
                          </View>

                          <View>
                            <ICustomPicker
                              label="Category"
                              wrapperStyle={{
                                backgroundColor: 'whitesmoke',
                                marginTop: 0,
                              }}
                              value={item?.routeCategory}
                              onChange={(valueOption) => {
                                if (valueOption?.label === 'Leave') {
                                  setWeeklyCategoryHandler(
                                    index,
                                    '',
                                    'routeLocation',
                                  );
                                  setWeeklyCategoryHandler(index, '', 'route');
                                }
                                setWeeklyCategoryHandler(
                                  index,
                                  {
                                    value: valueOption?.value,
                                    label: valueOption?.label,
                                  },
                                  'routeCategory',
                                );
                              }}
                              name="routeCategory"
                              options={tourCategoryLocationDDL}
                              formikProps={formikprops}
                            />
                          </View>
                        </Col>

                        <Col
                          style={{
                            width: '50%',
                            alignItems: 'flex-end',
                          }}>
                          <View style={{width: '100%'}}>
                            <ICustomPicker
                              label="Market Visit Location"
                              wrapperStyle={{
                                backgroundColor: 'whitesmoke',
                                marginTop: 0,
                              }}
                              onChange={(valueOption) => {
                                setWeeklyCategoryHandler(index, '', 'route');
                                setWeeklyCategoryHandler(
                                  index,
                                  {
                                    value: valueOption?.value,
                                    label: valueOption?.label,
                                  },
                                  'routeLocation',
                                );
                                getRouteDDLModify(
                                  profileData?.accountId,
                                  selectedBusinessUnit?.value,
                                  valueOption?.value ||
                                    territoryNameDDL[0]?.value,
                                  index,
                                  routeDDL,
                                  setRouteDDL,
                                );
                              }}
                              name="routeLocation"
                              value={item?.routeLocation}
                              options={territoryNameDDL}
                              formikProps={formikprops}
                              disabled={
                                item?.routeCategory?.label.toLowerCase() ===
                                'leave'
                              }
                            />
                          </View>
                          <View style={{width: '100%'}}>
                            <ICustomPicker
                              label="Route"
                              wrapperStyle={{
                                backgroundColor: 'whitesmoke',
                                marginTop: 0,
                              }}
                              value={item?.route}
                              onChange={(valueOption) => {
                                setWeeklyCategoryHandler(
                                  index,
                                  {
                                    value: valueOption?.value,
                                    label: valueOption?.label,
                                  },
                                  'route',
                                );
                              }}
                              name="route"
                              options={routeDDL[index]}
                              formikProps={formikprops}
                              disabled={
                                item?.routeCategory?.label.toLowerCase() ===
                                'leave'
                              }
                            />
                          </View>
                        </Col>
                      </Row>
                    ))}
                  </View>
                ) : null}
              </>
            </ScrollView>
          </View>
          {landingData?.length === 0 && <NoDataFoundGrid />}
        </>
      </ScrollView>
      {landingData?.length === 0 ? (
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

export default CreateRoutePlanLanding;

const styles = StyleSheet.create({
  cardStyle: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  employeeName: {
    fontWeight: 'bold',
    color: 'black',
  },
  dayNameStyle: (strDayName) => {
    return {
      fontWeight: 'bold',
      fontSize: 18,
      flex: 1,
      textAlign: 'center',
      backgroundColor:
        strDayName?.toLowerCase() === 'friday' ? '#F87171' : btnBgSecondary,
      borderRadius: 5,
      padding: 5,
      color: 'white',
    };
  },
});

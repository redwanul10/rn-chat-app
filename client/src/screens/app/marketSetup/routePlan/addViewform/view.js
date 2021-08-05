/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {GlobalState} from '../../../../../GlobalStateProvider';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import {GetRoutePlanById} from '../helper';
import NoDataFoundGrid from '../../../../../common/components/NoDataFoundGrid';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';
import {globalStyles} from '../../../../../common/globalStyle/globalStyles';
import FabButton from '../../../../../common/components/FabButton';
import {Spinner} from 'native-base';
import {useFormik} from 'formik';
import CustomButton from '../../../../../common/components/CustomButton';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import IDatePicker from '../../../../../common/components/IDatePicker';
import {btnBgSecondary} from '../../../../../common/theme/color';
import {
  GetTerritotoryWithLevelByEmpDDLNew,
  getVisitWiseApi_Action,
  getRouteDDLModify,
  saveEditedRoutePlanMonthlyAction,
} from '../helper';

const initValues = {
  date: _todayDate(),
  employee: '',
};

function ViewRoutePlanLanding({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [landingData, setLandingData] = useState();
  const [singleData, setSingleData] = useState();
  const [loading, setLoading] = useState(false);
  const [visitFlag, setVisitFlag] = useState([]);

  // DDL
  const [territoryNameDDL, setTerritoryNameDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const tourCategoryLocationDDL = [
    {value: 1, label: 'Market Visit'},
    {value: 2, label: 'Leave'},
    {value: 3, label: 'Movement'},
    {value: 4, label: 'Meeting'},
  ];

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: singleData || initValues, // Single Data is manage from helper.js
    onSubmit: (values, actions) => {
      saveHandler(values);
    },
  });

  useEffect(() => {
    if (params?.id) {
      GetRoutePlanById(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        params?.employeeId,
        params?.id,
        setSingleData,
        setLandingData,
        // setWeeklyRowDto,
        setLoading,
      );
    }
  }, [
    profileData?.accountId,
    selectedBusinessUnit?.value,
    territoryInfo?.employeeId,
  ]);

  useEffect(() => {
    if (params?.id && formikprops?.values?.employee) {
      getVisitWiseApi_Action(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        formikprops?.values?.employee?.value,
        setVisitFlag,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikprops?.values?.employee]);

  const setWeeklyCategoryHandler = (sl, value, name) => {
    const cloneArr = [...landingData];
    cloneArr[sl][name] = value;
    setLandingData([...cloneArr]);
  };

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
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

  const saveHandler = (values) => {
    if (params?.employeeId && params?.id) {
      const editweekObj = landingData?.map((itm, idx) => {
        return {
          rowId: itm?.intRowId,
          tourId: itm?.intTourId,
          territoryId: itm?.routeLocation?.value,
          territoryName: itm?.routeLocation?.label,
          routeId: itm?.route?.value,
          routeName: itm?.route?.label,
        };
      });
      const payload = {
        objEditHeader: {
          intAccountId: profileData?.accountId,
          intBusinessUnitId: selectedBusinessUnit?.value,
          intApproveBy: 0,
          isApprove: true,
          dteTourMonth: values?.routeDate,
        },
        objEditRowList: editweekObj,
      };
      saveEditedRoutePlanMonthlyAction(payload, setLoading);
    }
  };

  return (
    <>
      <ScrollView>
        <CommonTopBar title={`${params?.type} Route Plan`} />
        <>
          <View style={{paddingHorizontal: 10, marginTop: 10}}>
            <ScrollView>
              <Row colGap={5}>
                <Col width="50%">
                  <IDatePicker
                    disabled={true}
                    label="Tour Month"
                    name="date"
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    label="Employee Name"
                    name="employee"
                    options={[]}
                    disabled={true}
                    formikProps={formikprops}
                  />
                </Col>
                {params?.type === 'Edit' ? (
                  <Col width="100%">
                    <CustomButton
                      onPress={formikprops.handleSubmit}
                      btnTxt={'Save'}
                    />
                  </Col>
                ) : null}
              </Row>

              <>
                {loading && <Spinner color="black" />}
                {params?.type === 'View' && (
                  <>
                    {landingData?.length > 0 ? (
                      <>
                        <Row style={[styles.cardStyle]}>
                          <Col style={{width: '50%'}}>
                            <Text
                              style={[
                                styles.employeeName,
                                globalStyles.fontSizeMedium,
                              ]}>
                              Day Name
                            </Text>
                            <Text style={globalStyles.fontSizeMini}>
                              Category
                            </Text>
                            <Text style={globalStyles.fontSizeMini}>
                              Tour Location
                            </Text>
                          </Col>

                          <Col
                            style={{
                              width: '50%',
                              alignItems: 'flex-end',
                            }}>
                            <Text style={{color: 'green', fontWeight: 'bold'}}>
                              Date
                            </Text>
                            <Text style={{color: 'black'}}>Route</Text>
                            <Text style={globalStyles.fontSizeMini}>
                              Distributor
                            </Text>
                          </Col>
                        </Row>
                      </>
                    ) : null}
                  </>
                )}

                {/* Grid Data View */}
                {params?.type === 'View' ? (
                  <View style={{paddingBottom: 10}}>
                    {landingData?.map((item, index) => (
                      <Row key={index} style={[styles.cardStyle]}>
                        <Col
                          style={{
                            width: '50%',
                          }}>
                          <Text
                            style={[
                              styles.employeeName,
                              globalStyles.fontSizeMedium,
                              {
                                color:
                                  item?.strDayName.toLowerCase() === 'friday'
                                    ? 'red'
                                    : 'black',
                              },
                            ]}>
                            {item?.strDayName}
                          </Text>
                          <Text
                            style={[
                              globalStyles.fontSizeMini,
                              {
                                color:
                                  item?.strDayName.toLowerCase() === 'friday'
                                    ? 'red'
                                    : 'black',
                              },
                            ]}>
                            {item?.strCategory}
                          </Text>
                          <Text style={[globalStyles.fontSizeMini]}>
                            {item?.territoryName}
                          </Text>
                        </Col>

                        <Col
                          style={{
                            width: '50%',
                            alignItems: 'flex-end',
                          }}>
                          <Text style={{color: 'green', fontWeight: 'bold'}}>
                            {_dateFormatter(item?.dteTourDate)}
                          </Text>
                          <Text style={{color: 'black'}}>
                            {item?.routeName || '-'}
                          </Text>
                          <Text style={globalStyles.fontSizeMini}>
                            {item?.distributorName || '-'}
                          </Text>
                        </Col>
                      </Row>
                    ))}
                  </View>
                ) : null}

                {/* Monthly */}
                {params?.type === 'Edit' ? (
                  <View style={{paddingBottom: 10}}>
                    {landingData?.map((item, index) => (
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
                            <View
                              style={styles.dayNameWrapper(item?.strDayName)}>
                              <Text
                                style={{
                                  color: 'white',
                                  fontSize: 16,
                                  fontWeight: 'bold',
                                }}>
                                {' '}
                                {item?.strDayName}{' '}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 13,
                                  color: 'white',
                                  fontWeight: 'bold',
                                }}>
                                {_dateFormatter(item?.dteTourDate)}
                              </Text>
                            </View>
                          </View>

                          <View>
                            <ICustomPicker
                              label="Category"
                              wrapperStyle={{
                                backgroundColor: 'whitesmoke',
                                marginTop: 0,
                              }}
                              value={item?.routeCategory}
                              name="routeCategory"
                              options={tourCategoryLocationDDL}
                              disabled={true}
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

export default ViewRoutePlanLanding;

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
  dayNameWrapper: (strDayName) => {
    return {
      width: '100%',
      alignItems: 'center',
      backgroundColor:
        strDayName?.toLowerCase() === 'friday' ? '#F87171' : btnBgSecondary,
      borderRadius: 5,
      padding: 5,
    };
  },
});

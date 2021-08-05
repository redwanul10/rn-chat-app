/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import {useFormik} from 'formik';
import {GlobalState} from '../../../../GlobalStateProvider';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import IDatePicker from '../../../../common/components/IDatePicker';
import {_todayDate} from '../../../../common/functions/_todayDate';
import {getRoutePlanLanding} from './helper';
import NoDataFoundGrid from '../../../../common/components/NoDataFoundGrid';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import {globalStyles} from '../../../../common/globalStyle/globalStyles';
import FabButton from '../../../../common/components/FabButton';
import {TouchableOpacity} from 'react-native';
import MiniButton from '../../../../common/components/MiniButton';
import {useIsFocused} from '@react-navigation/native';
import {Spinner} from 'native-base';

const initValues = {
  date: _todayDate(),
};

function RoutePlanLanding({navigation}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [landingData, setLandingData] = useState();
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: initValues,
    onSubmit: (values, actions) => {
      viewHandler(values);
    },
  });

  const viewHandler = (values) => {
    if (
      (profileData?.accountId,
      selectedBusinessUnit?.value,
      territoryInfo?.employeeId)
    ) {
      getRoutePlanLanding(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        territoryInfo?.employeeId,
        setLoading,
        values?.date,
        setLandingData,
      );
    }
  };

  useEffect(() => {
    viewHandler(formikprops?.values);
  }, [isFocused]);

  useEffect(() => {
    viewHandler(formikprops?.values);
  }, [formikprops?.values?.date]);

  return (
    <>
      <ScrollView>
        <CommonTopBar title={'Route Plan'} />
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
              </Row>

              <>
                {loading && <Spinner color="black" />}
                {landingData?.length > 0 ? (
                  <>
                    <Row style={[styles.cardStyle]}>
                      <Col style={{width: '50%'}}>
                        <Text
                          style={[
                            styles.employeeName,
                            globalStyles.fontSizeMedium,
                          ]}>
                          Employee Name
                        </Text>
                        <Text style={globalStyles.fontSizeMini}>
                          Distribution Channel
                        </Text>
                      </Col>

                      <Col
                        style={{
                          width: '50%',
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          style={[
                            {
                              color: 'green',
                              fontWeight: 'bold',
                            },
                            globalStyles.fontSizeMini,
                          ]}>
                          Approve Status
                        </Text>
                      </Col>
                    </Row>
                  </>
                ) : null}

                {/* Grid Data */}
                <View style={{paddingBottom: 10}}>
                  {landingData?.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('viewRoutePlanLanding', {
                          id: item?.tourId,
                          type: 'View',
                          employeeId: item?.employeeId,
                        });
                      }}
                      key={index}>
                      <Row key={index} style={[styles.cardStyle]}>
                        <Col style={{width: '50%'}}>
                          <Text
                            style={[
                              styles.employeeName,
                              globalStyles.fontSizeMedium,
                            ]}>
                            {item?.employeeName}
                          </Text>

                          <Text style={globalStyles.fontSizeMini}>
                            {item?.distributionChannelName}
                          </Text>
                        </Col>

                        <Col
                          style={{
                            width: '50%',
                          }}>
                          <Text
                            style={[
                              {
                                color: 'green',
                                fontWeight: 'bold',
                                textAlign: 'right',
                              },
                              globalStyles.fontSizeMini,
                            ]}>
                            {item?.status}
                          </Text>
                          <MiniButton
                            btnText="Edit"
                            onPress={() => {
                              if (item?.status.toLowerCase() !== 'approved') {
                                navigation.navigate('viewRoutePlanLanding', {
                                  id: item?.tourId,
                                  type: 'Edit',
                                  employeeId: item?.employeeId,
                                });
                              }
                            }}
                          />
                        </Col>
                      </Row>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            </ScrollView>
          </View>
          {landingData?.length === 0 && <NoDataFoundGrid />}
        </>
      </ScrollView>
      {landingData?.length === 0 ? (
        <FabButton
          onPress={() =>
            navigation.navigate('createRoutePlanLanding', {
              ...formikprops?.values,
              type: 'create',
            })
          }
        />
      ) : null}
    </>
  );
}

export default RoutePlanLanding;

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
});

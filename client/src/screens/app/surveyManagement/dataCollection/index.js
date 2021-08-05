/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import {useFormik} from 'formik';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import IDatePicker from '../../../../common/components/IDatePicker';
import {_todayDate} from '../../../../common/functions/_todayDate';
import {getLandingData} from './helper';
import NoDataFoundGrid from '../../../../common/components/NoDataFoundGrid';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import {globalStyles} from '../../../../common/globalStyle/globalStyles';
import MiniButton from '../../../../common/components/MiniButton';
import {Spinner} from 'native-base';
import FabButton from '../../../../common/components/FabButton';
import {useIsFocused} from '@react-navigation/native';
import {GlobalState} from '../../../../GlobalStateProvider';
import {useContext} from 'react';

const initValues = {
  date: _todayDate(),
};

function DataCollection({navigation}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [landingData, setLandingData] = useState();
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: initValues,
    // onSubmit: (values, actions) => {
    //   viewHandler(values);
    // },
  });

  useEffect(() => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      formikprops?.values?.date,
      setLandingData,
      null,
    );
  }, [isFocused]);

  return (
    <>
      <ScrollView>
        <CommonTopBar title={'Data Collection'} />
        <>
          <View style={{paddingHorizontal: 10, marginTop: 10}}>
            <ScrollView>
              <Row colGap={5}>
                <Col width="50%">
                  <IDatePicker
                    label="Date"
                    name="date"
                    onChange={(selectedDate) => {
                      formikprops.setFieldValue(
                        'date',
                        _dateFormatter(selectedDate),
                      );
                      // Fetch Landing Data
                      getLandingData(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        _dateFormatter(selectedDate),
                        setLandingData,
                        setLoading,
                      );
                    }}
                    formikProps={formikprops}
                  />
                </Col>
              </Row>
              <>
                <Row style={[styles.cardStyle, {marginTop: 0}]}>
                  <Col style={{width: '50%'}}>
                    <Text
                      style={[
                        styles.employeeName,
                        globalStyles.fontSizeMedium,
                      ]}>
                      Outlet Name
                    </Text>
                    <Text style={globalStyles.fontSizeMini}>Survey Name</Text>
                  </Col>

                  <Col
                    style={{
                      width: '50%',
                      alignItems: 'flex-end',
                    }}>
                    <Text style={[globalStyles.fontSizeMini, {fontSize: 15}]}>
                      Address
                    </Text>
                    <MiniButton
                      onPress={() => {
                        // console.log('View Click');
                      }}
                      btnText={'Action'}
                    />
                  </Col>
                </Row>

                {/* Loading Spinner */}
                {loading && <Spinner color="black" />}

                {/* Grid Data */}
                <View style={{paddingBottom: 10}}>
                  {landingData?.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        navigation.navigate('createDataCollection', {
                          ...formikprops?.values,
                          id: item?.surveyDataHeaderId,
                          type: 'View',
                        });
                      }}>
                      <Row key={index} style={[styles.cardStyle]}>
                        <Col style={{width: '50%'}}>
                          <Text
                            style={[
                              styles.employeeName,
                              globalStyles.fontSizeMedium,
                            ]}>
                            {item?.strOutletName}
                          </Text>

                          <Text style={globalStyles.fontSizeMini}>
                            {item?.strSurveyName}
                          </Text>
                        </Col>

                        <Col
                          style={{
                            width: '50%',
                            alignItems: 'flex-end',
                          }}>
                          <Text
                            style={[
                              globalStyles.fontSizeMini,
                              {fontSize: 15, textAlign: 'right'},
                            ]}>
                            {item?.lladdress}
                          </Text>
                          <MiniButton
                            onPress={() => {
                              navigation.navigate('createDataCollection', {
                                ...formikprops?.values,
                                id: item?.surveyDataHeaderId,
                                type: 'View',
                              });
                            }}
                            btnText={'View'}
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

      {formikprops?.values?.date ? (
        <FabButton
          onPress={() =>
            navigation.navigate('createDataCollection', {
              ...formikprops?.values,
              type: 'Create',
            })
          }
        />
      ) : null}
    </>
  );
}

export default DataCollection;

const styles = StyleSheet.create({
  cardStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  totalSection: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  employeeName: {
    fontWeight: 'bold',
    color: 'black',
  },
});

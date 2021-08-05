import React, {useEffect, useState, useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Spinner} from 'native-base';
import Map from './components/Map';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import {GlobalState} from '../../../../GlobalStateProvider';
import {
  checkIn,
  checkOut,
  getCheckInCheckOutTime,
  getCheckInCheckOutTimeHistory,
} from './helper';
import {_todayDate} from '../../../../common/functions/_todayDate';
import getGeoLocation from '../../../../common/functions/getGeoLocation';
import {getII_address} from '../../../../common/actions/helper';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import {timeFormatter} from '../../../../common/functions/timeFormatter';
import Text from '../../../../common/components/IText';
import {globalStyles} from '../../../../common/globalStyle/globalStyles';

const CheckInOut = () => {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [location, setLocation] = useState({});
  const [IIaddress, setIIaddress] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [checkInOutTime, setcheckInOutTime] = useState({});
  const [checkInOutTimeHistory, setcheckInOutTimeHistory] = useState([]);

  useEffect(() => {
    getGeoLocation(setLocation, setIsLocationLoading);
  }, []);

  // Get redable Address from (lat,lng)
  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      getII_address(setIIaddress, location?.latitude, location?.longitude);
    }
  }, [location]);

  const getCheckInCheckOutTime_action = () => {
    getCheckInCheckOutTime(
      profileData?.employeeId,
      _todayDate(),
      setcheckInOutTime,
    );
    getCheckInCheckOutTimeHistory(
      profileData?.employeeId,
      _todayDate(),
      setcheckInOutTimeHistory,
    );
  };

  useEffect(() => {
    getCheckInCheckOutTime_action();
  }, []);

  const saveHandler = (status) => {
    const payload = {
      intAccountId: profileData?.accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      intBusinessPartnerId: 0,
      strBusinessPartnerCode: '',
      intEmployeeId: profileData?.employeeId,
      numAttendanceLatitude: location?.latitude || 0,
      numAttendanceLongitude: location?.longitude || 0,
      address: IIaddress,
      intActionBy: profileData.userId,
    };

    if (status === 'Check-In') {
      checkIn(payload, setIsLoading, getCheckInCheckOutTime_action);
    } else {
      checkOut(payload, setIsLoading, getCheckInCheckOutTime_action);
    }
  };

  return (
    <>
      <CommonTopBar />

      <ScrollView 
      showsVerticalScrollIndicator={false} 
      style={style.container}
      bounces={false}
      >
        {/* Today Date */}
        <View style={{marginVertical: 20}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={style.boldText}>Today</Text>
            <Text style={style.text}>{new Date().toDateString()}</Text>
          </View>
        </View>

        <View>
          {location?.latitude && (
            <>
              <Text style={style.boldText}>My Location</Text>
              <Map
                location={location}
                lat={location.latitude}
                long={location.longitude}
                userName={''}
              />
            </>
          )}

          {isLocationLoading && (
            <View style={style.spinnerText}>
              <Text>Getting Your Loaction....</Text>
              <Spinner color="black" style={style.mediumSpinner} />
            </View>
          )}

          {location?.latitude && (
            <View>
              {checkInOutTime &&
              checkInOutTime?.checkInTime?.length !==
                checkInOutTime?.checkOutTime?.length ? (
                <Button
                  block
                  style={style.checkInOutButton}
                  onPress={(e) => saveHandler('Check-Out')}>
                  <Text style={style.btnText}>Check-Out</Text>
                  {isLoading && <Spinner color="white" style={style.spinner} />}
                </Button>
              ) : (
                <Button
                  block
                  style={style.checkInOutButton}
                  onPress={(e) => saveHandler('Check-In')}>
                  <Text style={style.btnText}>Check-In</Text>
                  {isLoading && <Spinner color="white" style={style.spinner} />}
                </Button>
              )}
            </View>
          )}

          {/* check in out card section */}
          <Row>
            <Col width="100%" style={{marginTop: 10}}>
              {/* <Text>{JSON.stringify(checkInOutTimeHistory, null, 2)}</Text> */}
              {checkInOutTimeHistory?.map((item, index) => (
                <View>
                  {item?.time ? (
                    <View
                      style={[
                        globalStyles.cardStyle,
                        {paddingVertical: 10, marginVertical: 5},
                      ]}>
                      <View style={{alignItems: 'flex-start'}}>
                        {item?.remarks === 'AI' ? (
                          <Text style={{fontWeight: 'bold', color: 'green'}}>
                            Check In
                          </Text>
                        ) : (
                          <Text style={{fontWeight: 'bold', color: 'red'}}>
                            Check Out
                          </Text>
                        )}

                        <Text style={{fontWeight: 'bold'}}>
                          Time:{timeFormatter(item?.time)}
                        </Text>
                        <Text>Location:{item?.address}</Text>
                      </View>
                    </View>
                  ) : null}
                </View>
              ))}
            </Col>
          </Row>
        </View>
      </ScrollView>
    </>
  );
};

export default CheckInOut;

const style = StyleSheet.create({
  checkInOutHistory: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    marginVertical: 10,
    borderColor: 'blue',
    borderWidth: 1,
  },
  checkInOutButton: {
    backgroundColor: '#063197',
    borderRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    paddingHorizontal: 20,
  },
  boldText: {
    marginBottom: 8,
  },
  btnText: {
    textTransform: 'uppercase',
    color: 'white',
  },
  spinner: {
    transform: [{scaleX: 0.6}, {scaleY: 0.6}],
  },
  mediumSpinner: {
    marginTop: -10,
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
  },
  spinnerText: {justifyContent: 'center', alignItems: 'center'},
});

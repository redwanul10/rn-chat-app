import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, StyleSheet, Image} from 'react-native';
import CommonTopBar from '../../../common/components/CommonTopBar';
import {getLeaveLandingData} from './helper';
import {useIsFocused} from '@react-navigation/native';
import {_dateFormatter} from '../../../common/functions/_dateFormatter';

const title = 'Leave';
function Leave(props) {
  const [loading, setLoading] = useState([]);
  const [landingData, setLandingData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      let empId = 509745;
      getLeaveLandingData(empId, setLoading, setLandingData);
    }
  }, [isFocused]);
  return (
    <>
      <ScrollView>
        <CommonTopBar title={title} />
        <View
          style={{
            backgroundColor: '#448B92',
            marginHorizontal: 10,
            marginVertical: 20,
            alignItems: 'center',
            paddingVertical: 15,
          }}>
          <View style={styles.leaveStyle}>
            <View>
              <View style={styles.leaveBox}>
                <Text style={[styles.textColor]}>4/3</Text>
              </View>
              <Text style={[styles.textColor, {width: 70}]}>Casual Leave</Text>
            </View>

            <View>
              <View style={styles.leaveBox}>
                <Text style={styles.textColor}>4/3</Text>
              </View>
              <Text style={[styles.textColor, {width: 70}]}>Medical Leave</Text>
            </View>
            <View>
              <View style={styles.leaveBox}>
                <Text style={styles.textColor}>4/3</Text>
              </View>
              <Text style={styles.textColor}>PL</Text>
            </View>
          </View>
          <View style={styles.leaveStyle}>
            <View>
              <View style={styles.leaveBox}>
                <Text style={[styles.textColor]}>4/3</Text>
              </View>
              <Text style={[styles.textColor, {width: 70}]}>
                Maternal Leave
              </Text>
            </View>

            <View>
              <View style={styles.leaveBox}>
                <Text style={styles.textColor}>4/3</Text>
              </View>
              <Text style={styles.textColor}>LWP</Text>
            </View>
            <View>
              <View style={styles.leaveBox}>
                <Text style={styles.textColor}>4/3</Text>
              </View>
              <Text style={styles.textColor}>BV Leave</Text>
            </View>
          </View>
        </View>

        {landingData?.data?.map((item, index) => (
          <View
            key={index}
            style={{
              elevation: 5,
              borderRadius: 7,
              backgroundColor: '#ffffff',
              marginHorizontal: 10,
              padding: 10,
              marginBottom: 5,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{marginVertical: 20, marginLeft: 5}}>
                <Text style={{fontWeight: 'bold'}}>{item?.moveType}</Text>
                <Text>#{item?.id}</Text>
              </View>
              <View style={{marginBottom: 20, marginLeft: 40}}>
                <Text>Reason</Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    width: 120,
                  }}>
                  {item?.reason}
                </Text>
              </View>

              <View
                style={{
                  padding: 5,
                  backgroundColor: 'lightgreen',
                  borderRadius: 8,
                }}>
                <Text style={{color: '#448B92'}}>{item?.status}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={{marginLeft: 5, marginTop: -5, marginRight: -5}}
                source={require('../../../assets/calendar.png')}
              />
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: -15,
                }}>
                <Text>From-Date</Text>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>
                  {_dateFormatter(item?.startTime)}
                </Text>
              </View>
              <View
                style={{
                  marginTop: -15,
                }}>
                <Text> To-Date</Text>
                <Text style={{fontWeight: 'bold'}}>
                  {' '}
                  {_dateFormatter(item?.endTime)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

export default Leave;
const styles = StyleSheet.create({
  leaveStyle: {
    flexDirection: 'row',
  },
  textColor: {
    color: '#ffffff',
    alignSelf: 'center',
    marginHorizontal: 5,
  },
  leaveBox: {
    width: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 5,
    alignItems: 'center',
    paddingVertical: 10,
    margin: 3,
  },
});

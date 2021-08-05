import React, {useEffect, useState, useContext} from 'react';
import {ScrollView, StyleSheet, View, TouchableOpacity} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {getLandingData} from '../helper';
import {useIsFocused} from '@react-navigation/native';
import {GlobalState} from '../../../../../GlobalStateProvider';
import FabButton from '../../../../../common/components/FabButton';
import Text from '../../../../../common/components/IText';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';

function LandingBeat({navigation}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [landingData, setLandingData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getLandingData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        0,
        0,
        setLandingData,
      );
    }
  }, [isFocused]);
  return (
    <>
      <ScrollView>
        {/* top bar */}
        <CommonTopBar title={'Beat'} />
        <View style={{marginTop: 10}}>
          <Row style={styles.commonCard} colGap={5}>
            <Col style={{alignItems: 'flex-start'}} width="50%">
              <Text style={[styles.teritoryText, {fontWeight: 'bold'}]}>
                Beat Name
              </Text>
              <Text style={styles.teritoryText}>Territory</Text>
            </Col>
            <Col style={{alignItems: 'flex-end'}} width="50%">
              <Text style={styles.teritoryText}>Route</Text>
              <View>
                <Text
                  style={[
                    styles.editButton,
                    {marginTop: 5, textAlign: 'center'},
                  ]}>
                  Action
                </Text>
              </View>
            </Col>
          </Row>
        </View>
        {landingData?.data?.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate('View Beat', {id: item?.beatId})
            }>
            <Row style={styles.commonCard} colGap={5}>
              <Col style={{alignItems: 'flex-start'}} width="50%">
                <Text style={[styles.teritoryText, {fontWeight: 'bold'}]}>
                  {item?.beatName}
                </Text>
                <Text style={styles.teritoryText}>
                  {item?.territoryName || 'Territory Name'}
                </Text>
              </Col>
              <Col style={{alignItems: 'flex-end'}} width="50%">
                <Text style={styles.teritoryText}>
                  {item?.routeName || 'Route Name'}
                </Text>
                <View>
                  <TouchableOpacity
                    onPress={(e) =>
                      navigation.navigate('Edit Beat', {id: item?.beatId})
                    }>
                    <Text
                      style={[
                        styles.editButton,
                        {marginTop: 5, textAlign: 'center'},
                      ]}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </Col>
            </Row>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FabButton
        onPress={() => navigation.navigate('Create Beat')}
        bgColor="#FFD34E"
      />
    </>
  );
}

export default LandingBeat;

const styles = StyleSheet.create({
  commonCard: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  editButton: {
    color: 'white',
    backgroundColor: '#00cdac',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 2,
  },
});

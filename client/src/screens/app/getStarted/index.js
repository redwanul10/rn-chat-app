import React from 'react';
import {
  View,
  // Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Text from '../../../common/components/IText';

export default function GetStarted({navigation}) {
  return (
    <>
      <ScrollView
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* get started page image */}
        <Image
          style={styles.imageStyle}
          source={require('../../../assets/get_started.png')}
        />

        {/* get started page texts */}
        <View style={{alignSelf: 'flex-start', marginLeft: '15%'}}>
          <Text style={styles.headText}>Manage your Market</Text>
          <Text style={styles.subHeadText}>From Route To Market</Text>
        </View>

        {/* get started page button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Log in')}
          style={styles.getStartBtn}>
          <Text style={{color: '#ffffff',}}>
            GET STARTED
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    alignSelf: 'center',
    marginVertical: '20%',
  },
  headText: {
    color: '#2F3542',
    fontSize: 40,
    // fontFamily: 'HelveticaNeueHv',
  },
  subHeadText: {
    color: '#8F9BB3',
    fontSize: 15,
    marginVertical: '4%',
    // fontFamily: 'HelveticaNeueBd',
  },

  getStartBtn: {
    backgroundColor: '#063197',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
    height: 50,
    borderRadius: 7,
    marginBottom: 3,
  },
});

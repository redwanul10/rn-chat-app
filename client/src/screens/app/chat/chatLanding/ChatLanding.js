import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonTopBar from '../../../../common/components/CommonTopBar';

const ChatLanding = ({navigation}) => {
  return (
    <>
      <ScrollView>
        {/* Top bar */}
        <CommonTopBar title="Chat" />

        {/* Top Button */}
        <View style={styles.main}>
          <View style={styles.btnView}>
            <TouchableOpacity
              style={{...styles.btn, backgroundColor: '#063197'}}>
              <Text style={{...styles.btnText, color: '#ffffff'}}>
                Recent Message
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.btn,
                marginLeft: 10,
                backgroundColor: '#E0E0E0',
              }}>
              <Text style={{...styles.btnText, color: 'black'}}>Active</Text>
            </TouchableOpacity>
          </View>

          {/* Chat Section */}
          <View style={styles.chtBox}>
            <Image
              style={styles.chtImages}
              source={require('../../../../assets/avatar.png')}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('privateChat', {
                  data: {
                    name: 'Daveon Lane',
                    id: 100,
                  },
                })
              }>
              <View style={styles.chtContent}>
                <View>
                  <Text style={styles.chtHead}>Daveon Lane</Text>
                  <Text>Thank you for your kind response.</Text>
                </View>
                <Text style={{paddingLeft: 65}}>3m</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default ChatLanding;

const styles = StyleSheet.create({
  main: {
    marginHorizontal: 10,
    // backgroundColor: '#FFFFFF',
  },
  btnView: {
    flexDirection: 'row',
  },
  btn: {
    marginVertical: 15,
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  chtBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  chtContent: {
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  chtImages: {height: 50, width: 50},
  chtHead: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

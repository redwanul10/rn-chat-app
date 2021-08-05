import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from 'react-native';
import ChatTopBar from './ChatTopBar';
import fakeData from './fakeData';

export default function PrivateChat({
  route: {
    params: {data},
  },
}) {
  return (
    <>
      <ChatTopBar name={data?.name} />
      <View style={styles.tSection}></View>
      <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.messageContainer}>
          {fakeData.map((msg, i) => (
            <View
              key={i + ''}
              style={
                msg?.id === data?.id
                  ? {alignItems: 'flex-start'}
                  : {alignItems: 'flex-end'}
              }>
              <View
                style={
                  msg?.id === data?.id
                    ? styles.message
                    : {...styles.message, justifyContent: 'flex-end'}
                }>
                {msg?.id === data?.id && (
                  <Image
                    style={styles.img}
                    source={require('../../../../assets/userImg.png')}
                  />
                )}
                <View>
                  <Text
                    style={
                      msg?.id === data?.id
                        ? styles.text
                        : {
                            ...styles.text,
                            backgroundColor: '#2159bf',
                            color: 'white',
                          }
                    }>
                    {msg.message}
                  </Text>
                  {/* {msg?.id === data?.id && (
                    <Text style={{fontSize: 9, marginLeft: 15}}>
                      English to bengali
                    </Text>
                  )} */}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: 20,
          paddingVertical: 18,
        }}>
        <View style={styles.textInput}>
          <TextInput
            style={{fontWeight: '600', fontSize: 15}}
            placeholderTextColor="grey"
            placeholder="Type a message"
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  textInput: {
    backgroundColor: '#edefef',
    color: 'black',
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: 'white',
    // minHeight: 500,
  },

  img: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    backgroundColor: '#edefef',
    padding: 10,
    borderRadius: 40,
  },

  message: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 5,
    width: '90%',
    marginTop: 0,
  },
  tSection: {
    backgroundColor: 'white',
    paddingBottom: 1,
    width: '100%',
    paddingHorizontal: 30,
    shadowColor: 'gray',
    shadowOffset: {height: 1, width: 1},
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 2,
    overflow: 'hidden',
  },
});

import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import AIcon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const ChatTopBar = ({name, img}) => {
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AIcon size={25} name="left" />
        </TouchableOpacity>
        <View style={styles.userDiv}>
          <View style={styles.imageWrapper}>
            <Image
              style={styles.img}
              source={require('../../../../assets/userImg.png')}
            />
          </View>

          <Text style={{fontSize: 18, fontWeight: '600'}}>
            {name || 'Someone'}
          </Text>
        </View>

        {/* <View style={styles.selector}>
          <Text style={{fontSize: 18, fontWeight: '600', marginRight: 10}}>
            English
          </Text>
          <AIcon size={15} name="down" />
        </View> */}
      </View>
      {/* <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          backgroundColor: 'white',
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}>
        Auto English Translator
      </Text> */}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  imageWrapper: {
    marginRight: 10,
    backgroundColor: '#edefef',
    padding: 5,
    borderRadius: 50,
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  userDiv: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '55%',
    marginLeft: 20,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ChatTopBar;

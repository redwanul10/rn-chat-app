import React, {useContext} from 'react';
import {ListItem, List, Thumbnail} from 'native-base';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {GlobalState} from '../../GlobalStateProvider';
import IconTwo from 'react-native-vector-icons/FontAwesome';

function User() {
  const {profileData} = useContext(GlobalState);

  return (
    <>
      <List>
        <ListItem
          avatar
          style={{marginVertical: 15, justifyContent: 'space-between'}}>
          {/* <Thumbnail source={require('../../assets/avatar.png')} /> */}

          <View style={{flexDirection: 'row'}}>
            <View style={{marginRight: 15}}>
              <IconTwo name="user-circle" size={40} color="#ffffff" />
            </View>
            <View style={{width: '100%'}}>
              <Text style={styles.userStyle}>
                Welcome-
                {profileData?.userName}
              </Text>
              <Text style={{color: '#fff'}}>Sales Employee</Text>
            </View>
          </View>

          {/* <Icon name="bell" size={30} color="#fff" style={{marginLeft: -35}} /> */}
        </ListItem>
      </List>
    </>
  );
}

export default User;
const styles = StyleSheet.create({
  userStyle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    width: '80%',
  },
});

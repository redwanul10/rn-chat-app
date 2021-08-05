import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity,SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconTwo from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { headerBgPrimary } from '../theme/color';


function CommonTopBar(props) {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <SafeAreaView>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#ffffff" />
        </TouchableOpacity>

        <Text style={{ color: '#ffffff', fontSize: 15 }}>
          {props.title || route.name}
        </Text>


        {/* <TouchableOpacity>
          <IconTwo name="camera" size={30} color="#ffffff" />
        </TouchableOpacity> */}
        {props?.rightIcon
          ? props?.rightIcon()
          : (
            <TouchableOpacity>
              <IconTwo name="search" size={30} color="#ffffff" />
            </TouchableOpacity>
          )}
      </View>
    </SafeAreaView>
  );
}

export default CommonTopBar;
const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    backgroundColor: headerBgPrimary,
    justifyContent: 'space-between',
    padding: 12,
    alignItems: 'center',
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
});

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const ItemCard = ({item, action, navigation}) => {
  return (
    <>
      <TouchableOpacity
        onPress={() =>
          navigation &&
          navigation.navigate('View Route', {
            id: item?.routeId,
          })
        }>
        <View style={styles.cardContainer}>
          <View>
            <Text style={styles.textBold}>
              {item?.routeName || 'Route Name'}
            </Text>
            <Text>{item?.territoryName || 'Territory'}</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{...styles.textBold, color: 'green'}}>
              {item?.startOutletName || 'Start Outlet Name'}
            </Text>
            <Text style={styles.textBold}>
              {item?.endOutletName || 'End Outlet Name'}
            </Text>
            {action ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Edit Route', {
                    id: item?.routeId,
                  })
                }>
                <Text style={styles.actionBtn}>{action}</Text>
              </TouchableOpacity>
            ) : (
              <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.actionBtn}>Action</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 7,
    // elevation: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textBold: {
    fontWeight: '700',
    fontSize: 16,
    paddingBottom: 3,
  },
  actionBtn: {
    color: 'white',
    backgroundColor: '#00cdac',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 2,
  },
});

export default ItemCard;

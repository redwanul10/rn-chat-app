import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/app/homeScreen';
import Menu from '../screens/app/menu';
import Feather from 'react-native-vector-icons/Feather';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, Text, StyleSheet} from 'react-native';
import {
  tabBgPrimary,
  tabActiveColor,
  tabInactiveColor,
} from '../common/theme/color';
import LandingSecondary from '../screens/app/retailOrderManagement/secondaryOrder/landing';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        labelStyle: {
          marginBottom: 10,
        },
        safeAreaInsets: {
          bottom: 0,
        },
        style: {
          height: 60,
        },
        tabStyle: {
          justifyContent: 'center',
          backgroundColor: tabBgPrimary,
        },
        activeTintColor: tabActiveColor,
        inactiveTintColor: tabInactiveColor,
      }}>
      <Tab.Screen
        options={{
          /* Old Menu Code */
          // tabBarIcon: ({color, focused, size}) => (
          //   <View
          //     style={{
          //       borderBottomWidth: focused ? 4 : 0,
          //       alignItems: 'center',
          //       height: '100%',
          //       paddingTop: 10,
          //       width: '100%',
          //       borderColor: color,
          //     }}>
          //     <AntDesign name="home" size={size} color={color} />
          //   </View>
          // ),
          tabBarLabel: ({color, focused}) => {
            return (
              <View style={styles.tabStyle(focused, color)}>
                <Material name="home" size={23} color={color} />
                <Text style={styles.tabTextStyle(color)}>Home</Text>
              </View>
            );
          },
        }}
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          /* Old Menu Code */
          // tabBarIcon: ({color, size}) => (
          //   <Feather name="box" size={size} color={color} />
          // ),
          tabBarLabel: ({color, focused}) => {
            return (
              <View style={styles.tabStyle(focused, color)}>
                <Feather name="box" size={23} color={color} />
                <Text style={styles.tabTextStyle(color)}>Retail Order</Text>
              </View>
            );
          },
        }}
        name="Retail Order"
        component={LandingSecondary}
      />
      {/* <Tab.Screen
        options={{
          tabBarIcon: ({color, size}) => (
            <AntDesign name="filetext1" size={size} color={color} />
          ),
        }}
        name="Report"
        component={HomeScreen}
      /> */}
      <Tab.Screen
        options={{
          /* Old Menu Code */
          // tabBarIcon: ({color, size}) => (
          //   <AntDesign name="menufold" size={size} color={color} />
          // ),
          tabBarLabel: ({color, focused}) => {
            return (
              <View style={styles.tabStyle(focused, color)}>
                <Material name="menu" size={23} color={color} />
                <Text style={styles.tabTextStyle(color)}>Menu</Text>
              </View>
            );
          },
        }}
        name="Menu"
        component={Menu}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabStyle: (focused, color) => {
    return {
      borderBottomWidth: focused ? 2 : 0,
      alignItems: 'center',
      height: '100%',
      paddingTop: 7,
      width: '100%',
      borderColor: color,
    };
  },
  tabTextStyle: (color) => {
    return {color: color, fontSize: 11, marginTop: 4};
  },
});

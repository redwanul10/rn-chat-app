/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {logoutAction} from './helper';
import User from '../../../common/components/User';
import {GlobalState} from '../../../GlobalStateProvider';
import Row from '../../../common/components/Row';
import Col from '../../../common/components/Col';
import {headerBgPrimary} from '../../../common/theme/color';
// import Text from '../../../common/components/IText';
import {globalStyles} from '../../../common/globalStyle/globalStyles';
const menu = [
  {
    label: ' Retail Order',
    link: 'Landing Secondary',
    img: require('../../../assets/menu/ratailOrder.png'),
    permission: 'All',
  },
  {
    label: 'Retail Delivery',
    link: 'Delivery',
    img: require('../../../assets/menu/retailDelivery.png'),
    permission: 'SO',
  },
  {
    label: 'Retail Collection',
    link: 'Retail Collection',
    img: require('../../../assets/menu/collection.png'),
    permission: 'SO',
  },
  {
    label: 'Sales Collection',
    link: 'Sales Collection',
    img: require('../../../assets/menu/collection.png'),
    permission: 'TSM',
  },
  {
    label: 'Calendar',
    link: 'Calendar',
    img: require('../../../assets/menu/attendance.png'),
    permission: 'All',
  },
  {
    label: 'Outlet Profile Registration',
    link: 'Outlet Profile Reg Landing',
    img: require('../../../assets/menu/outletreg.png'),
    permission: 'All',
  },
  // {
  //   label: 'Outlet Registration',
  //   link: 'Out Let Reg Landing',
  //   img: require('../../../assets/menu/outletreg.png'),
  //   permission: 'All',
  // },
  // {
  //   label: 'Outlet Approve',
  //   link: 'Outlet Approve',
  //   img: require('../../../assets/menu/approve.png'),
  //   permission: 'TSM',
  // },
  {
    label: 'Register Outlet Approval',
    link: 'Register Outlet Approval',
    img: require('../../../assets/menu/approve.png'),
    permission: 'TSM',
  },
  {
    label: 'Outlet HE Setup',
    link: 'Outlet HE Setup',
    img: require('../../../assets/menu/heSetup.png'),
    permission: 'TSM',
  },
  // {
  //   label: 'Outlet Bill Request',
  //   link: 'Outlet Bill Request',
  //   img: require('../../../assets/menu/outletBill.png'),
  //   permission: 'All',
  // },
  {
    label: 'Route Setup',
    link: 'Route Setup',
    img: require('../../../assets/menu/route.png'),
    permission: 'TSM',
  },
  {
    label: 'Beat',
    link: 'Landing Beat',
    img: require('../../../assets/menu/market.png'),
    permission: 'TSM',
  },
  {
    label: 'Damage Collection',
    link: 'Damage Collection',
    img: require('../../../assets/menu/retailDelivery.png'),
    permission: 'SO',
  },
  {
    label: 'Damage Replace',
    link: 'Damage Replace',
    img: require('../../../assets/menu/market.png'),
    permission: 'SO',
  },
  {
    label: 'Asset Request',
    link: 'assetRequest',
    img: require('../../../assets/menu/companyAssets.png'),
    permission: 'SO',
  },
  {
    label: 'Asset Request Field Employee',
    link: 'Asset Request Field Employee',
    img: require('../../../assets/menu/assetRequestField.png'),
    permission: 'All',
  },
  {
    label: 'Asset Approval',
    link: 'assetRequestApproval',
    img: require('../../../assets/menu/companyAssets.png'),
    permission: 'TSM',
  },
  {
    label: 'Supervisor Asset Approval',
    link: 'Supervisor Asset Approval',
    img: require('../../../assets/menu/approve2.png'),
    permission: 'All',
  },
  /* Menu Remove | Assign by Emdadul Haque (Backend) */
  // {
  //   label: 'Asset Maintenance',
  //   link: 'assetMaintenance',
  //   img: require('../../../assets/menu/assetMaintenance.png'),
  //   permission: 'All',
  // },
  {
    label: 'Asset Receive',
    link: 'Outlet Asset Receive',
    img: require('../../../assets/menu/assetReceive.png'),
    permission: 'All',
  },
  {
    label: 'Outlet Location Visit',
    link: 'Geo Sales Report',
    img: require('../../../assets/menu/geoSalesReport.png'),
    permission: 'All',
  },
  {
    label: 'Outlet Order History',
    link: 'outletHistoryReport',
    img: require('../../../assets/menu/outletHistory.png'),
    permission: 'All',
  },
  {
    label: 'Order Delivery Report',
    link: 'outletDeliveryReport',
    img: require('../../../assets/menu/outletHistory.png'),
    permission: 'All',
  },
  {
    label: 'Summary Delivery',
    link: 'summaryDelivery',
    img: require('../../../assets/menu/summaryDelivery.png'),
    permission: 'All',
  },
  {
    label: 'Employee Wise Report',
    link: 'employeeWiseReport',
    img: require('../../../assets/menu/employeeWiseReport.png'),
    permission: 'TSM',
  },
  {
    label: 'Distance Report',
    link: 'distanceReport',
    img: require('../../../assets/menu/distanceReport.png'),
    permission: 'All',
  },

  {
    label: 'Unloading',
    link: 'unloadingAfterDelivery',
    img: require('../../../assets/menu/truck.png'),
    permission: 'SO',
  },
  {
    label: 'Check In/Out',
    link: 'Check In / Out',
    img: require('../../../assets/menu/route.png'),
    permission: 'All',
  },
  {
    label: 'Location Registration',
    link: 'Attendance',
    img: require('../../../assets/menu/add-location.png'),
    permission: 'All',
  },
  {
    label: 'Data Collection',
    link: 'dataCollection',
    img: require('../../../assets/menu/dataCollection.png'),
    permission: 'All',
  },
  {
    label: 'Route Plan',
    link: 'routePlanLanding',
    img: require('../../../assets/menu/routePlan.png'),
    permission: 'All',
  },
  {
    label: 'Change Password',
    link: 'Change Password',
    img: require('../../../assets/menu/changePassword.png'),
    permission: 'All',
  },
  // {
  //   label: 'Chat',
  //   link: 'Chat',
  //   img: require('../../../assets/menu/chat.jpg'),
  //   permission: 'All',
  // },
  {
    label: 'Logout',
    link: 'Log in',
    img: require('../../../assets/logOutGif.gif'),
    permission: 'All',
    action: (profileData, password) => {
      logoutAction(profileData, password);
    },
  },
];

function Menu({navigation}) {
  const {profileData, password, userRole} = useContext(GlobalState);

  const renderMenu = (item, index) => {
    if (item?.permission === userRole || item?.permission === 'All') {
      return (
        <Col width="50%" tabWidth="33.33%" key={index}>
          <View style={styles.menuItemCard}>
            <TouchableOpacity
              onPress={() => {
                if (item?.action) {
                  item?.action(profileData, password);
                  navigation.navigate(item?.link);
                } else {
                  navigation.navigate(item?.link);
                }
              }}
              style={[styles.salesImg, {paddingVertical: 20}]}>
              <Image style={styles.imageStyle} source={item?.img} />
              <Text style={styles.menuLabel}>{item?.label}</Text>
            </TouchableOpacity>
          </View>
        </Col>
      );
    }
    return null;
  };
  return (
    <>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}>
        <View style={{backgroundColor: '#ffffff'}}>
          {/* user section */}
          <View style={styles.topBox}>
            <User />
          </View>

          <View style={{marginTop: -90}}>
            <View style={{marginHorizontal: 20}}>
              <Row colGap={10}>
                {menu?.map((item, index) => renderMenu(item, index))}
              </Row>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

export default Menu;

const styles = StyleSheet.create({
  menuLabel: {
    fontSize: 14,
    marginTop: 10,
    marginHorizontal: 2,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageStyle: {
    height: 55,
    width: 55,
  },
  topBox: {
    backgroundColor: headerBgPrimary,
    height: 200,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
  },
  menuItemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,

    elevation: 5,
    marginBottom: 15,
  },
  salesImg: {
    alignItems: 'center',
  },
});

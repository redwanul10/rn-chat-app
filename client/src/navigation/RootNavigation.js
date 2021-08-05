import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import GetStarted from '../screens/app/getStarted';
import Login from '../screens/auth/Login';
import SignUp from '../screens/auth/SignUp';
import LandingSecondary from '../screens/app/retailOrderManagement/secondaryOrder/landing';
import CreateSecondaryOrder from '../screens/app/retailOrderManagement/secondaryOrder/create';
import RouteSetup from '../screens/app/marketSetup/route/routeSetup';
import LandingBeat from '../screens/app/marketSetup/beat/landingBeat';
import BottomNavigation from './BottomNavigation';

import BeatAddEdit from '../screens/app/marketSetup/beat/addEditForm';
import RouteAddEdit from '../screens/app/marketSetup/route/addEditForm';
import RetailCollection from '../screens/app/retailOrderManagement/retailCollection/landing';

// Outlet Registration Start
import OutletAdd from '../screens/app/outletManagement/outletRegistration/create';
import OutLetRegLanding from '../screens/app/outletManagement/outletRegistration/landing';
import EditLanding from '../screens/app/outletManagement/outletRegistration/edit/landing';
import OutletInfo from '../screens/app/outletManagement/outletRegistration/edit/outLetInfo';
import OwnerInfo from '../screens/app/outletManagement/outletRegistration/edit/ownerInfo';
import BusinessInfo from '../screens/app/outletManagement/outletRegistration/edit/businessInfo';
import ViewOutletProfile from '../screens/app/outletManagement/outletRegistration/view/landing';
import ViewBusinessInfo from '../screens/app/outletManagement/outletRegistration/view/businessInfo';
import ViewOutletInfo from '../screens/app/outletManagement/outletRegistration/view/outLetInfo';
import ViewOwnerInfo from '../screens/app/outletManagement/outletRegistration/view/ownerInfo';
// Outlet Registration End

// Outlet Profile Registration Start
import OutletProfileRegForm from '../screens/app/outletManagement/outletProfileRegistration/addEditForm';
import OutletProfileRegLanding from '../screens/app/outletManagement/outletProfileRegistration/landing';
// Outlet Profile Registration End

import CreateDelivery from '../screens/app/retailOrderManagement/delivery/retailOrderBaseDelivery/createDelivery';
import LocationRegistration from '../screens/app/attendanceManagement/locationRegistration';
import CheckInOut from '../screens/app/attendanceManagement/checkInOut';
import AttendanceCalendar from '../screens/app/attendanceManagement/calendar';
import RetailOrderDirectDelivery from '../screens/app/retailOrderManagement/delivery/retailOrderDirectDelivery';
import LandingDelivery from '../screens/app/retailOrderManagement/delivery/landing';
import RouteView from '../screens/app/marketSetup/route/viewForm';
import BeatView from '../screens/app/marketSetup/beat/viewForm';
import ViewSecondaryOrder from '../screens/app/retailOrderManagement/secondaryOrder/view';
import ViewRetailOrderDelivery from '../screens/app/retailOrderManagement/delivery/retailOrderBaseDelivery/view';
import CreatePendingDelivery from '../screens/app/retailOrderManagement/delivery/retailOrderBaseDelivery/createPendingDelivery';

import RetailOrderDirectDeliveryForm from '../screens/app/retailOrderManagement/delivery/retailOrderDirectDelivery/addEditForm';
import RetailCollectionForm from '../screens/app/retailOrderManagement/retailCollection/addEditForm';
import SalesCollection from '../screens/app/orderManagement/salesCollection';
import SalesCollAddEdit from '../screens/app/orderManagement/salesCollection/addEditForm';
import ViewLastTransaction from '../screens/app/retailOrderManagement/secondaryOrder/viewLastTransaction';
import DamageCollection from '../screens/app/damage/damageCollection';
import OrderHistory from '../screens/app/reportManagement/orderHistory/index';
import StockAlogationView from '../screens/app/retailOrderManagement/delivery/stockAlogation/view';
import NoOrderForm from '../screens/app/retailOrderManagement/secondaryOrder/noOrder';
import FreeItemsLanding from '../screens/app/freeItems';
import DamageCollectionForm from '../screens/app/damage/damageCollection/addEditForm';
import DamageReplaceLanding from '../screens/app/damage/damageReplace/index';
import DamageReplaceForm from '../screens/app/damage/damageReplace/addEditForm';
import OutletApprove from '../screens/app/outletManagement/outletApprove';
import ViewDamageCollection from '../screens/app/damage/damageCollection/view';
import OutletDeliveryReport from '../screens/app/reportManagement/outletDeliveryReport';
import UnloadingAfterDelivery from '../screens/app/reportManagement/unloadingAfterDelivery/index';
import UnloadingAfterDeliveryView from '../screens/app/reportManagement/unloadingAfterDelivery/view/index';
import RetailOrderDirectDeliveryView from '../screens/app/retailOrderManagement/delivery/retailOrderDirectDelivery/view';
import EditSecondaryOrder from '../screens/app/retailOrderManagement/secondaryOrder/edit';
import GeoSalesReport from '../screens/app/reportManagement/geoSalesReport';
import ChangePassword from '../screens/app/changePassword';
import AssetRequest from '../screens/app/assetManagement/assetRequest/index';
import CreateAssetRequest from '../screens/app/assetManagement/assetRequest/addEditForm/index';
import AssetRequestApproval from '../screens/app/assetManagement/assetRequestApproval/index';
import AssetRequestApprovalView from '../screens/app/assetManagement/assetRequestApproval/view';
import EmployeeWiseReport from '../screens/app/reportManagement/employeeWiseReport/index';
import DistanceReport from '../screens/app/reportManagement/distanceReport/index';
import AssetMaintenance from '../screens/app/assetManagement/assetMaintenance/index';
import CreateAssetMaintenance from '../screens/app/assetManagement/assetMaintenance/addEditForm/index';
import AssetMaintenanceView from '../screens/app/assetManagement/assetMaintenance/view';
import AssetReceive from '../screens/app/assetManagement/assetReceive';
import SlubOffer from '../screens/app/slubOffer/index';
import DashboardReportDetails from '../screens/app/homeScreen/components/dahboardReportDetails/index';
import OutletHESetup from '../screens/app/outletManagement/outletHESetup';
import RetailOrderDeliveryLanding from '../screens/app/retailOrderManagement/delivery/retailOrderBaseDelivery/landing';
import CreateOutletHeSetup from '../screens/app/outletManagement/outletHESetup/addEditForm';
import DataCollection from '../screens/app/surveyManagement/dataCollection/index';
import CreateDataCollection from '../screens/app/surveyManagement/dataCollection/addViewForm/index';
import OutletVisitDonutDrillDown from '../screens/app/homeScreen/components/outletVisitDonutDrillDown/index';
import TourPlanDrillDown from '../screens/app/homeScreen/components/tourPlanDrillDown/index';
import OutletBillRequest from '../screens/app/outletManagement/outletBillRequest';
import CreateOutletBillRequest from '../screens/app/outletManagement/outletBillRequest/addEditForm';
import ViewOutletBillRequest from '../screens/app/outletManagement/outletBillRequest/view';
import RoutePlanLanding from '../screens/app/marketSetup/routePlan/index';
import CreateRoutePlanLanding from '../screens/app/marketSetup/routePlan/addViewform/index';
import ViewRoutePlanLanding from '../screens/app/marketSetup/routePlan/addViewform/view';
import AssetRequestFieldEmployee from '../screens/app/assetManagement/assetRequestFieldEmployee';
import SupervisorAssetApproval from '../screens/app/assetManagement/supervisorAssetApproval';
import MaintenanceAssetRequest from '../screens/app/assetManagement/assetRequestFieldEmployee/addEditForm';
import RegisterOutletApproval from '../screens/app/outletManagement/registerOutletApproval';
import ApproveRegisterOutlet from '../screens/app/outletManagement/registerOutletApproval/view';
import MrpPrice from '../screens/app/mrpPrice';
import summaryDeliveryLanding from '../screens/app/salesManagement/summaryDelivery/index';
import summaryDeliveryForm from '../screens/app/salesManagement/summaryDelivery/addEditform/index';
import ChatLanding from '../screens/app/chat/chatLanding/ChatLanding';
import PrivateChat from '../screens/app/chat/privateChat/PrivateChat';
import {GlobalState} from '../GlobalStateProvider';
import axios from 'axios';

function RootNavigation(props) {
  const Stack = createStackNavigator();
  const {profileData, selectedBusinessUnit} = React.useContext(GlobalState);

  const trackUser = async (payload) => {
    try {
      const res = await axios.post(
        `/rtm/RTMCommonProcess/CreateMenuTrack`,
        payload,
      );
      console.log(res?.status);
    } catch (err) {
      console.log('error => ', JSON.stringify(err, null, 2));
    }
  };

  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  let payload = {
    accountId: profileData?.accountId,
    businessUnitId: selectedBusinessUnit?.value,
    url: '',
    actionBy: profileData?.userId,
  };
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={(params) => {
        routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;

        payload.url = navigationRef?.current?.getCurrentRoute()?.name;
        if (profileData?.accountId && selectedBusinessUnit?.value) {
          trackUser(payload);
        }
      }}
      onStateChange={async (params) => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef?.current?.getCurrentRoute()
          ?.name;

        if (previousRouteName !== currentRouteName) {
          payload.url = currentRouteName;
          if (profileData?.accountId && selectedBusinessUnit?.value) {
            trackUser(payload);
          }
        }
        routeNameRef.current = currentRouteName;
      }}>
      <Stack.Navigator
        initialRouteName="Get Started"
        screenOptions={{
          headerMode: 'screen',
          ...TransitionPresets.SlideFromRightIOS,
          headerShown: false,
        }}>
        {/* Base Pages */}
        <Stack.Screen name="Get Started" component={GetStarted} />
        <Stack.Screen name="Log in" component={Login} />
        <Stack.Screen name="Sign Up" component={SignUp} />
        <Stack.Screen name="Home" component={BottomNavigation} />

        {/* Change Password */}
        <Stack.Screen name="Change Password" component={ChangePassword} />

        {/* Sales Collection */}
        <Stack.Screen name="Sales Collection" component={SalesCollection} />
        <Stack.Screen
          name="Edit Sales Collection"
          component={SalesCollAddEdit}
        />
        <Stack.Screen
          name="Create Sales Collection"
          component={SalesCollAddEdit}
        />

        {/* Retail/Secondary Order Start */}
        <Stack.Screen name="Landing Secondary" component={LandingSecondary} />
        <Stack.Screen name="Show Transaction" component={ViewLastTransaction} />
        <Stack.Screen
          name="Create Secondary Order"
          component={CreateSecondaryOrder}
        />
        <Stack.Screen
          name="Edit Secondary Order"
          component={EditSecondaryOrder}
        />
        <Stack.Screen name="View Retail Order" component={ViewSecondaryOrder} />

        {/* Slub Offer */}
        <Stack.Screen name="slubOffer" component={SlubOffer} />

        {/* MRP Price */}
        <Stack.Screen name="MRP Price" component={MrpPrice} />

        {/* Route */}
        <Stack.Screen name="Route Setup" component={RouteSetup} />
        <Stack.Screen name="Create Route" component={RouteAddEdit} />
        <Stack.Screen name="Edit Route" component={RouteAddEdit} />
        <Stack.Screen name="View Route" component={RouteView} />

        {/* Beat */}
        <Stack.Screen name="Landing Beat" component={LandingBeat} />
        <Stack.Screen name="Create Beat" component={BeatAddEdit} />
        <Stack.Screen name="Edit Beat" component={BeatAddEdit} />
        <Stack.Screen name="View Beat" component={BeatView} />

        {/* Outlet Profile Registration */}
        <Stack.Screen
          name="Outlet Profile Reg Landing"
          component={OutletProfileRegLanding}
        />
        <Stack.Screen
          name="Outlet Profile Reg Create"
          component={OutletProfileRegForm}
        />

        {/* Outlet Registration */}
        <Stack.Screen name="Out Let Reg Landing" component={OutLetRegLanding} />
        <Stack.Screen name="Outlet Add Edit" component={OutletAdd} />
        <Stack.Screen name="Edit Outlet Profile" component={EditLanding} />

        {/* Outlet Approve */}
        <Stack.Screen name="Outlet Approve" component={OutletApprove} />

        {/* Outlet Registration Edit */}
        <Stack.Screen name="Edit Outlet Info" component={OutletInfo} />
        <Stack.Screen name="Edit Owner Info" component={OwnerInfo} />
        <Stack.Screen name="Edit Business Info" component={BusinessInfo} />
        <Stack.Screen
          name="View Outlet Profile"
          component={ViewOutletProfile}
        />

        {/* Outlet Registration View */}
        <Stack.Screen name="View Outlet Info" component={ViewOutletInfo} />
        <Stack.Screen name="View Owner Info" component={ViewOwnerInfo} />
        <Stack.Screen name="View Business Info" component={ViewBusinessInfo} />

        {/* Outlet He Setup */}
        <Stack.Screen name="Outlet HE Setup" component={OutletHESetup} />
        <Stack.Screen
          name="Create Outlet HE Setup"
          component={CreateOutletHeSetup}
        />
        <Stack.Screen
          name="Edit Outlet HE Setup"
          component={CreateOutletHeSetup}
        />

        {/* Outlet Bill Request */}
        <Stack.Screen
          name="Outlet Bill Request"
          component={OutletBillRequest}
        />
        <Stack.Screen
          name="Create Outlet Bill Request"
          component={CreateOutletBillRequest}
        />
        <Stack.Screen
          name="View Outlet Bill Request"
          component={ViewOutletBillRequest}
        />

        {/* Retail Collection */}
        <Stack.Screen
          name="Retail Collection Create"
          component={RetailCollectionForm}
        />
        <Stack.Screen name="Retail Collection" component={RetailCollection} />

        {/* Delivery Landing */}
        <Stack.Screen name="Delivery" component={LandingDelivery} />

        {/* Retail Order Base Delivery */}
        <Stack.Screen
          name="Retail Order Base Delivery"
          component={RetailOrderDeliveryLanding}
        />
        <Stack.Screen
          name="Create Retail Order Base Delivery"
          component={CreatePendingDelivery}
        />
        <Stack.Screen
          name="Retail Order Base Delivery Create"
          component={CreateDelivery}
        />
        <Stack.Screen
          name="Retail Order Base Delivery View"
          component={ViewRetailOrderDelivery}
        />

        {/* Retail Order Direct Delivery */}
        <Stack.Screen
          name="Retail Order Direct Delivery"
          component={RetailOrderDirectDelivery}
        />
        <Stack.Screen
          name="Create Retail Order Direct Delivery"
          component={RetailOrderDirectDeliveryForm}
        />

        <Stack.Screen
          name="Retail Order Direct Delivery View"
          component={RetailOrderDirectDeliveryView}
        />

        {/* Delivery Confirm | Don't Remove */}
        {/* <Stack.Screen
          name="Delivery Confirmation"
          component={DeliveryConfirm}
        />
        <Stack.Screen
          name="Delivery Confirmation Create"
          component={DeliveryConfirmCreate}
        /> */}

        {/* Attendance Screens */}
        <Stack.Screen name="Attendance" component={LocationRegistration} />
        <Stack.Screen name="Check In / Out" component={CheckInOut} />
        <Stack.Screen name="Calendar" component={AttendanceCalendar} />

        {/* Damage Entry / Damage Collection  */}
        <Stack.Screen name="Damage Collection" component={DamageCollection} />
        <Stack.Screen
          name="Create Damage Collection"
          component={DamageCollectionForm}
        />
        <Stack.Screen
          name="View Damage Collection"
          component={ViewDamageCollection}
        />

        {/* Damage Replace */}
        <Stack.Screen name="Damage Replace" component={DamageReplaceLanding} />
        <Stack.Screen
          name="Edit Damage Replace"
          component={DamageReplaceForm}
        />

        {/* Outlet Asset Request */}
        <Stack.Screen name="assetRequest" component={AssetRequest} />

        <Stack.Screen
          name="createAssetRequest"
          component={CreateAssetRequest}
        />
        <Stack.Screen
          name="Asset Request Field Employee"
          component={AssetRequestFieldEmployee}
        />
        <Stack.Screen
          name="Asset Request Maintenance"
          component={MaintenanceAssetRequest}
        />

        {/* Outlet Asset Maintenance */}
        <Stack.Screen name="assetMaintenance" component={AssetMaintenance} />
        <Stack.Screen
          name="createAssetMaintenance"
          component={CreateAssetMaintenance}
        />
        <Stack.Screen
          name="assetMaintenanceView"
          component={AssetMaintenanceView}
        />

        {/* Outlet Asset Request Approval */}
        <Stack.Screen
          name="assetRequestApproval"
          component={AssetRequestApproval}
        />
        <Stack.Screen
          name="assetRequestApprovalView"
          component={AssetRequestApprovalView}
        />

        {/* Outlet Asset Receive */}
        <Stack.Screen name="Outlet Asset Receive" component={AssetReceive} />

        {/* Supervisor Asset Approval */}
        <Stack.Screen
          name="Supervisor Asset Approval"
          component={SupervisorAssetApproval}
        />

        {/* Geo Sales Report  */}
        <Stack.Screen name="Geo Sales Report" component={GeoSalesReport} />

        {/* Order History | Order, No Order Report */}
        <Stack.Screen name="outletHistoryReport" component={OrderHistory} />

        {/* Employee Wise Report */}
        <Stack.Screen
          name="employeeWiseReport"
          component={EmployeeWiseReport}
        />

        {/* Distance Report */}
        <Stack.Screen name="distanceReport" component={DistanceReport} />

        {/* Outlet Delivery Report */}
        <Stack.Screen
          name="outletDeliveryReport"
          component={OutletDeliveryReport}
        />
        {/* Register Outlet Approval */}
        <Stack.Screen
          name="Register Outlet Approval"
          component={RegisterOutletApproval}
        />
        {/* Register Outlet Approval View*/}
        <Stack.Screen
          name="Approve Register Outlet"
          component={ApproveRegisterOutlet}
        />

        {/* Unloading After Delivery */}
        <Stack.Screen
          name="unloadingAfterDelivery"
          component={UnloadingAfterDelivery}
        />
        <Stack.Screen
          name="unloadingAfterDeliveryView"
          component={UnloadingAfterDeliveryView}
        />

        {/* Stock Allocation */}
        {/* <Stack.Screen
          name="Create Stock Alogation"
          component={StockAlogationForm}
        /> */}
        <Stack.Screen
          name="View Stock Allocation"
          component={StockAlogationView}
        />

        {/* No Order */}
        <Stack.Screen
          // options={{
          //   headerMode: 'screen',
          //   ...TransitionPresets.ScaleFromCenterAndroid,
          //   headerShown: false,
          // }}
          name="No Order"
          component={NoOrderForm}
        />

        {/* Free Items */}
        <Stack.Screen
          // options={{
          //   headerMode: 'screen',
          //   ...TransitionPresets.ScaleFromCenterAndroid,
          //   headerShown: false,
          // }}
          name="Free Items"
          component={FreeItemsLanding}
        />

        {/* Dashboard Drill Down (ProgressBar) | Reports */}
        <Stack.Screen
          name="dashboardReportDetails"
          component={DashboardReportDetails}
        />

        {/* Outlet Visit Drill Down (Donut Chart) | Reports */}
        <Stack.Screen
          name="outletVisitDonutDrillDown"
          component={OutletVisitDonutDrillDown}
        />

        {/* Tour Plan Drill Down (Ranking & Tourplan) | Reports */}
        <Stack.Screen name="tourPlanDrillDown" component={TourPlanDrillDown} />

        {/* Survey | Data Collection */}
        <Stack.Screen name="dataCollection" component={DataCollection} />
        <Stack.Screen
          name="createDataCollection"
          component={CreateDataCollection}
        />

        {/* Route Plan | Market Visit Program */}
        <Stack.Screen name="routePlanLanding" component={RoutePlanLanding} />
        <Stack.Screen
          name="createRoutePlanLanding"
          component={CreateRoutePlanLanding}
        />
        <Stack.Screen
          name="viewRoutePlanLanding"
          component={ViewRoutePlanLanding}
        />

        {/* Summary Delivery */}
        <Stack.Screen
          name="summaryDelivery"
          component={summaryDeliveryLanding}
        />
        <Stack.Screen
          name="summaryDeliveryCreate"
          component={summaryDeliveryForm}
        />

        {/* Chat Menu */}
        <Stack.Screen name="Chat" component={ChatLanding} />
        <Stack.Screen name="privateChat" component={PrivateChat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigation;

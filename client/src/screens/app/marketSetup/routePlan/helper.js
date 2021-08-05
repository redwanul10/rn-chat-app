/* eslint-disable no-alert */
import axios from 'axios';
import {Toast} from 'native-base';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';

export const getRoutePlanLanding = async (
  accountId,
  buId,
  empId,
  setLoading,
  tourPlanDate,
  setter,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/RoutePlan/RoutePlanLandingPagination?accountId=${accountId}&businessUnitId=${buId}&employeeId=${empId}&PageNo=0&PageSize=100000&viewOrder=desc&tourPlanDate=${tourPlanDate}`,
    );
    if (res?.status === 200 && res?.data) {
      setLoading(false);
      setter(res?.data?.data);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const GetRoutePlanById = async (
  accId,
  buId,
  employeeId,
  tourId,
  singleMonthSetter,
  rowMonthSetter,
  // rowWeekSetter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/RoutePlan/GetRoutePlanMonthWise?accountId=${accId}&businessUnitId=${buId}&employeeId=${employeeId}&tourId=${tourId}`,
    );
    if (res?.status === 200 && res?.data) {
      const data = res?.data;
      const singleMonthRowDto = data?.objRow?.map((itm, idx) => {
        return {
          ...itm,
          routeCategory: {
            value: itm?.intCategoryId,
            label: itm?.strCategory,
          },
          routeLocation: {
            value: itm?.intTerritoryId,
            label: itm?.territoryName,
          },
          route: {value: itm?.routeId, label: itm?.routeName},
          distributorDDL: {
            value: itm?.distributorId,
            label: itm?.distributorName,
          },
        };
      });
      const singleObjHeader = {
        ...data?.objHeader,
        date: _dateFormatter(data?.objHeader?.dteTourMonth),
        employee: {
          value: data?.objHeader?.intEmployeeId,
          label: data?.objHeader?.employeeName,
          level: data?.objHeader?.employeeLevel || 1,
        },
      };
      singleMonthSetter(singleObjHeader);
      rowMonthSetter(singleMonthRowDto);
      // rowWeekSetter(singleMonthRowDto);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    // console.log(error.message);
  }
};

export const getVisitWiseApi_Action = async (accId, busId, empId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RtmsalesforceLabelInfo/GetSalesForceLabelById?AccountId=${accId}&BusinessUnitId=${busId}&EmployeeId=${empId}`,
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    // console.log(error.message);
  }
};

export const getEmployeeDDL = async (accId, busId, empId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetEmployeeUnderSupervisorDDL?accountId=${accId}&businessUnitId=${busId}&EmployeeId=${empId}`,
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const GetTerritotoryWithLevelByEmpDDLNew = async (
  accountId,
  businessUnitId,
  levelId,
  terrioryId,
  setter,
) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetTerritotoryWithLevelByEmpDDLNew?accountId=${accountId}&businessUnitId=${businessUnitId}&LevelId=${levelId}&TerrioryId=${terrioryId}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getRouteDDLModify = async (
  accId,
  busId,
  territoryId,
  index,
  row,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/RouteByTerritoryIdDDL?AccountId=${accId}&BusinessUnitId=${busId}&TerritoryId=${territoryId}`,
    );
    if (res?.status === 200 && res?.data) {
      row[index] = res?.data;
      setter([...row]);
    }
  } catch (error) {
    // console.log(error.message);
  }
};

export const saveRoutePlanWeekWiseAction = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/rtm/RoutePlan/CreateRoutePlanWeekWise`,
      data,
    );
    if (res?.status === 200) {
      Toast.show({
        text: res?.data?.message,
        type: 'success',
        duration: 3000,
      });
      cb();
      setDisabled(false);
    }
  } catch (error) {
    Toast.show({
      text: error?.response?.data?.message,
      type: 'warning',
      duration: 3000,
    });
    setDisabled(false);
  }
};

export const saveEditedRoutePlanMonthlyAction = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.put(
      `/rtm/RoutePlan/EditRoutePlanMonthWiseRow`,
      data,
    );
    if (res?.status === 200) {
      Toast.show({
        text: res?.data?.message,
        type: 'success',
        duration: 3000,
      });
      setDisabled(false);
    }
  } catch (error) {
    Toast.show({
      text: error?.response?.data?.message,
      type: 'warning',
      duration: 3000,
    });
    setDisabled(false);
  }
};

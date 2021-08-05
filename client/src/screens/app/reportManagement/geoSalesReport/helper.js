/* eslint-disable no-alert */
import axios from 'axios';

export const getOrderBaseReport = async (
  accId,
  buId,
  rId,
  date,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      // '/rtm/LocationWiseOutletReport/GetLocationWiseOutletReport?accountId=2&businessunitId=172&RouteId=25&reportDate=2021-06-02'
      `/rtm/LocationWiseOutletReport/GetLocationWiseOutletReport?accountId=${accId}&businessunitId=${buId}&RouteId=${rId}&reportDate=${date}`,
    );
    const filterData = res?.data?.filter((item) => {
      if (item?.notVisited && item?.outletLong && item?.outletLat) {
        return true;
      }

      if (item?.isOrder && item?.longitiud && item?.latitude) {
        return true;
      }

      if (item?.isNoOrder && item?.longitiud && item?.latitude) {
        return true;
      }

      return false;
    });

    setter(filterData);
    setLoading(false);

  } catch (err) {
    // alert("succ")
    setter([]);
    setLoading(false);
  }
};

export const getTotalOrderInfo = async (
  accId,
  buId,
  territoryId,
  fromDate,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/TotalOrderInfo?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${territoryId}&FromDate=${fromDate}`,
    );

    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getEmployeesLocation = async (accId, buId, userId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/EmployeeLangLat/GetEmployeeLangLot?accountId=${accId}&businessunitId=${buId}&userId=${userId}`,
    );

    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getNotOrderBaseReport = async (
  accId,
  buId,
  tId,
  rId,
  date,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/OutletReason/GetOutletVisitNotOrderBaseReport?AccountId=${accId}&Businessunitid=${buId}&Territoryid=${tId}&RouteId=${rId}&RecordDate=${date}`,
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};

export const getNotVisitReport = async (
  accId,
  buId,
  tId,
  rId,
  date,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/OutletReason/GetOutletNotVisitedReport?AccountId=${accId}&Businessunitid=${buId}&Territoryid=${tId}&RouteId=${rId}&RecordDate=${date}`,
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};



/* eslint-disable no-alert */
import axios from 'axios';

export const getOrderBaseReport = async (
  accId,
  buId,
  tId,
  rId,
  date,
  channelId,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/OutletReason/GetOutletVisitOrderBaseReport?AccountId=${accId}&Businessunitid=${buId}&Territoryid=${tId}&RouteId=${rId}&RecordDate=${date}&ChannelId=${channelId}`,
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const getTotalOrderInfo = async (
  accId,
  buId,
  territoryId,
  routeId,
  fromDate,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetTotalOrderInfoForOrderHistory?AccountId=${accId}&BusinessUnitId=${buId}&Territory=${territoryId}&RouteId=${routeId}&FromDate=${fromDate}`,
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
  channelId,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/OutletReason/GetOutletVisitNotOrderBaseReport?AccountId=${accId}&Businessunitid=${buId}&Territoryid=${tId}&RouteId=${rId}&RecordDate=${date}&ChannelId=${channelId}`,
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
  channelId,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/OutletReason/GetOutletNotVisitedReport?AccountId=${accId}&Businessunitid=${buId}&Territoryid=${tId}&RouteId=${rId}&RecordDate=${date}&ChannelId=${channelId}`,
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

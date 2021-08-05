import axios from 'axios';
import {Toast} from 'native-base';

export const getRouteDDL = async (accId, buId, territoryId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/RouteByTerritoryIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${territoryId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getBeatDDL = async (routeId, setter) => {
  try {
    const res = await axios.get(`/rtm/RTMDDL/BeatNameDDL?RouteId=${routeId}`);
    setter(res?.data);
  } catch (err) {}
};

export const getLandingData = async (
  accId,
  buId,
  routeId,
  beatId,
  setter,
  setLoading,
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/rtm/OutletProfile/GetAppsOutletLandingPagination?accountId=${accId}&businessUnitid=${buId}&RouteId=${routeId}&BeatId=${beatId}&status=false&PageNo=1&PageSize=200&vieworder=desc`,
    );
    const row = res?.data?.data?.map((item) => ({
      ...item,
      isApprove: false,
    }));
    setter({...res?.data, data: row});
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};

export const approveOutlet = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/rtm/OutletProfile/ApproveOutletProfile`,
      payload,
    );

    setLoading(false);
    Toast.show({
      text: res?.data?.message || 'Approve Successfull',
      type: 'success',
      duration: 3000,
    });

    cb();
  } catch (err) {
    setLoading(false);
    Toast.show({
      text: err?.response?.data?.message,
      type: 'danger',
      duration: 3000,
    });
  }
};

export const rejectOutlet = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/rtm/OutletProfile/OutletProfileRejectByList`,
      payload,
    );

    setLoading(false);
    Toast.show({
      text: res?.data?.message || 'Approve Successfull',
      type: 'success',
      duration: 3000,
    });

    cb();
  } catch (err) {
    setLoading(false);
    Toast.show({
      text: err?.response?.data?.message,
      type: 'danger',
      duration: 3000,
    });
  }
};

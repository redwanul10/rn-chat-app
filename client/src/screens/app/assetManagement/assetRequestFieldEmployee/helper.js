import axios from 'axios';
import {Toast} from 'native-base';
import {_todayDate} from '../../../../common/functions/_todayDate';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';

export const getLandingData = async (routeId, itemId, setIsLoading, setter) => {
  setIsLoading(true);

  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetRouteWiseOutletWithAssetinfo?RouteId=${routeId}&ItemId=${itemId}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
      setIsLoading(false);
    }
  } catch (err) {
    setIsLoading(false);
  }
};
export const getLandingReqData = async (requestId, accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/AssetInventory/GetAssetListByRequestType?requestTypeId=${requestId}&accountId=${accId}&businessUnitId=${buId}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {}
};

export const getChannelDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetDistributionChannel?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};
export const getTerritoryDDL = async (accId, buId, channelId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetTerritoryDDLFromSetup?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};
export const getPiontDDL = async (
  accId,
  buId,
  channelId,
  territoryId,
  setter,
) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetPointDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}&TerritoryId=${territoryId}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};
export const getSectionDDL = async (
  accId,
  buId,
  channelId,
  pointId,
  setter,
) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetSectionDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}&PointId=${pointId}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};
export const getRouteDDL = async (accId, buId, sectionId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/RouteByTerritoryIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${sectionId}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getItemApiDDL = async (
  // catId, subId, accId,
  setter,
) => {
  // console.log('hello');
  try {
    let res = await axios.get(
      // `/rtm/RTMDDL/GetFinishedItemByCatagoryDDL?CatagoryId=${catId}&SubCatagoryId=${subId}&AccountId=${accId}`,
      `/rtm/RTMDDL/GetFinishedItemByCatagoryDDL`,
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const CreateAsssetMaintenanceRequest = async (payload, setLoading) => {
  setLoading(true);
  try {
    let res = await axios.post(
      `/rtm/AssetMaintenenceRequest/CreateAssetMaintenenceRequest`,
      payload,
    );
    if (res?.status === 200) {
      Toast.show({
        text: res?.data?.message || 'Created Successfully',
        type: 'success',
        duration: 3000,
      });
      setLoading(false);
    }
  } catch (err) {
    Toast.show({
      text: err?.response?.data?.message || 'Not created',
      type: 'warning',
      duration: 3000,
    });
    setLoading(false);
  }
};

export const CreateAssetPullOutRequest = async (payload, setIsLoading, cb) => {
  setIsLoading(true);
  try {
    let res = await axios.post(
      `/rtm/AssetPullOutRequest/CreateAssetPullOutRequest`,
      payload,
    );
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message);
      setIsLoading(false);
    }
  } catch (err) {
    Toast.show({
      text: err?.response?.data?.message || 'Not created',
      type: 'warning',
      duration: 3000,
    });
    setIsLoading(false);
  }
};

export const CreateAssetTransferRequest = async (payload, setIsLoading, cb) => {
  setIsLoading(true);
  try {
    let res = await axios.post(
      `/rtm/AssetTransferRequest/CreateAssetTransferRequest`,
      payload,
    );
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message);
      setIsLoading(false);
    }
  } catch (err) {
    Toast.show({
      text: err?.response?.data?.message || 'Not created',
      type: 'warning',
      duration: 3000,
    });
    setIsLoading(false);
  }
};

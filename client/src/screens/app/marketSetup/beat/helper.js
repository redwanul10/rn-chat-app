import axios from 'axios';
import {Toast} from 'native-base';

export const getTerritoryDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/TerritoryDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    setter(res?.data);
  } catch (err) {
    alert(err.response.data.message);
  }
};

export const getRouteDDL = async (accId, buId, territoryId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/RouteByTerritoryIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${territoryId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const createBeat = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(`/rtm/Beat/CreateBeat`, payload);
    setLoading(false);
    Toast.show({
      text: res.message || 'Created Successfull',
      buttonText: 'close',
      type: 'success',
      duration: 3000,
    });

    cb();
  } catch (err) {
    setLoading(false);
    Toast.show({
      text: err.response.data.message,
      buttonText: 'close',
      type: 'danger',
      duration: 3000,
    });
  }
};

export const editBeat = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(`/rtm/Beat/EditBeat`, payload);
    setLoading(false);
    Toast.show({
      text: res.message || 'Edit Successfull',
      buttonText: 'close',
      type: 'success',
      duration: 3000,
    });
  } catch (err) {
    setLoading(false);
    Toast.show({
      text: err.response.data.message,
      buttonText: 'close',
      type: 'danger',
      duration: 3000,
    });
  }
};

export const getBeatById = async (beatId, setter) => {
  try {
    const res = await axios.get(`/rtm/Beat/GetBeatById?beatId=${beatId}`);

    const value = res?.data[0];

    const initData = {
      beatName: value?.beatName,
      teritory: {
        value: value?.territoryId,
        label: value?.territoryName,
      },
      route: {
        value: value?.routeId,
        label: value?.routeName,
      },
    };
    setter({...initData});
  } catch (err) {}
};

export const getLandingData = async (
  accId,
  buId,
  teritoryId,
  routeId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/Beat/GetBeatLandingPasignation?accountId=${accId}&businessUnitid=${buId}&TerritoryId=${teritoryId}&RouteId=${routeId}&PageNo=1&PageSize=15&vieworder=desc`,
    );
    setter(res?.data);
  } catch (err) {}
};

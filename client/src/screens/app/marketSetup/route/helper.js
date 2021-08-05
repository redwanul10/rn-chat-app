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

export const getOutlateDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetOutletInfoDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    setter(res?.data);
  } catch (err) {
    alert(err.response.data.message);
  }
};

export const createRoute = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(`/rtm/Route/CreateRoute`, payload);
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

export const editRoute = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(`/rtm/Route/EditRoute`, payload);
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

export const getRouteById = async (routeId, setter) => {
  try {
    const res = await axios.get(`/rtm/Route/GetRouteDTO?IntRouteId=${routeId}`);
    const value = res?.data[0];
    const initData = {
      route_name: value?.routeName,
      startOutlet: value?.startOutletId
        ? {
            value: value?.startOutletId,
            label: value?.startOutletName,
          }
        : '',
      endOtlet: value?.endOutleId
        ? {
            value: value?.endOutleId,
            label: value?.endOutletName,
          }
        : '',
      teritory: {
        value: value?.territoryId,
        label: value?.territoryName,
      },
    };
    setter(initData);
  } catch (err) {}
};

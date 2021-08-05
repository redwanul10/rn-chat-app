import axios from 'axios';
import {Toast} from 'native-base';

export const getRouteDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/RouteNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getBeatDDL = async (routeId, setter) => {
  try {
    const res = await axios.get(`/rtm/RTMDDL/BeatNameDDL?RouteId=${routeId}`);

    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getOutletTypeInfoDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/BusinessTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    setter(res?.data);
  } catch (err) {
    alert(err.response.data.message);
  }
};

export const createOutletProfile = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/rtm/OutletProfile/CreateOutletProfile`,
      payload,
    );
    setLoading(false);
    Toast.show({
      text: res.message || 'Created Successfull',
      // buttonText: 'close',
      type: 'success',
      duration: 3000,
    });

    cb();
  } catch (err) {
    Toast.show({
      text: err.response.data.message,
      buttonText: 'close',
      type: 'danger',
      duration: 3000,
    });
  }
};

export const editOutletProfile = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/rtm/OutletProfile/EditOutletProfile`,
      payload,
    );
    setLoading(false);
    Toast.show({
      text: res.message || 'Edit Successfull',
      buttonText: 'close',
      type: 'success',
      duration: 3000,
    });
  } catch (err) {
    Toast.show({
      text: err.response.data.message,
      buttonText: 'close',
      type: 'danger',
      duration: 3000,
    });
  }
};

export const getOutletProfileById = async (outletId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/OutletProfile/GetOutletProfileById?outletId=${outletId}`,
    );

    const value = res?.data[0];

    const initData = {
      route: {
        value: value?.routeId,
        label: value?.routeName,
      },
      beat: {
        value: value?.beatId,
        label: value?.beatName,
      },
      businessType: {
        value: value?.businessTypeId,
        label: value?.businessTypeName,
      },
      outlet_name: value?.outletName,
      lattitude: value?.lattitude,
      longitude: value?.longitude,
      owner_name: value?.ownerName,
      outlet_address: value?.outletAddress,
      mobile: value?.mobileNumber,
    };
    setter({...initData});
  } catch (err) {}
};

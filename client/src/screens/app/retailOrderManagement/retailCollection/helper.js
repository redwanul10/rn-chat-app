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

export const getRetailCollectionLandingData = async (
  accId,
  buId,
  routeId,
  reportTypeId,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/SecondaryCollection/GetSecondaryDueCollectionPasignation?AccountId=${accId}&BusinessunitId=${buId}&RouteId=${routeId}&PageNo=0&PageSize=50&vieworder=desc&reportType=${reportTypeId}`,
    );

    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};

export const createSecondaryDeliveryCollection = async (
  payload,
  setLoading,
  cb,
) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/rtm/SecondaryDelivery/CreateSecondaryDeliveryCollection`,
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
    setLoading(false);
    Toast.show({
      text: err.response.data.message,
      type: 'danger',
      duration: 3000,
    });
  }
};

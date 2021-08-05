import axios from 'axios';
import {Toast} from 'native-base';
import {_todayDate} from '../../../../common/functions/_todayDate';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';

export const getRouteDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/RouteNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    // setter({data: []});
  }
};

export const getLandingData = async (
  accId,
  buId,
  routeId,
  setLoading,
  setter,
) => {
  try {
    setLoading(true);
    let res = await axios.get(
      `/rtm/AssetReceived/OutletAssetReceivedLanding?AccountId=${accId}&BusinessUnitId=${buId}&RouteId=${routeId}&viewOrder=desc&PageNo=0&PageSize=1000`,
    );
    setLoading(false);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setLoading(false);
    // setter({data: []});
  }
};

export const assetReceiveApprovalList_api = async (
  payload,
  setIsLoading,
  cb,
) => {
  setIsLoading(true);
  try {
    let res = await axios.put(
      `/rtm/AssetReceived/SalesForceAssetReceived`,
      payload,
    );
    if (res?.status === 200) {
      Toast.show({
        text: res?.data?.message || 'Received Successfully',
        type: 'success',
        duration: 3000,
      });
      cb();
      setIsLoading(false);
    }
  } catch (err) {
    Toast.show({
      text: err?.response?.data?.message || '',
      type: 'warning',
      duration: 3000,
    });
    setIsLoading(false);
  }
};

import axios from 'axios';
import {Toast} from 'native-base';

export const getLandingData = async (
  accId,
  buId,
  requestTypeId,
  setIsLoading,
  setter,
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/AssetInventory/GetAssetListByRequestType?requestTypeId=${requestTypeId}&accountId=${accId}&businessUnitId=${buId}`,
    );
    if (res?.status === 200) {
      const modify = res?.data?.map((item) => ({
        ...item,
        approve: false,
        reject: false,
      }));
      setter(modify);
      setIsLoading(false);
    }
  } catch (err) {
    setIsLoading(false);
    setter({data: []});
  }
};

export const editOutletAssetRequestApprovalList_api = async (
  requestTypeId,
  payload,
  setIsLoading,
  cb,
) => {
  setIsLoading(true);
  try {
    let res = await axios.put(
      `/rtm/AssetInventory/ApproveAssetInventory?requestTypeId=${requestTypeId}`,
      payload,
    );
    if (res?.status === 200) {
      Toast.show({
        text: 'Approved Successfully' || res?.data?.message,
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

export const reject_api = async (requestTypeId, payload, setIsLoading, cb) => {
  setIsLoading(true);
  try {
    let res = await axios.put(
      `/rtm/AssetInventory/RejectAssetInventory?requestTypeId=${requestTypeId}`,
      payload,
    );
    if (res?.status === 200) {
      Toast.show({
        text: 'Rejected Successfully' || res?.data?.message,
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

export const GetOutletAssetRequestItemDetails_api = async (
  requestId,
  setIsLoading,
  setter,
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/OutletAssetRequest/GetOutletAssetRequestItemDetails?IntAssetRequestId=${requestId}`,
    );
    if (res?.status === 200) {
      setter(
        res?.data?.map((item) => {
          return {
            ...item,
            requestQtyApproved: item?.requestQtyApproved || 0,
          };
        }),
      );
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

export const outletAssetRequestApproval = async (
  payload,
  setIsLoading,
  cb,
  setApproved,
) => {
  setIsLoading(true);
  try {
    let res = await axios.put(
      `/rtm/OutletAssetRequest/OutletAssetRequestApproval`,
      payload,
    );
    if (res?.status === 200) {
      cb();
      Toast.show({
        text: 'Approved successfully' || res?.data?.message,
        type: 'success',
        duration: 3000,
      });
      setIsLoading(false);
      setApproved(true);
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

import axios from 'axios';
import {Toast} from 'native-base';

export const getLandingData = async (
  accId,
  buId,
  status,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setIsLoading,
  setter,
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/OutletAssetRequest/GetOutletAssetRequestApprovalPagination?AccountId=${accId}&BusinessUnitid=${buId}&status=${status}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`,
    );
    if (res?.status === 200) {
      const payload = {
        currentPage: res?.data?.currentPage,
        data: res?.data?.data?.map((item) => {
          return {
            ...item,
            isSelect: false,
          };
        }),
        pageSize: res?.data?.pageSize,
        totalCount: res?.data?.totalCount,
      };
      setter(payload);
      setIsLoading(false);
    }
  } catch (err) {
    setIsLoading(false);
    setter({data: []});
  }
};

export const editOutletAssetRequestApprovalList_api = async (
  payload,
  setIsLoading,
  cb,
) => {
  setIsLoading(true);
  try {
    let res = await axios.put(
      `/rtm/OutletAssetRequest/EditOutletAssetRequestApprovalList`,
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

export const reject_api = async (payload, setIsLoading, cb) => {
  setIsLoading(true);
  try {
    let res = await axios.put(
      `/rtm/OutletAssetRequest/RejectOutletAssetRequest`,
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

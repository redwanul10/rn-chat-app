import axios from 'axios';
import {Toast} from 'native-base';
import {_todayDate} from '../../../../common/functions/_todayDate';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';

export const getLandingData = async (
  accId,
  buId,
  outletId,
  pageNo,
  pageSize,
  setIsLoading,
  setter,
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/AssetMaintenence/GetAssetMaintenencePagiantion?AccountId=${accId}&BusinessUnitId=${buId}&OutletId=${outletId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
      setIsLoading(false);
    }
  } catch (err) {
    setIsLoading(false);
    setter({data: []});
  }
};

export const getItemDDL = async (accId, buId, outletId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetMaintainanceItemDDL?AccountId=${accId}&BusinessUnitId=${buId}&OutletId=${outletId}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getMaintainanceTypeDDL = async (setter) => {
  try {
    let res = await axios.get(`/rtm/RTMDDL/GetmaintenanceTypeDDL`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getMaintenanceItemAssetCodeDDL = async (
  accId,
  buId,
  outletId,
  itemId,
  setter,
) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetMaintainanceItemAssetCodeDDL?AccountId=${accId}&BusinessUnitId=${buId}&OutletId=${outletId}&itemid=${itemId}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getMaintainanceItemDDL = async (accId, setter) => {
  try {
    let res = await axios.get(`/rtm/RTMDDL/FinishedItemDDL?AccountId=${accId}`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getReceiveDetails = async (
  accId,
  buId,
  outletId,
  itemId,
  setFieldValue,
) => {
  try {
    let res = await axios.get(
      `/rtm/AssetReceived/GetReceiveDetailByItemId?AccountId=${accId}&BusinessUnitId=${buId}&OutletID=${outletId}&ItemID=${itemId}`,
    );
    if (res?.status === 200) {
      setFieldValue('commentsHeader', res?.data[0]?.narration || '');
      setFieldValue('item', res?.data[0]);
    }
  } catch (err) {
    setFieldValue('commentsHeader', '');
    setFieldValue('item', '');
  }
};

export const createOutlateAssetMaintenance = async (
  payload,
  setIsLoading,
  cb,
) => {
  setIsLoading(true);
  try {
    let res = await axios.post(
      `/rtm/AssetMaintenence/CreateAssetMaintenence`,
      payload,
    );
    if (res?.status === 200) {
      cb();
      Toast.show({
        text: res?.data?.message,
        type: 'success',
        duration: 3000,
      });
      setIsLoading(false);
    }
  } catch (err) {
    Toast.show({
      text: err?.response?.data?.message,
      type: 'warning',
      duration: 3000,
    });
    setIsLoading(false);
  }
};

export const getSingleDataById = async (
  id,
  outletId,
  itemId,
  setSingleData,
  setRowDto,
  code,
) => {
  try {
    let res = await axios.get(
      `/rtm/AssetMaintenence/GetAssetMaintenenceById?OutletId=${outletId}&ItemId=${itemId}&Code=${code}&AssetMaintenenceId=${id}`,
    );
    if (res?.status === 200) {
      let objHeader = res?.data?.objHeader[0];
      let objRow = res?.data?.objRow;
      let payload = {
        route: {
          value: objHeader?.routeId,
          label: objHeader?.routeName,
        },
        market: {
          value: objHeader?.beatId,
          label: objHeader?.beatName,
        },
        outlet: {
          value: objHeader?.outletid,
          label: objHeader?.outletName,
        },
        itemIssueDate: _dateFormatter(objRow[0]?.itemIssueDate),
        commentsHeader: objRow[0]?.narration,

        assetName: {
          value: objRow[0]?.assetItemId,
          label: objRow[0]?.itemName,
        },
        assetCode: objRow[0]?.assetItemCode,
        dueDate: '',
        maintenanceDate: _todayDate(),
        maintenanceProduct: '',
        qtyOrAmount: '',
        productQty: objRow[0]?.receiveQuantity,

        maintenanceType: {
          value: objHeader?.maintenanceTypeId,
          label: objHeader?.maintenanceTypeName,
        },
        partyName: objHeader?.partyName,
        partyContactNo: objHeader?.partyContactNo,
        assetItemCode: objRow[0]?.assetItemCode,
      };
      setSingleData(payload);
      setRowDto(objRow);
    }
  } catch (err) {
    Toast.show({
      text: err?.response?.data?.message,
      type: 'warning',
      duration: 3000,
    });
  }
};

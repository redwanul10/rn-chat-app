/* eslint-disable quotes */
import Axios from 'axios';
import {Toast} from 'native-base';

export const getDistributorDDL = async (accId, buId, trytorId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/GetCustomerDDL_new?AccountId=${accId}&BusinessUnitId=${buId}&TerrytoryId=${trytorId}`,
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getOrderNoDDL = async (outletId, setter) => {
  try {
    const res = await Axios.get(`/rtm/RTMDDL/OrderNoDDL?OutletId=${outletId}`);
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getOrderItemDDL = async (
  orderId,
  setter,
  SetTotalAdvanceAmount,
) => {
  try {
    const res = await Axios.get(
      `/rtm/SecondaryOrder/GetSecondaryOrderById?OrderId=${orderId}`,
    );
    if (res?.status === 200 && res?.data) {
      SetTotalAdvanceAmount(res?.data.objHeader[0].receiveAmount);
      let newData = res?.data?.objRow.map((data) => {
        return {
          ...data,
          deliveryQuantity: data.orderQuantity,
          deliveryAmount: data.orderQuantity * data.price,
        };
      });
      setter(newData);
    }
  } catch (error) {
    setter([]);
  }
};

export const getDamageCategoryDDL = async (setter) => {
  try {
    let res = await Axios.get(`/rtm/RTMDDL/GetDamageCatagoryDDL`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getdistributorChanelNameDDL = async (
  accId,
  buId,
  prId,
  setter,
) => {
  try {
    let res = await Axios.get(
      `/rtm/RTMDDL/GetDistributinChannelByPartnerIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&BusinessPartnetId=${prId}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getDistributorAndDistributorChannelNameDDL = async (
  accId,
  buId,
  tId,
  setFieldValue,
) => {
  try {
    let res = await Axios.get(
      `/rtm/RTMDDL/GetBusinessPartnerWithChannelInfo?AccountId=${accId}&BusinessUnitId=${buId}&TerrytoryId=${tId}`,
    );
    if (res?.status === 200) {
      setFieldValue('distributor', {
        value: res?.data?.distributorId,
        label: res?.data?.distributorName,
      });
      setFieldValue('distributorChannel', {
        value: res?.data?.distributionChannelId,
        label: res?.data?.distributionChannelName,
      });
    }
  } catch (err) {
    setFieldValue([]);
  }
};

export const getGridData = async (
  accId,
  buId,
  status,
  routeId,
  outletId,
  categoryId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/rtm/DamageEntry/GetReplacementLanding?accountId=${accId}&businessUnitId=${buId}&status=${status}&damageCategoryId=${categoryId}&routeId=${routeId}&outletId=${outletId}&vieworder=desc&PageNo=${pageNo}&PageSize=${pageSize}&FromDate=${fromDate}&ToDate=${toDate}`,
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter({data: []});
    setLoading(false);
  }
};

export const getById = async (paramsStatus, params, setSingleData, status) => {
  try {
    const res = await Axios.get(
      `/rtm/DamageEntry/GetDamageReplacementById?damageEntryId=${params?.id}&status=${status}`,
    );
    if (res?.status === 200 && res?.data) {
      const header = res?.data?.objHeader;
      const row = res?.data?.objRow;
      const payload = {
        ...params,
        distributor: {
          value: header?.businessPartnerId,
          label: header?.businessPartnerName,
        },
        damageCategory: {
          value: header?.dmgCategoryId,
          label: header?.dmgCategoryName,
        },
        outlet: {
          value: header?.outletId,
          label: header?.outletName,
        },
        distributorChannel: {
          value: header?.distributionChannelId,
          label: header?.distributionChannelName,
        },
        itemLists:
          paramsStatus === 2
            ? row?.map((item) => {
                return {
                  ...item,
                  replacementQty: 0,
                };
              })
            : row,
        damageEntryId: header?.damageEntryId,
      };
      setSingleData(payload);
    }
  } catch (error) {
    Toast.show({
      text: error?.response?.data?.message,
      // buttonText: 'close',
      type: 'danger',
      duration: 3000,
    });
  }
};

export const CreateDamageReplace_api = async (
  payload,
  setDisabled,
  getDataCallBack,
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/rtm/DamageEntry/CreateReplacement`, payload);
    if (res?.status === 200) {
      Toast.show({
        text: res?.data?.message,
        // buttonText: 'close',
        type: 'success',
        duration: 3000,
      });
      getDataCallBack();
      setDisabled(false);
    }
  } catch (err) {
    getDataCallBack();
    Toast.show({
      text: err?.response?.data?.message,
      // buttonText: 'close',
      type: 'danger',
      duration: 3000,
    });
    setDisabled(false);
  }
};

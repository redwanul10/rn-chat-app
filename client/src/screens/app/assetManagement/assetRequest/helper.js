import axios from 'axios';
import {Toast} from 'native-base';
import {_todayDate} from '../../../../common/functions/_todayDate';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';

export const getLandingData = async (
  accId,
  buId,
  routeId,
  beatId,
  pageNo,
  pageSize,
  setIsLoading,
  setter,
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/OutletAssetRequest/GetOutletAssetRequestPagination?accountId=${accId}&businessUnitid=${buId}&Routeid=${routeId}&BeatId=${beatId}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`,
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

export const getOutletLicenceAndNid = async (outletId, setFieldValue) => {
  try {
    let res = await axios.get(
      `/rtm/OutletProfile/GetOutletProfileByOutletId?OutletId=${outletId}`,
    );
    if (res?.status === 200) {
      setFieldValue('outletLicense', res?.data[0]?.tradeLicenseNo);
      setFieldValue('outletOwnerId', res?.data[0]?.ownerNIDNo);
    }
  } catch (err) {
    setFieldValue('outletLicense', '');
    setFieldValue('outletOwnerId', '');
  }
};

export const getItemCategoryApiDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/item/ItemCategory/GetItemCategoryDDLByTypeId?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=10`,
    );
    if (res?.status === 200) {
      let dataMapping = res?.data.map((data) => {
        return {
          value: data.itemCategoryId,
          label: data.itemCategoryName,
        };
      });
      setter(dataMapping);
    }
  } catch (err) {
    setter([]);
  }
};

export const getMaximumSalesItemApiDDL = async (accId, setter) => {
  try {
    let res = await axios.get(`/rtm/RTMDDL/FinishedItemDDL?AccountId=${accId}`);
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

// Last Change | Branding Item DDL Api change
export const getBrandingItemDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetBrandList?accountId=${accId}&businessUnitId=${buId}`,
    );
    if (res?.status === 200) {
      let newData = res?.data.map((item) => {
        return {
          value: item?.brandId,
          label: item?.brandName,
        };
      });
      setter(newData);
    }
  } catch (err) {}
};

/* These 3 Commented API was for branding Item  */

// export const getCustomerDDL = async (accId, buId, tId, setter) => {
//   try {
//     let res = await axios.get(
//       `/rtm/RTMDDL/GetCustomerDDL_new?AccountId=${accId}&BusinessUnitId=${buId}&TerrytoryId=${tId}`,
//     );
//     if (res?.status === 200) {
//       const listValue = res?.data?.map((item) => {
//         return item?.value;
//       });
//       if (listValue) {
//         getChannelByPartnerList(accId, buId, listValue, setter);
//       }
//     }
//   } catch (err) {
//     setter([]);
//   }
// };

// export const getChannelByPartnerList = async (
//   accId,
//   buId,
//   listValue,
//   setter,
// ) => {
//   try {
//     let res = await axios.post(
//       `/rtm/RTMDDL/GetDistributinChannelByPartnerIdListDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
//       listValue,
//     );
//     if (res?.status === 200) {
//       const listValue = res?.data?.map((item) => {
//         return item?.value;
//       });
//       if (listValue) {
//         const data = await getBrandingItemDDL(accId, buId, listValue);
//         setter(data);
//       }
//     }
//   } catch (err) {
//     setter([]);
//   }
// };

// export const getBrandingItemDDL = async (accId, buId, chanelList) => {
//   try {
//     let res = await axios.post(
//       `/rtm/RTMCommonProcess/GetOutletItemInfoByChanelList?AccountId=${accId}&BUnitId=${buId}`,
//       chanelList,
//     );
//     if (res?.status === 200) {
//       return res?.data?.map((item) => {
//         return {
//           ...item,
//           value: item?.itemId,
//           label: item?.itemName,
//         };
//       });
//     }
//   } catch (err) {
//     return [];
//   }
// };

export const getItemSubCategoryApiDDL = async (
  accId,
  buId,
  itemCat,
  setter,
) => {
  try {
    let res = await axios.get(
      `/item/ItemSubCategory/GetItemSubCategoryDDLByCategoryId?accountId=${accId}&businessUnitId=${buId}&itemCategoryId=${itemCat}&typeId=10`,
    );
    if (res?.status === 200) {
      let dataMapping = res?.data.map((data) => {
        return {
          ...data,
          value: data.id,
          label: data.itemSubCategoryName,
        };
      });
      setter(dataMapping);
    }
  } catch (err) {
    setter([]);
  }
};

export const createOutlateAssetREquest = async (payload, setIsLoading, cb) => {
  setIsLoading(true);
  try {
    let res = await axios.post(
      `/rtm/OutletAssetRequest/CreateOutletAssetRequestHeader`,
      payload,
    );
    if (res?.status === 200) {
      Toast.show({
        text: 'Create Successfully' || res?.data?.message,
        type: 'success',
        duration: 3000,
      });
      setIsLoading(false);
      cb();
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

export const getSingleDataById = async (id, setter, setRowDto) => {
  try {
    let res = await axios.get(
      `/rtm/OutletAssetRequest/GetOutletAssetRequestDetailsByHeader?AssetRequestId=${id}`,
    );
    if (res?.status === 200) {
      let obj = {
        ...res?.data?.objHeader,
        routeName: {
          value: res?.data?.objHeader?.routeid,
          label: res?.data?.objHeader?.routeName,
        },
        beatName: {
          value: res?.data?.objHeader?.beatid,
          label: res?.data?.objHeader?.beatName,
        },
        outlet: {
          value: res?.data?.objHeader?.outletid,
          label: res?.data?.objHeader?.outletName,
        },
        outletLicense: res?.data?.objHeader?.outletOwnerTradeLicenseNo,
        outletOwnerId: res?.data?.objHeader?.outlerOwnerNid,
        requiredDate: _dateFormatter(res?.data?.objHeader?.dteRequiredDate),
        salesItem: {
          value: res?.data?.objHeader?.maxSalesItemId,
          label: res?.data?.objHeader?.maxSalesItemName,
        },
        salesAmount: res?.data?.objHeader?.numMonthlyAvgSalesAmount,
        brandingItem: res?.data?.objHeader?.brandingItemName,
        comments: res?.data?.objHeader?.narration,

        outletAddress: res?.data?.objHeader?.outletAddress,
        outletLicense: res?.data?.objHeader?.outletOwnerTradeLicenseNo,
        outletOwnerId: res?.data?.objHeader?.outlerOwnerNid,

        itemCategory: '',
        itemSubCategory: '',
        itemName: '',
        quantity: '',
        measurement: '',
        attachment: {uri: res?.data?.objHeader?.attachFileInfo},

        // Last Added
        assetSizeType: {
          value: res?.data?.objHeader?.assetSizeType,
          label: res?.data?.objHeader?.assetSizeType,
        },
      };
      setter(obj);

      let rowData = res?.data?.objRowlist?.map((data) => {
        return {
          ...data,
          assetName: data.assetItemName,
        };
      });
      setRowDto(rowData);
    }
  } catch (err) {
    Toast.show({
      text: err?.response?.data?.message || '',
      type: 'warning',
      duration: 3000,
    });
  }
};

export const editOutlateAssetRequest = async (payload, setIsLoading) => {
  setIsLoading(true);
  try {
    let res = await axios.put(
      `/rtm/OutletAssetRequest/EditOutletAssetRequestHeader`,
      payload,
    );
    if (res?.status === 200) {
      Toast.show({
        text: res?.data?.message || 'Updated Successfull',
        type: 'success',
        duration: 3000,
      });
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

import axios from 'axios';
import {Toast} from 'native-base';
import {_todayDate} from '../../../../common/functions/_todayDate';

// ==========================
//    FOR LANDING
// ==========================

export const GetOutletPreviousItemTransaction_api = async (
  accId,
  busId,
  terrytoryId,
  outletId,
  date,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetOutletPreviousItemTransaction?AccountId=${accId}&BusinessUnitId=${busId}&TerrytoryId=${terrytoryId}&OutletId=${outletId}&ToDate=${date}`,
    );
    if (res?.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
      } else {
        // toast.warning("data not found");
        setter([]);
      }
    }
  } catch (error) {
    setter([]);
  }
};

export const getViewInfobyOrder = async (orderId, setter, setItems) => {
  try {
    const res = await axios.get(
      `/rtm/SecondaryOrder/GetSecondaryOrderById?OrderId=${orderId}`,
    );

    let value = res?.data?.objHeader;
    let items = res?.data?.objRow;
    // Last Change | Assign By Ikbal Bhai
    let total = value?.totalOrderAmount?.toFixed(3)
      ? value?.totalOrderAmount?.toFixed(3)
      : value?.totalOrderAmount;
    const initData = {
      territory: {
        value: value?.territoryId,
        label: value?.territoryName,
      },
      route: {
        value: value?.routeId,
        label: value?.routeName,
      },
      distributorName: {
        value: value?.businessPartnerId,
        label: value?.businessPartnerName,
      },
      beat: {
        value: value?.beatId,
        label: value?.beatName,
      },
      outlet: {
        value: value?.outletid,
        label: value?.outletName,
      },
      distributionChannel: {
        value: value?.distributionChannelId,
        label: value?.distributionChannelName,
      },
      advanceAmount: value?.receiveAmount.toString(),
      totalOrderAmount: total?.toString(),
    };

    const rowDto = res?.data?.objRow?.map((item) => ({
      ...item,
      quantity: item?.orderQuantity,
      pendingDeliveryQuantity: item?.deliveryQuantity,
      numFreeDelvQty: item?.numFreeDelvQty,
      freeProductId: item?.freeProductId,
      freeProductName: item?.freeProductName,
      itemRate: item?.price,
      itemName: item?.productName,
      itemId: item?.productId,
      uomName: item?.uomname,
      uomId: item?.uomid,
    }));


    setter(rowDto);
    setItems(items);
  } catch (err) {}
};

export const getDistributorAndChannel = async (
  accId,
  buId,
  terrytoryId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetBusinessPartnerWithChannelInfo?AccountId=${accId}&BusinessUnitId=${buId}&TerrytoryId=${terrytoryId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getRetaliOrderLandingData = async (
  accId,
  buId,
  territoryId,
  routeId,
  beatId,
  date,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/SecondaryOrder/GetSecondaryOrderPasignation?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${territoryId}&RouteID=${routeId}&BeatId=${beatId}&orderDate=${date}&viewOrder=desc&PageNo=0&PageSize=50`,
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};

export const getTotalOutlet = async (
  accId,
  buId,
  routeId,
  fromDate,
  setter,
) => {
  // setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/TotalOutletVisitedInfo?AccountId=${accId}&BusinessUnitId=${buId}&RouteId=${routeId}&FromDate=${fromDate}`,
      // `/rtm/RTMCommonProcess/TotalOrderInfo?AccountId=2&BusinessUnitId=172&TerritoryId=454&FromDate=2021-05-31`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getTotalOrderInfo = async (
  accId,
  buId,
  territoryId,
  fromDate,
  setter,
) => {
  // setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/TotalOrderInfo?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${territoryId}&FromDate=${fromDate}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getTotalOrderInfo_action = async (
  accId,
  buId,
  territoryId,
  fromDate,
  setter,
) => {
  // setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/TotalOrderInfo?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${territoryId}&FromDate=${fromDate}`,
    );
    setter(res?.data);
  } catch (err) {}
};

// ==========================
//    FOR EDIT
// ==========================

export const getItemInfoDDL = async (
  accId,
  buId,
  channelId,
  ProductTypeId,
  itemRowData,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetOutletItemInfo?AccountId=${accId}&BUnitId=${buId}&ChannelId=${channelId}&ProductTypeId=${ProductTypeId}`,
    );

    const modifyData = res?.data?.map((item) => ({
      ...item,
      quantity: 0,
      itemName: item?.itemCode,
    }));

    let payload = {...itemRowData};
    payload[ProductTypeId] = modifyData;

    setter(payload);
  } catch (err) {}
};

export const editSecondaryOrder = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/rtm/SecondaryOrder/EditSecondaryOrder`,
      payload,
    );

    setLoading(false);
    Toast.show({
      text: res?.data?.message || 'edited Successfull',
      type: 'success',
      duration: 3000,
    });

    cb();
  } catch (err) {
    // alert(err.response.data.message)
    // console.log(JSON.stringify(err,null,2))
    setLoading(false);
    Toast.show({
      text: err?.response?.data?.message,
      type: 'danger',
      duration: 3000,
    });
  }
};

export const getRetailOrderById = async (id, setter, setRowDto) => {
  try {
    const res = await axios.get(
      `/rtm/SecondaryOrder/GetSecondaryOrderById?OrderId=${id}`,
    );
    const values = res?.data?.objHeader;
    const data = {
      totalOrderAmount: values?.totalOrderAmount?.toString(),
      territory: {
        value: values?.territoryId,
        label: values?.territoryName,
      },
      route: {
        value: values?.routeId,
        label: values?.routeName,
      },
      selectVehicle: {
        value: values?.vehicleId,
        label: values?.vehicleNo,
      },
      beat: {
        value: values?.beatId,
        label: values?.beatName,
      },
      outlet: {
        value: values?.outletid,
        label: values?.outletName,
      },
      distributorName: {
        value: values?.businessPartnerId,
        label: values?.businessPartnerName,
      },
      distributorChannel: {
        value: values?.distributionChannelId,
        label: values?.distributionChannelName,
      },
      advanceAmount: values?.receiveAmount?.toString() || '0',
    };

    const rowDto = res?.data?.objRow?.map((item) => ({
      ...item,
      quantity: item?.orderQuantity,
      pendingDeliveryQuantity: item?.deliveryQuantity,
      numFreeDelvQty: item?.numFreeDelvQty,
      freeProductId: item?.freeProductId,
      freeProductName: item?.freeProductName,
      itemRate: item?.price,
      itemName: item?.productName,
      itemId: item?.productId,
      uomName: item?.uomname,
      uomId: item?.uomid,
    }));
    setter(data);
    setRowDto(rowDto);
  } catch (err) {}
};

export const freQtyOnChangeHandelarFunc = async (
  buId,
  values,
  item,
  index,
  setRowData,
  newRowData,
) => {
  const payload = {
    unitId: buId,
    partnerId: values?.distributor?.value,
    channelId: values?.distributorChannel?.value,
    itemId: item?.itemId,
    quantity:
      +item?.pendingDeliveryQuantity || +item?.orderQty || +item?.quantity,
    pricingDate: _todayDate(),
    serialNo: +index,
    uomId: item?.uomId,
    uomName: item?.uomName,
  };

  try {
    const res = await axios.post(
      `/rtm/TradeOfferGet/SalesOrderDiscount`,
      payload,
    );

    if (res?.status === 200) {
      // fliter free items
      const isFreeItem = res?.data?.item?.filter((itm) => itm?.isFree);
      // sum total Free item quantities
      const numFreeDelvQty = isFreeItem.reduce(
        (acc, cur) => (acc += cur?.quantity),
        0,
      );
      let modified = [...newRowData];
      modified[index]['numFreeDelvQty'] = numFreeDelvQty || 0;
      modified[index]['freeProductId'] = isFreeItem?.[0]?.itemId || 0;
      modified[index]['freeProductName'] = isFreeItem?.[0]?.itemName || '';
      setRowData(modified);
    }
  } catch (err) {}
};


export const getItemDDLForEdit = async (
  accId,
  buId,
  channelId,
  setter,
) => {
  // setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetOutletItemInfoDDL?AccountId=${accId}&BUnitId=${buId}&ChannelId=${channelId}`
    );

    const modifyData = res?.data?.map(item => ({
      ...item,
      value: item?.itemId,
      label: item?.itemCode
    }))
    setter(modifyData);
    // console.log(JSON.stringify(modifyData,null,2))
  } catch (err) {}
};
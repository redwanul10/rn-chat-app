/* eslint-disable no-alert */
import axios from 'axios';
import {Toast} from 'native-base';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import {_todayDate} from '../../../../common/functions/_todayDate';

export const getSummaryDeliveryLandingData = async (
  fromDate,
  toDate,
  dId,
  channelId,
  setIsLoading,
  setter,
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/DailySecondaryDelivery/DailySecondaryDeliveryLandingPasignation?FromDate=${fromDate}&ToDate=${toDate}&DistributorId=${dId}&ChannelId=${channelId}&PageNo=${0}&PageSize=${100000}&vieworder=desc`,
    );
    if (res?.status === 200) {
      setter(res?.data);
      setIsLoading(false);
    }
  } catch (err) {
    setter({data: []});
    setIsLoading(false);
  }
};

export const getVehicleDDL = async (accId, buId, disId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetVehicleInfoByRouteId?AccountId=${accId}&BusinessUnitId=${buId}&DistributorId=${disId}
      `,
    );
    if (res?.status === 200) {
      setter([{value: 0, label: 'No Vehicle'}, ...res?.data]);
    } else {
      setter([{value: 0, label: 'No Vehicle'}]);
    }
  } catch (err) {
    setter([{value: 0, label: 'No Vehicle'}]);
  }
};

export const getdistributorChannelNameDDL = async (
  accId,
  buId,
  prId,
  setter,
  setFieldValue,
) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetDistributinChannelByPartnerIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&BusinessPartnetId=${prId}`,
    );
    if (res?.status === 200) {
      setter(res?.data);
      setFieldValue && setFieldValue('distributionChannel', res?.data[0]);
    }
  } catch (err) {
    setter([]);
    setFieldValue && setFieldValue('distributionChannel', '');
  }
};

export const getItemDDL = async (setter, accId, buId, chId, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetOutletItemInfo?AccountId=${accId}&BUnitId=${buId}&ChannelId=${chId}`,
    );
    if (res?.status === 200 && res?.data) {
      let newArray = res.data.map((item) => {
        return {
          orderId: 0,
          rowId: 0,
          itemId: item.itemId,
          itemName: item.itemName,
          uomId: item.uomId,
          orderQty: 0,
          rate: item?.itemRate,
          uomName: item?.uomName,
          amount: 0,
          numFreeDelvQty: item?.numFreeDelvQty || 0,
          freeProductId: item?.freeProductId || 0,
          freeProductName: item?.freeProductName || '',
        };
      });
      setter(newArray);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const freQtyOnChangeHandelarFunc = (
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
    channelId: values?.distributionChannel?.value,
    itemId: item?.itemId,
    quantity: +item?.orderQty,
    pricingDate: _todayDate(),
    serialNo: +index,
    uomId: item?.uomId,
    uomName: item?.uomName,
  };
  SalesOrderDiscount_api(payload, setRowData, newRowData, index, item);
};

export const SalesOrderDiscount_api = async (
  data,
  setRowData,
  newRowData,
  index,
  rowItem,
) => {
  let modified = [...newRowData];
  try {
    const res = await axios.post(`/rtm/TradeOfferGet/SalesOrderDiscount`, data);
    if (res?.status === 200) {
      const isFreeItem = res?.data?.item?.filter((itm) => itm?.isFree);
      const numFreeDelvQty = isFreeItem.reduce(
        (acc, cur) => (acc += cur?.quantity),
        0,
      );

      modified[index]['numFreeDelvQty'] = numFreeDelvQty || 0;
      modified[index]['freeProductId'] = isFreeItem?.[0]?.itemId || 0;
      modified[index]['freeProductName'] = isFreeItem?.[0]?.itemName || '';
      setRowData(modified);
    }
  } catch (error) {
    modified[index]['numFreeDelvQty'] = 0;
    modified[index]['freeProductId'] = 0;
    modified[index]['freeProductName'] = '';
    setRowData(modified);
  }
};

export const createSummaryDeliveryOrder = async (payload, setIsLoading, cb) => {
  setIsLoading(true);
  try {
    let res = await axios.post(
      `/rtm/DailySecondaryDelivery/CreateDailySecondaryDelivery`,
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
    if (err?.response?.status === 500) {
      Toast.show({
        text: err?.response?.data?.message,
        type: 'warning',
        duration: 3000,
      });
      setIsLoading(false);
    }
  }
};

export const getSummaryDeliveryById = async (
  deliveryId,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    let res = await axios.get(
      `/rtm/DailySecondaryDelivery/GetSecondaryDelivaryById?DelivaryId=${deliveryId}`,
    );
    if (res?.status === 200) {
      let header = res?.data?.objHeader;
      let objRow = res?.data?.objRow;

      const obj = {
        route: {
          value: header[0]?.routId,
          label: header[0]?.routName,
        },
        beat: {
          value: header[0]?.beatId,
          label: header[0]?.beatName,
        },
        distributionChannel: {
          value: header[0]?.distributorChannel,
          label: header[0]?.distributorChannelName,
        },
        orderId: header[0]?.orderId,
        receiveAmount: header[0]?.receiveAmount,
        row: objRow,
        vehicle: {
          value: header[0]?.vehicleId,
          label: header[0]?.vehicleNo,
        },
      };
      setter(obj);
      setLoading(false);
    }
  } catch (err) {
    Toast.show({
      text: err?.response?.data?.message,
      type: 'warning',
      duration: 3000,
    });
    setLoading(false);
  }
};

import axios from 'axios';
import {Toast} from 'native-base';
import {_todayDate} from '../../../../../common/functions/_todayDate';

export const getVehicleDDL = async (accId, buId, distributorId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetVehicleInfoByRouteId?AccountId=${accId}&BusinessUnitId=${buId}&DistributorId=${distributorId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getDistributorChannel = async (accId, buId, partnerId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetDistributinChannelByPartnerIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&BusinessPartnetId=${partnerId}`,
    );

    setter(res?.data[0] || {});
    return res?.data[0] || {};
  } catch (err) {}
};

export const getItemInfoDDL = async (
  accId,
  buId,
  channelId,
  ProductTypeId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetOutletItemInfo?AccountId=${accId}&BUnitId=${buId}&ChannelId=${channelId}&ProductTypeId=${ProductTypeId}`,
    );

    const modifyData = res?.data.map((item) => ({
      ...item,
      pendingDeliveryQuantity: 0,
      itemName: item?.itemCode, // Assign By Iftakhar Alam
    }));
    setter(modifyData);
  } catch (err) {
    // console.log(err);
    // alert(err.response.data.message);
  }
};

export const createSecondaryCollection = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/rtm/SecondaryDelivery/CreateSecondaryDeliveryCollection`,
      payload,
    );

    setLoading(false);

    Toast.show({
      text: res.data?.message || 'Created Successfull',
      type: 'success',
      duration: 3000,
    });

    // cb();
  } catch (err) {
    setLoading(false);
    Toast.show({
      text: err.response.data.message,
      type: 'danger',
      duration: 3000,
    });
  }
};

export const createRetailOrderDirectDelivery = async (
  payload,
  setLoading,
  cb,
) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/rtm/RetailDeliveryWithoutOrder/CreateRetailDeliveryWithoutOrderApps`,
      payload,
    );

    setLoading(false);

    Toast.show({
      text: res.data?.message || 'Created Successfull',
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

export const editRetailOrderDirectDelivery = async (payload, setIsLoading) => {
  setIsLoading(true);
  // console.log('hello');
  try {
    let res = await axios.put(
      `/rtm/DailySecondaryDelivery/EditDailySecondaryDelivery`,
      payload,
    );

    if (res?.status === 200) {
      // console.log('direct delivery', JSON.stringify(payload, null, 2));
      Toast.show({
        text: res.data?.message || 'Created Successfull',
        type: 'success',
        duration: 3000,
      });
      setIsLoading(false);
    }
  } catch (err) {
    Toast.show({
      text: err.response.data.message,
      type: 'danger',
      duration: 3000,
    });
    setIsLoading(false);
  }
};

export const SalesOrderDiscount_api = async (
  data,
  setRowData,
  newRowData,
  index,
  rowItem,
) => {
  try {
    const res = await axios.post(`/rtm/TradeOfferGet/SalesOrderDiscount`, data);
    if (res?.status === 200) {
      const isFreeItem = res?.data?.item?.filter((itm) => itm?.isFree);
      const numFreeDelvQty = isFreeItem.reduce(
        (acc, cur) => (acc += cur?.quantity),
        0,
      );
      let modified = [...newRowData];
      modified[index]['numFreeDelvQty'] = numFreeDelvQty || 0;
      modified[index]['freeProductId'] = isFreeItem?.[0]?.itemId || 0;
      modified[index]['freeProductName'] = isFreeItem?.[0]?.itemName || '';
      setRowData(modified);
      // console.log('modified data', JSON.stringify(modified[index], null, 2));
    }
  } catch (err) {
    // console.log('error happened', JSON.stringify(err, null, 2));
    // toast.error(error?.response?.data?.message);
    Toast.show({
      text: err?.response?.data?.message,
      type: 'danger',
      duration: 3000,
    });
  }
};

export const freQtyOnChangeHandelarFunc = async (
  buId,
  values,
  item,
  index,
  setRowData,
  newRowData,
) => {
  try {
    const payload = {
      unitId: buId,
      partnerId: values?.distributor?.value,
      channelId: values?.distributorChannel?.value,
      itemId: item?.itemId,
      quantity: +item?.pendingDeliveryQuantity || +item?.orderQty,
      pricingDate: _todayDate(),
      serialNo: +index,
      uomId: item?.uomId,
      uomName: item?.uomName,
    };

    // console.log('post payload0', JSON.stringify(payload, null, 2));
    // return;

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
      // console.log('modified data', JSON.stringify(modified[index], null, 2));
    }
    // console.log(res?.data);
  } catch (err) {
    // console.log(err);
  }
};

export const getDirectDeliveryById = async (deliveryId, setter, setRowDto) => {
  try {
    let res = await axios.get(
      `/rtm/RetailDeliveryWithoutOrder/GetRetailDeliveryWithoutOrderById?deliveryId=${deliveryId}`,
    );
    if (res?.status === 200) {
      let header = res?.data?.objHeader[0];
      let objRow = res?.data?.objRow;

      const obj = {
        route: {
          value: header?.routId,
          label: header?.routName,
        },
        beat: {
          value: header?.beatId,
          label: header?.beatName,
        },
        territory: {
          value: header?.territoryid,
          label: header?.territoryName || '',
        },
        distributor: {
          value: header?.businessPartnerId,
          label: header?.businessPartnerName,
        },
        distributorChannel: {
          value: header?.distributorChannel,
          label: header?.distributorChannelName,
        },
        outlet: {
          value: header?.outletId,
          label: header?.outletName,
        },
        orderId: header?.orderId,
        /* Assign By Iftakhar Alam */
        totalReceiveAmount: header?.monReceiveAmount?.toFixed(3)
          ? header?.monReceiveAmount?.toFixed(3)
          : header?.monReceiveAmount,
        vehicle: {
          value: header?.vehicleId,
          label: header?.vehicleNo,
        },
      };

      const rowDto = objRow?.map((item) => ({
        ...item,
        pendingDeliveryQuantity: item?.numDeliveryQuantity,
        numFreeDelvQty: item?.numFreeDelvQty,
        freeProductId: item?.freeProductId,
        freeProductName: item?.freeProductName,
        itemRate: item?.numPrice,
        itemName: item?.strProductName,
        itemId: item?.intProductId,
        uomName: item?.strUomname,
        uomId: item?.intUomid,
      }));

      setter(obj);
      setRowDto(rowDto);
    }
  } catch (err) {}
};

export const uploadCapturedImage = (selectedFile, cb) => {
  if (!selectedFile?.base64) return;

  const imagePayload = [
    {
      data: selectedFile?.base64,
      fileName: selectedFile?.fileName,
    },
  ];

  axios
    .post('/domain/Document/UploadFileBaseSixtyFour', imagePayload)
    .then((res) => {
      // setImageId(res?.data[0]?.id);
      cb(res?.data[0]?.id);
      // alert('image uploaded');
    })
    .catch((err) => {
      // console.log('image error', JSON.stringify(err, null, 2));

      Toast.show({
        text: 'Image not Uploaded',
        type: 'danger',
        duration: 3000,
      });
    });
};

import axios from 'axios';
import {Toast} from 'native-base';
import {_todayDate} from '../../../../../common/functions/_todayDate';

export const getItemInfoDDL = async (
  accId,
  buId,
  channelId,
  ProductTypeId,
  itemRowData,
  setter,
) => {
  console.log(
    `/rtm/RTMCommonProcess/GetOutletItemInfo?AccountId=${accId}&BUnitId=${buId}&ChannelId=${channelId}&ProductTypeId=${ProductTypeId}`,

  )
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetOutletItemInfo?AccountId=${accId}&BUnitId=${buId}&ChannelId=${channelId}&ProductTypeId=${ProductTypeId}`,
    );

    const modifyData = res?.data?.map((item, index) => ({
      ...item,
      quantity: 0,
      itemName: item?.itemCode,
      position: index,
    }));

    let payload = {...itemRowData};
    payload[ProductTypeId] = modifyData;

    setter(payload);
  } catch (err) {}
};

export const getBrandNameDDL = async (accId, buId, channelId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetBrandName?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}`,
    );
    setter(res?.data);
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
    // alert("error")
  }
};

export const getCheckInOutInfo = async (
  accId,
  buId,
  routeId,
  beatId,
  outletId,
  date,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetoutletCheckInOutInfo?AccountId=${accId}&BusinessUnitId=${buId}&RouteId=${routeId}&BeatId=${beatId}&OutletId=${outletId}&recordDate=${date}`,
    );

    setter(res?.data);
  } catch (err) {}
};

export const getOutletNameDDL = async (accId, buId, roId, beatId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetOutletNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&RouteId=${roId}&BeatId=${beatId}`,
      // `/rtm/RTMDDL/GetOutletNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&RouteId=${roId}&BeatId=${beatId}`,
    );

    const modify = res?.data?.map((item) => ({
      ...item,
      label: `${item?.label} ${item?.isOrderDone ? '(ordered)' : ''}`,
    }));
    setter(modify);
  } catch (err) {}
};

export const getOutletNameDDLForSO = async (
  accId,
  buId,
  roId,
  beatId,
  setter,
) => {
  // console?.log( `/rtm/RTMDDL/GetOutletForSalesForce?AccountId=${accId}&BusinessUnitId=${buId}&RouteId=${roId}&BeatId=${beatId}`,)
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetOutletForSalesForce?AccountId=${accId}&BusinessUnitId=${buId}&RouteId=${roId}&BeatId=${beatId}`,
    );

    const modify = res?.data?.map((item) => ({
      ...item,
      label: `${item?.label} ${item?.isOrderDone ? '(ordered)' : ''}`,
    }));
    setter(modify);
  } catch (err) {}
};

export const createSecondaryOrder = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/rtm/SecondaryOrder/CreateSecondaryOrder`,
      payload,
    );

    setLoading(false);
    Toast.show({
      text: res?.data?.message || 'Created Successfull',
      buttonText: 'close',
      type: 'success',
      duration: 3000,
    });

    cb();
  } catch (err) {
    // alert(err.response.data.message)
    setLoading(false);
    Toast.show({
      text: err?.response?.data?.message,
      buttonText: 'close',
      type: 'danger',
      duration: 3000,
    });
  }
};

export const outletCheckin = async (payload, setLoading, cb) => {
  setLoading(true);

  try {
    const res = await axios.post(
      `/rtm/RTMCommonProcess/CreateoutletCheckIn`,
      payload,
    );

    // Toast.show({
    //   text: res?.data?.message || 'Created Successfull',
    //   // buttonText: 'close',
    //   type: 'success',
    //   duration: 3000,
    // });
    cb();
    setLoading(false);
  } catch (err) {
    Toast.show({
      text: err?.response?.data?.message,
      // buttonText: 'close',
      type: 'danger',
      duration: 3000,
    });
    setLoading(false);
  }
};

export const freQtyOnChangeHandelarFunc = async (
  buId,
  values,
  item,
  index,
  setRowData,
  rowData,
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
      let modified = [...rowData[values?.productType?.value]];
      modified[index]['numFreeDelvQty'] = numFreeDelvQty || 0;
      modified[index]['freeProductId'] = isFreeItem?.[0]?.itemId || 0;
      modified[index]['freeProductName'] = isFreeItem?.[0]?.itemName || '';

      let payload = {...rowData};
      payload[values?.productType?.value] = [...modified];
      setRowData(payload);
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
      Toast.show({
        text: 'Image not Uploaded',
        type: 'danger',
        duration: 3000,
      });
    });
};

import axios from 'axios';
import {Toast} from 'native-base';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';

export const getAssetDDL = async (accId, buId, outletId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetReceiveItemDDL?AccountId=${accId}&BusinessUnitId=${buId}&OutletID=${outletId}`,
    );
    setter(res?.data);
  } catch (err) {}
};
export const getLandingData = async (
  accId,
  buId,
  outletId,
  setLoading,
  setter,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/OutletBillInfo/GetOutletBillInfoPagination?AccountId=${accId}&BusinessUnitId=${buId}&OutletId=${outletId}&viewOrder=desc&PageNo=0&PageSize=1000`,
    );
    setter(res?.data);
    setLoading(false);
    // console.log('grid data', JSON.stringify(res?.data, null, 2));
  } catch (err) {
    setLoading(false);
    // alert('errors');
  }
};
export const getOutletViewData = async (
  outletBillId,
  accId,
  buId,
  singleData,
) => {
  try {
    let res = await axios.get(
      `/rtm/OutletBillInfo/GetOutletBillInfoById?OutletBillId=${outletBillId}`,
    );

    if (res?.status === 200) {
      const objHeader = res?.data[0];
      // console.log(res?.data[0]);

      if (objHeader) {
        let resTwo = await axios.get(
          `/rtm/AssetReceived/GetReceiveDetailByItemId?AccountId=${accId}&BusinessUnitId=${buId}&OutletID=${objHeader?.outletid}&ItemID=${objHeader?.assetItemId}`,
        );
        // Make your payload object here and pass it into single data or row data
        const payload = {
          outletAddress: objHeader?.outletAddress,
          itemName: {
            value: objHeader?.assetItemId,
            label: objHeader?.itemtName,
          },
          receiveQty: resTwo?.data[0]?.totalAssetReceiveQty.toString(),
          commentsHeader: resTwo?.data[0]?.narration,

          // Row Form
          billRequestAmount: objHeader?.numOutletBillAmount.toString(),
          billRequestDate: _dateFormatter(objHeader?.dteOutletBillDate),
          commentsRow: objHeader?.narration,
          attachment: objHeader?.strFileName,
        };
        singleData(payload);
        // console.log(JSON.stringify(res, null, 2));
      }
    }
  } catch (err) {
    // alert();
    // console.log(err);
  }
};

export const getValuesAgainstAsset = async (
  accId,
  buId,
  outletId,
  itemId,
  setFieldValue,
) => {
  try {
    const res = await axios.get(
      `/rtm/AssetReceived/GetReceiveDetailByItemId?AccountId=${accId}&BusinessUnitId=${buId}&OutletID=${outletId}&ItemID=${itemId}`,
    );
    if (res?.status === 200) {
      setFieldValue(
        'receiveQuantity',
        res?.data[0]?.totalAssetReceiveQty.toString(),
      );
      setFieldValue('comments', res?.data[0]?.narration);
      setFieldValue(
        'billRequestAmount',
        res?.data[0]?.totalAmountOfReceiveQty.toString(),
      );
    }
  } catch (err) {}
};

export const createOutletBillRequest = async (payload, setLoading) => {
  setLoading(true);
  // console.log('payl', JSON.stringify(payload, null, 2));
  try {
    const res = await axios.post(
      `/rtm/OutletBillInfo/CreateOutletBillInfo`,
      payload,
    );
    setLoading(false);
    // alert('success');
    Toast.show({
      text: res?.data?.message || 'Create Successfull',
      type: 'success',
      duration: 3000,
    });
  } catch (err) {
    // alert('error');
    // console.log('err', err);
    setLoading(false);
    Toast.show({
      text: err.response.data.message,
      type: 'danger',
      duration: 3000,
    });
  }
};

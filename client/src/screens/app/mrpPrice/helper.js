import axios from 'axios';
import {Toast} from 'native-base';

export const getMrpPrice = async (accountId, businessunitId, grid, setter) => {
  

  const payload = {
    item: grid
      ?.filter((item) => item?.quantity || item?.pendingDeliveryQuantity)
      ?.map((item) => {
        return {
          ...item,
          qty: Number(item?.quantity || item?.pendingDeliveryQuantity),
          case: 0,
        };
      }),
    accountId,
    businessunitId,
    date: new Date(),
  };


  try {
    const res = await axios.post(`/rtm/RetailPrice/GetOrderPriceInfo`, payload);
    if (res?.status === 200) {
      console.log(JSON.stringify(res?.data,null,2))
      setter(res?.data);
    }
  } catch (error) {
    console.log(JSON.stringify(error,null,2))
    setter([]);
    Toast.show({
      text: error?.response?.data?.message,
      type: 'warning',
      duration: 3000,
    });
  }
};

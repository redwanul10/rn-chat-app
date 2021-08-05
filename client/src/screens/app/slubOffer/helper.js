import axios from 'axios';
import {Toast} from 'native-base';

export const getSlubOffer = async (accountId, businessunitId, grid, setter) => {
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
    const res = await axios.post(`/rtm/SlabProgram/GetSlabProgram`, payload);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
    Toast.show({
      text: error?.response?.data?.message,
      type: 'warning',
      duration: 3000,
    });
  }
};

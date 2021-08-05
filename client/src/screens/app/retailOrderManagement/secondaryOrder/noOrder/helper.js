import axios from 'axios';
import {Toast} from 'native-base';

export const getOutletReasonDDL_api = async (accId, setter) => {
  try {
    let res = await axios.get(`/rtm/RTMDDL/OutletReasonDDL?AccountId=${accId}`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const createOutletReason = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/rtm/OutletReason/CreateOutletReasonInfo`,
      data,
    );
    if (res.status === 200) {
      Toast.show({
        text: res?.data?.message || 'created successful',
        type: 'success',
        duration: 3000,
      });
      setLoading(false);
      cb();
    }
  } catch (err) {
    setLoading(false);
    Toast.show({
      text: err?.response?.data?.message,
      type: 'danger',
      duration: 3000,
    });
  }
};

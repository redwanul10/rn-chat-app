/* eslint-disable no-alert */
import axios from 'axios';

export const getLandingData = async (
  routeId,
  distance,
  type,
  date,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/RTMDistanceReport/GetRTMDistanceReport?routeId=${routeId}&distance=${distance}&orderstatus=${type}&date=${date}`,
    );
    setter(res?.data);
    console.log('Res Data', JSON.stringify(res, null, 2));
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

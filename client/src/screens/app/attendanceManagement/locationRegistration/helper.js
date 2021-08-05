import axios from 'axios';
import {Toast} from 'native-base';

export const getTerritoryDDL = async (accId, busId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/TerritoryDDL?AccountId=${accId}&BusinessUnitId=${busId}`,
    );
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (err) {}
};

export const getCustomerDDL = async (accId, busId, territoryId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetCustomerDDL_new?AccountId=${accId}&BusinessUnitId=${busId}&TerrytoryId=${territoryId}`,
    );
    if (res.status === 200 && res.data) {
      const newData = [
        {
          value: 0,
          label: 'Others Customer',
        },
        ...res.data,
      ];
      setter(newData);
    }
  } catch (error) {}
};

export const registerLatLng = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(`/rtm/LangLatBook/SaveLangLatBook`, data);
    if (res.status === 200) {
      Toast.show({
        text: res?.data?.message || 'registered successful',
        type: 'success',

        duration: 3000,
      });
      setLoading(false);
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

export const getCheckInCheckOutTime = async (
  empId,
  todayDate,
  setTime,
  setLoading,
) => {
  if (setLoading) setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/EmployeeRemoteAttendance/GetEmployeeCheckInCheckOutTime?EmployeeId=${empId}&date=${todayDate}`,
      // `/hcm/EmployeeRemoteAttendance/GetEmployeeCheckInCheckOutTime?EmployeeId=${empId}&date=${todayDate}`
    );

    const data = res?.data;
    setTime(res?.data[0]);
    if (setLoading) setLoading(false);
  } catch (err) {
    if (setLoading) setLoading(false);
  }
};

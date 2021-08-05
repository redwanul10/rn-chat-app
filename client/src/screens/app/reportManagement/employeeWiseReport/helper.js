/* eslint-disable no-alert */
import axios from 'axios';

export const getLandingData = async (
  accId,
  buId,
  empId,
  date,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/RTMSalesReport/EmployeeWiseReport?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}&Date=${date}`,
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

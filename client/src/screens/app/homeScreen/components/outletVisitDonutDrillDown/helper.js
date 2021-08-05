/* eslint-disable no-alert */
import axios from 'axios';

export const getDrillDownGridData = async (
  accId,
  buId,
  date,
  levelId,
  territoryId,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/DashBoard/GetOutletVisitDrillDown?accountId=${accId}&businessUnitId=${buId}&date=${date}&level=${levelId}&Territory=${territoryId}`,
    );
    setter(
      res?.data?.map((item) => {
        return {
          ...item,
          totalPercentage: Number((item?.visited / item?.target) * 100),
        };
      }),
    );
    setLoading(false);
  } catch (err) {
    // console.log('Error', err);
    setter([]);
    setLoading(false);
  }
};

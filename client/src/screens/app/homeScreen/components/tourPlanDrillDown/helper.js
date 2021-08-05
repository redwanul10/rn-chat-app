/* eslint-disable no-alert */
import axios from 'axios';

export const getDrillDownGridData = async (
  accId,
  buId,
  empId,
  date,
  levelId,
  territoryId,
  setter,
  setLoading,
  type,
) => {
  setLoading(true);
  try {
    let res;
    if (type === 1) {
      // Route Plan
      res = await axios.get(
        `/rtm/RoutePlan/RoutePlanByLocationDeep?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}&Date=${date}`,
      );
    } else if (type === 2) {
      // Ranking
      res = await axios.get(
        `/rtm/RTMSalesReport/GetEmployeeRankingReport?AccountId=${accId}&BusinessUnitId=${buId}&LevelId=${levelId}&TerritoryId=${territoryId}`,
      );
    }
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    // console.log('Error ===', err);
    setter([]);
    setLoading(false);
  }
};

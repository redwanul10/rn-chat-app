import axios from 'axios';

export const getOutletLandingData = async (
  accId,
  buId,
  routeId,
  beatId,
  approve,
  check,
  setLoading,
  setter,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      // Beat Id 0 hard coded assigned by iftekhar vai
      `/rtm/OutletProfile/GetAppsOutletLandingPagination?accountId=${accId}&businessUnitid=${buId}&RouteId=${routeId}&BeatId=${beatId}&status=${approve}&PageNo=0&PageSize=10000&vieworder=desc&check=${check}`,
    );
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading(false);
  }
};

export const getRouteDDL = async (accId, buId, tId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/RouteByTerritoryIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${tId}`,
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

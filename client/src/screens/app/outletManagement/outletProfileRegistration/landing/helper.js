import axios from 'axios';

export const getLandingData = async (
  accId,
  buId,
  approve,
  territoryId,
  channelId,
  levelId,
  type,
  setLoading,
  setter,
) => {
  setLoading(true);

  try {
    const res = await axios.get(
      `/rtm/OutletRegistration/GetOultetRegistrationLanding?AccountId=${accId}&BusinessUnitId=${buId}&approve=${approve}&PageNo=0&PageSize=100&vieworder=desc&TerritoryId=${territoryId}&ChannelId=${channelId}&LevelId=${levelId}&Type=${type}`,
    );
    setLoading(false);
    setter(res?.data);
    // console.log(JSON.stringify(res?.data,null,2))
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

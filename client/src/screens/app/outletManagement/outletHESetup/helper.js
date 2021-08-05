import axios from 'axios';
import {Toast} from 'native-base';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';

export const getDistributorChannel = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getRegionDDL = async (accId, buId, channelId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetRegionByChannelIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getTerritoryDDLforHeSetup = async (
  accId,
  buId,
  channelId,
  areaId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetTerritoryDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}&AreaId=${areaId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getAreaDDL = async (accId, buId, channelId, regionId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetAreaDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}&RegionId=${regionId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getPointDDL = async (
  accId,
  buId,
  channelId,
  territoryId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetPointDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}&TerritoryId=${territoryId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getSectionDDL = async (
  accId,
  buId,
  channelId,
  pointId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetSectionDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}&PointId=${pointId}`,
    );
    setter(res?.data);
    // console.log('terer-', JSON.stringify(res?.data, null, 2));
  } catch (err) {}
};

export const getMonthDDL = async (setter) => {
  try {
    const res = await axios.get(`/rtm/RTMDDL/GetMonthDDl`);
    setter(res?.data);
  } catch (err) {}
};
export const getDateDDL = async (
  accId,
  buId,
  month,
  year,

  setFieldValue,
) => {
  try {
    const res = await axios.get(
      `/rtm/DamageConfiguration/GetDamageMonthConfigurationsByMonth?AccountId=${accId}&BusinessUnitId=${buId}&MonthId=${month}&YearId=${year}`,
    );
    // console.log('data===', JSON.stringify(res?.data, null, 2));

    setFieldValue('fromDate', _dateFormatter(res?.data?.startDate));
    setFieldValue('toDate', _dateFormatter(res?.data?.endDate));
  } catch (err) {}
};

export const getGridData = async (
  accId,
  buId,
  territoryId,
  monthId,
  yearId,
  setIsDataLoading,
  setter,
) => {
  // console.log(
  //   `/rtm/OutletHorizontalExponent/GetOutletHorizontalExponentById?accountId=${accId}&businessUnitId=${buId}&territoryId=${territoryId}&monthId=${monthId}&yearId=${yearId}`,
  // );

  setIsDataLoading(true);
  try {
    const res = await axios.get(
      `/rtm/OutletHorizontalExponent/GetOutletHorizontalExponentById?accountId=${accId}&businessUnitId=${buId}&territoryId=${territoryId}&monthId=${monthId}&yearId=${yearId}`,
    );
    setter(res?.data);
    setIsDataLoading(false);
    // console.log('grid data', JSON.stringify(res?.data, null, 2));
  } catch (err) {
    setIsDataLoading(false);
    // alert('errors');
  }
};

export const createOutletSetup = async (payload, setLoading) => {
  setLoading(true);
  // console.log('payl', JSON.stringify(payload, null, 2));
  try {
    const res = await axios.post(
      `/rtm/OutletHorizontalExponent/CreateOutletHorizontalExponent`,
      payload,
    );
    setLoading(false);
    // alert('success');
    Toast.show({
      text: res?.data?.message || 'Create Successfull',
      type: 'success',
      duration: 3000,
    });
  } catch (err) {
    // alert('error');
    // console.log('err', err);
    setLoading(false);
    Toast.show({
      text: err.response.data.message,
      type: 'danger',
      duration: 3000,
    });
  }
};
export const editOutletSetup = async (payload, setLoading) => {
  // console.log('hello');

  try {
    const res = await axios.put(
      `/rtm/OutletHorizontalExponent/EditOutletHorizontalExponent`,
      payload,
    );

    Toast.show({
      text: res?.data?.message || 'Edit Successfull',
      type: 'success',
      duration: 3000,
    });
  } catch (err) {
    Toast.show({
      text: err.response.data.message,
      type: 'danger',
      duration: 3000,
    });
  }
};

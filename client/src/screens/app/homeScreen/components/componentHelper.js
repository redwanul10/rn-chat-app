import axios from 'axios';

const commonDto = (value, label, key) => {
  return {
    value,
    label,
    key,
  };
};

export const getStrikeRateDashboardValue = async (
  accId,
  buId,
  fromDate,
  toDate,
  lvId,
  tId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/StrikeRate/GetOwnStrikeRate?accountId=${accId}&BusinessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&level=${lvId}&TerritoryId=${tId}`,
    );
    // console.log('Strike Rate Dashboard ==>', res?.data?.strikeRate);
    setter(
      'strikeRate',
      commonDto(res?.data?.strikeRate.toFixed(2), 'Strike Rate', 'strikeRate'),
    );
  } catch (err) {
    setter('strikeRate', commonDto(0, 'Strike Rate', 'strikeRate'));
  }
};

export const getLpcDashboardValue = async (
  accId,
  buId,
  fromDate,
  toDate,
  lavelId,
  territoryId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetLPCForDashbaord?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&Todate=${toDate}&LevelId=${lavelId}&TerritoryId=${territoryId}`,
    );
    // console.log('LPC Dashboard ==>', res?.data);
    setter('lpc', {
      value: res?.data.toFixed(2),
      label: 'LPC',
      key: 'lpc',
    });
  } catch (err) {
    setter('lpc', {
      value: 0,
      label: 'LPC',
      key: 'lpc',
    });
  }
};

export const getAchievementsDashboardValue = async (
  accId,
  buId,
  fromDate,
  toDate,
  lavelId,
  territoryId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetSalesTargetByAchievementForDashBoard?AccountId=${accId}&BusinessUnitId=${buId}&Date=${fromDate}&LevelId=${lavelId}&TerritoryId=${territoryId}`,
    );
    // console.log('Achieivements Dashboard ==>', res?.data);
    setter('achievements', {
      value: res?.data.toFixed(2),
      label: 'Sales Target Achievements',
      key: 'achievements',
    });
  } catch (err) {
    setter('achievements', {
      value: 0,
      label: 'Sales Target Achievements',
      key: 'achievements',
    });
  }
};

export const getProductivityDashboardValue = async (
  accId,
  buId,
  fromDate,
  toDate,
  lavelId,
  territoryId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/StrikeRate/GetOwnCallProductivity?accountId=${accId}&BusinessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&level=${lavelId}&TerritoryId=${territoryId}`,
    );
    // console.log('Productivity Call Dashboard ==>', res?.data?.callProductivity);
    setter('productivityCall', {
      value: res?.data?.callProductivity.toFixed(2)
        ? res?.data?.callProductivity.toFixed(2)
        : res?.data?.callProductivity,
      label: 'Call Productivity',
      key: 'productivityCall',
    });
  } catch (err) {
    // alert(err);
    setter('productivityCall', {
      value: 0,
      label: 'Call Productivity',
      key: 'productivityCall',
    });
  }
};

export const getNoBillDashboardValue = async (
  accId,
  buId,
  fromDate,
  toDate,
  lavelId,
  territoryId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/StrikeRate/GetNoBill?accountId=${accId}&BusinessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&level=${lavelId}&TerritoryId=${territoryId}`,
    );
    // console.log('No BIll Dashboard ==>', res?.data[0]?.value);
    setter('noBill', {
      value: res?.data[0]?.value.toFixed(2) || 0,
      label: 'Non Bill',
      key: 'noBill',
    });
  } catch (err) {
    // alert(err);
    setter('noBill', {
      value: 0,
      label: 'Non Bill',
      key: 'noBill',
    });
  }
};

export const getRegulerBillDashboardValue = async (
  accId,
  buId,
  fromDate,
  toDate,
  lavelId,
  territoryId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/StrikeRate/GetRegularBill?accountId=${accId}&BusinessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&level=${lavelId}&TerritoryId=${territoryId}`,
    );
    // console.log('Numeric Bill Dashboard ==>', res?.data[0]?.value);
    setter('numericBill', {
      value: res?.data[0]?.value.toFixed(2) || 0,
      label: 'Numeric Distribution',
      key: 'numericBill',
    });
  } catch (err) {
    // alert(err);
    setter('numericBill', {
      value: 0,
      label: 'Numeric Distribution',
      key: 'numericBill',
    });
  }
};

export const getHEDashboardValue = async (
  accId,
  buId,
  fromDate,
  toDate,
  lavelId,
  territoryId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetHEForDashbaord?AccountId=${accId}&BusinessUnitId=${buId}&LevelId=${lavelId}&TerritoryId=${territoryId}`,
    );
    // console.log('HE Dashboard ==>', res?.data);
    setter('he', {
      value: res?.data.toFixed(2) || 0,
      label: 'HE',
      key: 'he',
    });
  } catch (err) {
    setter('he', {
      value: 0,
      label: 'HE',
      key: 'he',
    });
  }
};

export const getADTDashboardValue = async (
  accId,
  buId,
  fromDate,
  toDate,
  lavelId,
  territoryId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetADTForDashBoard?AccountId=${accId}&BusinessUnitId=${buId}&LevelId=${lavelId}&TerritoryId=${territoryId}`,
    );
    // console.log('ADT Dashboard ==>', res?.data);
    setter('adt', {
      value: res?.data || 0,
      label: 'ADT',
      key: 'adt',
    });
  } catch (err) {
    setter('adt', {
      value: 0,
      label: 'ADT',
      key: 'adt',
    });
  }
};

export const getRADTDashboardValue = async (
  accId,
  buId,
  fromDate,
  toDate,
  lavelId,
  territoryId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetRADTForDashBoard?AccountId=${accId}&BusinessUnitId=${buId}&LevelId=${lavelId}&TerritoryId=${territoryId}`,
    );
    // console.log('RADT Dashboard ==>', res?.data);
    setter('radt', {
      value: res?.data || 0,
      label: 'RADT',
      key: 'radt',
    });
  } catch (err) {
    setter('radt', {
      value: 0,
      label: 'RADT',
      key: 'radt',
    });
  }
};

export const getPJPDashboardValue = async (
  accId,
  buId,
  fromDate,
  toDate,
  lavelId,
  territoryId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/PivotReport/GetPGPReportDashBoard?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&LevelId=${lavelId}&TerritoryId=${territoryId}`,
    );
    setter('pjp', {
      value: res?.data.toFixed(2) || 0,
      label: 'PJP',
      key: 'pjp',
    });
  } catch (err) {
    setter('pjp', {
      value: 0,
      label: 'PJP',
      key: 'pjp',
    });
  }
};

export const getVPCDashboardValue = async (
  accId,
  buId,
  fromDate,
  toDate,
  lavelId,
  territoryId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/PivotReport/GetVPCDashboard?AccountId=${accId}&BusinessUnitId=${buId}&LevelId=${lavelId}&TerritoryId=${territoryId}`,
    );
    setter('vpc', {
      value: res?.data.toFixed(0) || 0,
      label: 'VPC',
      key: 'vpc',
    });
  } catch (err) {
    setter('vpc', {
      value: 0,
      label: 'VPC',
      key: 'vpc',
    });
  }
};

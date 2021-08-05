/* eslint-disable no-alert */
import axios from 'axios';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';

export const getStartAndEndDate = async (
  accId,
  buId,
  monthId,
  yearId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/DamageConfiguration/GetDamageMonthConfigurationsByMonth?AccountId=${accId}&BusinessUnitId=${buId}&MonthId=${monthId}&YearId=${yearId}`,
    );
    // console.log('Res Current Month Date', res?.data);
    setter('fromDate', _dateFormatter(res?.data?.startDate));
    setter('toDate', _dateFormatter(res?.data?.endDate));
  } catch (err) {
    // setter('fromDate', _todayDate());
    // setter('toDate', _todayDate());
  }
};

// Make Value percentage for set Width and Color | like 100%
const persentageMaker = (value) => {
  if (!value) return `${0}%`;
  return value?.toFixed(2) ? `${value?.toFixed(2)}%` : value;
};

const apiSelector = (parameterObj) => {
  const {
    key,
    accId,
    buId,
    fromDate,
    toDate,
    levelId,
    territoryId,
  } = parameterObj;

  switch (key) {
    case 'achievements':
      return `/rtm/RTMCommonProcess/GetSalesTargetByAchievement?AccountId=${accId}&BusinessUnitId=${buId}&Date=${_todayDate()}&LevelId=${levelId}&TerritoryId=${territoryId}`;
    case 'strikeRate':
      return `/rtm/StrikeRate/GetDownStrikeRate?accountId=${accId}&BusinessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&level=${levelId}&TerritoryId=${territoryId}`;
    case 'lpc':
      return `/rtm/RTMCommonProcess/GetLPC?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&Todate=${toDate}&LevelId=${levelId}&TerritoryId=${territoryId}`;
    case 'productivityCall':
      return `/rtm/StrikeRate/GetDownCallProductivity?accountId=${accId}&BusinessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&level=${levelId}&TerritoryId=${territoryId}`;
    case 'noBill':
      return `/rtm/StrikeRate/GetdownNoBill?accountId=${accId}&BusinessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&level=${levelId}&TerritoryId=${territoryId}`;
    case 'numericBill':
      return `/rtm/StrikeRate/GetDownRegularBill?accountId=${accId}&BusinessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&level=${levelId}&TerritoryId=${territoryId}`;
    case 'he':
      return `/rtm/RTMCommonProcess/GetHE?AccountId=${accId}&BusinessUnitId=${buId}&LevelId=${levelId}&TerritoryId=${territoryId}&FromDate=${fromDate}&ToDate=${toDate}`;
    case 'adt':
      return `/rtm/RTMCommonProcess/GetADT?AccountId=${accId}&BusinessUnitId=${buId}&LevelId=${levelId}&TerritoryId=${territoryId}`;
    case 'radt':
      return `/rtm/RTMCommonProcess/GetRADT?AccountId=${accId}&BusinessUnitId=${buId}&LevelId=${levelId}&TerritoryId=${territoryId}`;
    case 'pjp':
      return `/rtm/PivotReport/GetPGPReport?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&LevelId=${levelId}&TerritoryId=${territoryId}`;
    case 'vpc':
      return `/rtm/PivotReport/GetVPC?AccountId=${accId}&BusinessUnitId=${buId}&LevelId=${levelId}&TerritoryId=${territoryId}&FromDate=${fromDate}&ToDate=${toDate}`;

    // 1st Section Card's Drill Down
    case 'totalSales':
      return `/rtm/StrikeRate/GetDownSalesAmount?accountId=${accId}&BusinessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&level=${levelId}&TerritoryId=${territoryId}`;
    case 'totalTarget':
      return `/rtm/StrikeRate/GetDownTargetAmount?accountId=${accId}&BusinessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&level=${levelId}&TerritoryId=${territoryId}`;
  }
};

const dataModifyers = (key, resData) => {
  if (key === 'strikeRate') {
    return resData?.data?.map((item) => {
      // console.log('strikeRate Success', resData?.data);
      return {
        strikeRate: persentageMaker(item?.strikeRate),
        location: item?.location,
        id: item?.id,
      };
    });
  } else if (key === 'achievements') {
    // console.log('achievements Success', resData?.data);
    return resData?.data?.map((item) => {
      return {
        strikeRate: persentageMaker(item?.totalAmount),
        location: item?.levelName,
        id: item?.locationId,
      };
    });
  } else if (key === 'lpc') {
    // console.log('LPC Success', resData?.data);
    return resData?.data?.map((item) => {
      return {
        strikeRate: persentageMaker(item?.lpc),
        location: item?.levelName,
        id: item?.locationId,
      };
    });
  } else if (key === 'productivityCall') {
    // console.log('Call Productivity Success', resData?.data);
    return resData?.data?.map((item) => {
      return {
        strikeRate: persentageMaker(item?.callProductivity),
        location: item?.location,
        id: item?.id,
      };
    });
  } else if (key === 'noBill') {
    // console.log('No Bill Success', resData?.data);
    return resData?.data?.map((item) => {
      return {
        strikeRate: persentageMaker(item?.value),
        location: item?.locationName,
        id: item?.territoryId,
      };
    });
  } else if (key === 'numericBill') {
    // console.log('Numeric Bill Success', resData?.data);
    return resData?.data?.map((item) => {
      return {
        strikeRate: persentageMaker(item?.value),
        location: item?.locationName,
        id: item?.territoryId,
      };
    });
  } else if (key === 'he') {
    // console.log('HE Success', resData?.data);
    return resData?.data?.map((item) => {
      return {
        strikeRate: persentageMaker(item?.totalAmount),
        location: item?.levelName,
        id: item?.locationId,
      };
    });
  } else if (key === 'adt') {
    // console.log('ADT Success', resData?.data);
    // Total Value For Progres Bar
    let totalTarget = resData?.data?.reduce(
      (acc, item) => acc + +item?.value,
      0,
    );
    return resData?.data?.map((item) => {
      return {
        strikeRate: persentageMaker(item?.value),
        strikeRateNotPercentage: item?.value,
        location: item?.locationName,
        id: item?.locationId,
        totalWidth: persentageMaker((item?.value / totalTarget) * 100),
        isTakaSign: true,
      };
    });
  } else if (key === 'radt') {
    // console.log('RADT Success', resData?.data);
    // Total Value For Progres Bar
    let totalTarget = resData?.data?.reduce(
      (acc, item) => acc + +item?.value,
      0,
    );
    return resData?.data?.map((item) => {
      return {
        strikeRate: persentageMaker(item?.value),
        strikeRateNotPercentage: item?.value,
        location: item?.locationName,
        id: item?.locationId,
        totalWidth: persentageMaker((item?.value / totalTarget) * 100),
        isTakaSign: true,
      };
    });
  } else if (key === 'pjp') {
    return resData?.data?.map((item) => {
      return {
        strikeRate: persentageMaker(item?.value),
        location: item?.locationName,
        id: item?.locationId,
      };
    });
  } else if (key === 'vpc') {
    let totalTarget = resData?.data?.reduce(
      (acc, item) => acc + +item?.value?.toFixed(0),
      0,
    );
    return resData?.data?.map((item) => {
      return {
        strikeRate: item?.value?.toFixed(0),
        location: item?.locationName,
        id: item?.locationId,
        totalWidth: persentageMaker((item?.value / totalTarget) * 100),
        isTakaSign: true,
      };
    });
  }

  // 1st Section Card's Drill Down
  else if (key === 'totalSales') {
    // console.log('Total Sales Success', resData?.data);
    let totalTarget = resData?.data?.reduce(
      (acc, item) => acc + +item?.salesAmount,
      0,
    );
    return resData?.data?.map((item) => {
      return {
        strikeRate: persentageMaker(item?.salesAmount),
        strikeRateNotPercentage: item?.salesAmount.toFixed(0),
        location: item?.locationName,
        id: item?.territoryId,
        totalWidth: persentageMaker((item?.salesAmount / totalTarget) * 100),
        isTakaSign: true,
      };
    });
  } else if (key === 'totalTarget') {
    // console.log('Total Target Success', resData?.data);
    let totalTarget = resData?.data?.reduce(
      (acc, item) => acc + +item?.targetAmount,
      0,
    );
    return resData?.data?.map((item) => {
      return {
        strikeRate: persentageMaker(item?.targetAmount),
        strikeRateNotPercentage: item?.targetAmount.toFixed(0),
        location: item?.locationName,
        id: item?.territoryId,
        totalWidth: persentageMaker((item?.targetAmount / totalTarget) * 100),
        isTakaSign: true,
      };
    });
  }
};

export const getDownGridData = async (
  key,
  accId,
  buId,
  fromDate,
  toDate,
  levelId,
  territoryId,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      apiSelector({
        key,
        accId,
        buId,
        fromDate,
        toDate,
        levelId,
        territoryId,
        setter,
        setLoading,
      }),
    );
    setter(dataModifyers(key, res));
    setLoading(false);
  } catch (err) {
    // console.log('Error', key, err);
    setter([]);
    setLoading(false);
  }
};

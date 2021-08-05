import axios from 'axios';
import {Toast} from 'native-base';
import {_todayDate} from '../../../../common/functions/_todayDate';

export const getDistributorAndChannel = async (
  accId,
  buId,
  terrytoryId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetBusinessPartnerWithChannelInfo?AccountId=${accId}&BusinessUnitId=${buId}&TerrytoryId=${terrytoryId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getDamageCategoryDDL = async (setter) => {
  try {
    const res = await axios.get(`/rtm/RTMDDL/GetDamageCatagoryDDL`);

    setter(res?.data);
  } catch (err) {}
};

export const getDamageCollectionLandingData = async (
  accId,
  buId,
  territoryId,
  routeId,
  beatId,
  outletId,
  damageCateId,
  fromDate,
  toDate,
  setLoading,
  setter,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/DamageEntry/DamageEntryLandingPagination?accountId=${accId}&businessUnitId=${buId}&TerritoryId=${territoryId}&RouteId=${routeId}&BeatId=${beatId}&OutletId=${outletId}&damageCategoryId=${damageCateId}&fromDate=${fromDate}&toDate=${toDate}&vieworder=asc&PageNo=0&PageSize=15`,
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    Toast.show({
      text: err.response.data.message,
      type: 'danger',
      duration: 3000,
    });
  }
};

export const getCreateDamageCollectionItemData = async (
  accId,
  buId,
  routeId,
  beatId,
  monthId,
  damageCategoryId,
  distributionChannelId,
  outletId,
  damageDate,
  setLoading,
  setter,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/DamageEntry/GetItemInfoForDamageEntry?accountId=${accId}&businessUnitId=${buId}&routeId=${routeId}&beatId=${beatId}&monthId=${monthId}&DamageCategoryId=${damageCategoryId}&DistributionChannelId=${distributionChannelId}&OutletId=${outletId}&DamageDate=${damageDate}`,
    );

    const modifyData = res?.data.map((item) => ({
      ...item,
      damageCategory: {
        value: item?.damageTypeId || 0,
        label: item?.damageTypeName || '',
      },
    }));
    setter(modifyData);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    Toast.show({
      text: err.response.data.message,
      type: 'danger',
      duration: 3000,
    });
  }
};

export const createDamageCollection = async (payload, setLoading) => {
  setLoading(true);

  try {
    const res = await axios.post(`/rtm/DamageEntry/CreateDamageEntry`, payload);

    Toast.show({
      text: res?.data?.message || 'Created Successfull',
      type: 'success',
      duration: 3000,
    });

    cb();
  } catch (err) {
    setLoading(false);
    Toast.show({
      text: err.response.data.message,
      type: 'danger',
      duration: 3000,
    });
  }
};

export const viewDamageCollection = async (damageEntryId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/DamageEntry/GetDamageEntryDetailsById?DamageEntryId=${damageEntryId}`,
    );
    setter(res?.data);
  } catch (err) {
    Toast.show({
      text: err.response.data.message,
      type: 'danger',
      duration: 3000,
    });
  }
};

export const entryDateFunc = (date, setIsPreviousMonth) => {
  const userMonth = date?.split('-')[1];
  const curentDate = new Date();
  const month = `${curentDate?.getMonth() + 1}`?.padStart(2, '0');
  setIsPreviousMonth(userMonth !== month);
};
export const getMonthName = (month) => {
  let monthName = month.split('-')[1];
  if (+monthName === 1) {
    return 'January';
  } else if (+monthName === 2) {
    return 'February';
  } else if (+monthName === 3) {
    return 'March';
  } else if (+monthName === 4) {
    return 'April';
  } else if (+monthName === 5) {
    return 'May';
  } else if (+monthName === 6) {
    return 'June';
  } else if (+monthName === 7) {
    return 'July';
  } else if (+monthName === 8) {
    return 'August';
  } else if (+monthName === 9) {
    return 'September';
  } else if (+monthName === 10) {
    return 'October';
  } else if (+monthName === 11) {
    return 'November';
  } else if (+monthName === 12) {
    return 'December';
  } else {
    return Toast.show({
      text: 'Select Valid Date',
      buttonText: 'close',
      type: 'danger',
      duration: 3000,
    });
  }
};

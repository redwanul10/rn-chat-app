import axios from 'axios';
import {Toast} from 'native-base';
import { _dateFormatter } from '../../../../../common/functions/_dateFormatter';

export const getFinishedItemsDDL = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/FinishedItemDDL?AccountId=${accId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getRouteDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/RouteNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getBeatDDL = async (routeId, setter) => {
  try {
    const res = await axios.get(`/rtm/RTMDDL/BeatNameDDL?RouteId=${routeId}`);

    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getThanaDDL = async (setter) => {
  try {
    const res = await axios.get(`/hcm/HCMDDL/GetPoliceStationDDL`);

    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getOutletTypeInfoDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/BusinessTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    setter(res?.data);
  } catch (err) {
    alert(err.response.data.message);
  }
};

export const createOutletProfile = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/rtm/OutletRegistration/CreateOutletRegistration`,
      payload,
    );
    setLoading(false);
    Toast.show({
      text: res.message || 'Created Successfull',
      // buttonText: 'close',
      type: 'success',
      duration: 3000,
    });

    cb();
  } catch (err) {
    setLoading(false);
    Toast.show({
      text: err.response.data.message,
      buttonText: 'close',
      type: 'danger',
      duration: 3000,
    });
  }
};

export const editOutletProfile = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/rtm/OutletRegistration/EditOutletRegistration`,
      payload,
    );
    setLoading(false);
    Toast.show({
      text: res.message || 'Edit Successfull',
      // buttonText: 'close',
      type: 'success',
      duration: 3000,
    });
  } catch (err) {
    setLoading(false);
    Toast.show({
      text: err.response.data.message,
      // buttonText: 'close',
      type: 'danger',
      duration: 3000,
    });
  }
};

export const getOutletProfileById = async (id, setter) => {
  try {
    const res = await axios.get(
      `/rtm/OutletRegistration/GetOutletRegistrationById?autoId=${id}`,
    );
    const values = res?.data;
   
    const data = {
      outletImagePath: values?.outletImagePath,
      outletName: values?.outletName || '',
      outletType: {
        value: values?.businessType,
        label: values?.businessTypeName,
      },
      thana: {
        value: values?.thanaId,
        label: values?.thanaName,
      },
      outletAddress: values?.outletAddress || '',
      ownerName: values?.ownerName || '',
      mobile: values?.mobileNumber?.toString() || '',
      ownerId: values?.ownerNidno,
      lattitude: values?.latitude || '',
      longitude: values?.longitude || '',
      maxSalesItem: {
        value: values?.maxSalesItem,
        label: values?.maxSalesItemName,
      },
      avarageAmount: values?.monMonthlyAvgSales?.toString() || '0',
      tradeLicenseNo: values?.tradeLicenseNo,
      isColler: values?.isCooler,
      outletBanglaName: values?.outletBanglaName || '',
      isHvo: values?.isHvo || false,
      collerCompany: {
        value: values?.coolerCompanyId,
        label: values?.coolerCompanyName,
      },

      // Owner Informations

      contactType: values?.contactType || '',
      email: values?.emailAddress || '',
      dateOfBirth: _dateFormatter(values?.dateOfBirth) || '',
      marriageDate: _dateFormatter(values?.marriageDate) || '',
      marriageStatus: {
        value: values?.maritatualStatusId,
        label: values?.maritatualStatus,
      },
      ownerNid: values?.ownerNIDNo?.toString() || '',
    };

    setter(data);
  } catch (err) {
  }
};

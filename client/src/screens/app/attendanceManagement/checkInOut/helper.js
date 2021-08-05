import axios from 'axios';
import {Toast} from 'native-base';

export const getTerritoryDDL = async (accId, busId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/TerritoryDDL?AccountId=${accId}&BusinessUnitId=${busId}`,
    );
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (err) {}
};

export const getCustomerDDL = async (accId, busId, territoryId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetCustomerDDL_new?AccountId=${accId}&BusinessUnitId=${busId}&TerrytoryId=${territoryId}`,
    );
    if (res.status === 200 && res.data) {
      const newData = [
        {
          value: 0,
          label: 'Others Customer',
        },
        ...res.data,
      ];
      setter(newData);
    }
  } catch (error) {}
};

export const businessPartner_api = async (userId, setter) => {
  try {
    const res = await axios.get(
      `/partner/PManagementCommonDDL/GetCustomerListSalesForceDDL?EmployeeId=${userId}`,
    );
    if (res.status === 200 && res.data) {
      const newData = [
        {
          value: 0,
          label: 'Others Partner',
        },
        ...res.data,
      ];
      setter(newData);
    }
  } catch (error) {}
};

export const registerLatLng = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(`/rtm/LangLatBook/SaveLangLatBook`, data);
    if (res.status === 200) {
      Toast.show({
        text: res?.data?.message || 'registered successful',
        type: 'success',

        duration: 3000,
      });
      setLoading(false);
    }
  } catch (err) {
    setLoading(false);
    Toast.show({
      text: err?.response?.data?.message,
      type: 'danger',

      duration: 3000,
    });
  }
};

export const getById = async (accid, buid, id, setter, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await axios.get(
      `/rtm/BusinessPartnerInfo/GetBusinessPartnerByID?accountId=${accid}&businessUnitId=${buid}&partnerId=${id}`,
    );
    const {data, status} = res;
    if (status === 200 && data) {
      const r = data;
      const singleObject = {
        businessPartnerId: r.businessPartnerId,
        businessPartnerName: r.businessPartnerName,
        businessPartnerAddress: r.businessPartnerAddress,
        contactNumber: r.contactNumber,
        bin: r.bin,
        licenseNo: r.licenseNo,
        email: r.email,
        businessPartnerTypeId: r.businessPartnerTypeId,
        partnerSalesType: r.businessPartnerTypeName,
        businessPartnerType: {
          value: r.businessPartnerTypeId,
          label: r.businessPartnerTypeName,
        },
        businessPartnerCode: 'abc',
        attachmentLink: r.attachmentLink || '',
        territory: {
          value: r.territoryId,
          label: r.territoryName,
        },
        distributionChannel: {
          value: r.distributionChannelId,
          label: r.distributionChannelName,
        },
      };
      setter(singleObject);
      setIsLoading(false);
    }
  } catch (error) {
    toast.warning(error?.response?.data?.message);
    setIsLoading(false);
  }
};

export const checkIn = async (payload, setLoading, cb) => {
  setLoading(true);

  try {
    const res = await axios.post(
      `/rtm/RemoteAttendance/RemoteAttendanceCheckIn`,
      payload,
    );
    setLoading(false);

    Toast.show({
      text: res?.data?.message || 'Checked In Successfull',
      type: 'success',

      duration: 3000,
    });
    cb();
  } catch (err) {
    setLoading(false);
    Toast.show({
      text: err?.response?.data?.message,
      type: 'danger',

      duration: 3000,
    });
  }
};

export const checkOut = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/rtm/RemoteAttendance/RemoteAttendanceCheckOut`,
      payload,
    );

    setLoading(false);

    Toast.show({
      text: res?.data?.message || 'Checked Out Successfull',
      type: 'success',

      duration: 3000,
    });
    cb();
  } catch (err) {
    setLoading(false);
    Toast.show({
      text: err?.response?.data?.message,
      type: 'danger',

      duration: 3000,
    });
  }
};

export const getCheckInCheckOutTime = async (
  empId,
  todayDate,
  setTime,
  setLoading,
) => {
  if (setLoading) setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/EmployeeRemoteAttendance/GetEmployeeCheckInCheckOutTimeRTMApps?EmployeeId=${empId}&date=${todayDate}`,
      // `/hcm/EmployeeRemoteAttendance/GetEmployeeCheckInCheckOutTime?EmployeeId=${empId}&date=${todayDate}`
    );

    const data = res?.data;
    setTime(res?.data[0]);
    if (setLoading) setLoading(false);
  } catch (err) {
    if (setLoading) setLoading(false);
  }
};
export const getCheckInCheckOutTimeHistory = async (
  userId,
  todayDate,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RemoteAttendance/GetCheckInCheckOutInformation?UserId=${userId}&date=${todayDate}`,
    );
    setter(res?.data);
    // console.log(JSON.stringify(res, null, 2));
  } catch (err) {}
};

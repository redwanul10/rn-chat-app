import axios from 'axios';
import {Toast} from 'native-base';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';

export const getLandingData = async (
  accId,
  buId,
  employeeId,
  setter,
  setLoading,
  searchValue
) => {
  
  const search = searchValue ? `&Search=${searchValue}` : ``
  try {

    setLoading(true);
    const res = await axios.get(
      `/rtm/OutletRegistrationApproval/GetOutletRegistrationApproval?accountId=${accId}&businessUnitId=${buId}&EmployeeId=${employeeId}${search}&PageNo=0&PageSize=1000&vieworder=desc`,
    );
    setter(res?.data);
    console.log(JSON.stringify(res?.data,null,2))
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};
export const getSingleData = async (outletId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/OutletRegistration/GetOutletRegistrationById?autoId=${outletId}`,
    );

    const value = res?.data;
    // console.log('object', JSON.stringify(value, null, 2));
    const initData = {
      registeredBy: value?.userName,
      outletName: value?.outletName,
      outletBanglaName: value?.outletBanglaName,
      outletImagePath: value?.outletImagePath,
      outletType: {
        value: value?.businessType,
        label: value?.businessTypeName,
      },
      outletAddress: value?.outletAddress,
      thana: {
        value: value?.thanaId,
        label: value?.thanaName,
      },
      lattitude: value?.latitude,
      longitude: value?.longitude,
      tradeLicenseNo: value?.tradeLicenseNo,
      maxSalesItem: {
        value: value?.maxSalesItem,
        label: value?.maxSalesItemName,
      },
      monthlyAverageSales: value?.monthlyAvgSales.toString(),
      isCooler: value?.isCooler,
      isHvo: value?.isHvo,
      collerCompany: {
        value: value?.coolerCompanyId,
        label: value?.coolerCompanyName,
      },
      ownerName: value?.ownerName,
      mobile: value?.mobileNumber,
      contactType: value?.contactType,
      email: value?.emailAddress,
      dateofBirth: _dateFormatter(value?.dateOfBirth),
      marriageStatus: {
        value: value?.maritatualStatusId,
        label: value?.maritatualStatus,
      },
      ownerNID: value?.ownerNidno.toString(),
    };
    // console.log('object', JSON.stringify(initData, null, 2));

    setter(initData);
  } catch (err) {}
};

export const approveOutletRegistration = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/rtm/OutletRegistrationApproval/ApproveOutletRegistration`,
      payload,
    );

    setLoading(false);
    Toast.show({
      text: res?.data?.message || 'Approve Successfull',
      type: 'success',
      duration: 3000,
    });
  } catch (err) {
    setLoading(false);
  }
};

export const getFileListDDL = async (outletId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/OutletFile/GetOutletFileInfoById?outletId=${outletId}`,
    );
    // console.log('object', res?.data);
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
  }
};

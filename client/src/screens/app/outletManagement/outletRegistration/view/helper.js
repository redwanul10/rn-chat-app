import axios from 'axios';
import {Toast} from 'native-base';
import { _dateFormatter } from '../../../../../common/functions/_dateFormatter';

export const getOutletProfileById = async (id, setter) => {
  try {
    const res = await axios.get(
      `/rtm/OutletProfile/GetOutletProfileById?OutletId=${id}`,
    );
    const values = res?.data?.outletProfile;
    const data = {
      // Outlet Informations
      outletInfo: {
        routeName: {
          value: values?.routeId,
          label: values?.routeName,
        },
        marketName: {
          value: values?.beatId,
          label: values?.beatName,
        },
        outletName: values?.outletName || '',
        outletType: {
          value: values?.businessTypeId,
          label: values?.businessTypeName,
        },
        outletAddress: values?.outletAddress || '',
        ownerName: values?.ownerName || '',
        ownerNumber: values?.mobileNumber?.toString() || '',
        lattitude: values?.latitude || '',
        longitude: values?.longitude || '',
        maxSalesItem: {
          value: values?.maxSalesItem,
          label: values?.maxSalesItemName,
        },
        avarageAmount: values?.monMonthlyAvgSales?.toString() || '0',
        tradeLicenseNo: values?.tradeLicenseNo,
        outletBanglaName: values?.outletBanglaName || "",
        isHvo: values?.isHvo || false,
        isColler: values?.cooler,
        collerCompany: {
          value: values?.coolerCompanyId,
          label: values?.coolerCompanyName,
        },
      },
      // Owner Informations
      ownerInfo: {
        contactType: values?.contactType || '',
        email: values?.emailAddress || '',
        dateOfBirth: _dateFormatter(values?.dateOfBirth) || '',
        marriageStatus: {
          value: values?.maritatualStatusId,
          label: values?.maritatualStatus,
        },
        ownerNid: values?.ownerNIDNo?.toString() || '',
      },
      attibuteDeatils: res?.data?.attibuteDeatils || [],
    };

    const attrData = {};

    const rowDto = res?.data?.attibuteDeatils;
    rowDto.forEach((item) => {
      if (item?.outletAttributeUIType === 'DDL') {
        attrData[item?.outletAttributeName] = {
          value: item?.attributeValueId,
          label: item?.outletAttributeValueName,
        };
      }

      if (item?.outletAttributeUIType === 'Date') {
        attrData[item?.outletAttributeName] = item?.outletAttributeValueName
          ? _dateFormatter(item?.outletAttributeValueName)
          : '';
      }

      if (item?.outletAttributeUIType === 'TextBox') {
        attrData[item?.outletAttributeName] = item?.outletAttributeValueName;
      }

      if (item?.outletAttributeUIType === 'Number') {
        attrData[item?.outletAttributeName] = item?.outletAttributeValueName;
      }
    });

    setter({...data, businessInfo: attrData});
  } catch (err) {}
};

export const getOutletProfileTypeInfo = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/OutletProfileType/GetOutletProfileTypeInfo?AccountId=${accId}&BusinsessUnitId=${buId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const editOutletProfile = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/rtm/OutletProfile/EditOutletProfile`,
      payload,
    );
    setLoading(false);
    Toast.show({
      text: res.message || 'Edit Successfull',
      buttonText: 'close',
      type: 'success',
      duration: 3000,
    });
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

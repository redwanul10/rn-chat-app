import axios from 'axios';
import {Toast} from 'native-base';
import { _dateFormatter } from '../../../../common/functions/_dateFormatter';

export const getRouteDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/RouteNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    setter(res?.data);
  } catch (err) {
  }
};

export const getTerritoryDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetTerritotoryWithLevelDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getPartnerDDL = async (accId, buId, teritoryId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetCustomerDDL_new?AccountId=${accId}&BusinessUnitId=${buId}&TerrytoryId=${teritoryId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getSalesCollectionById = async (id, setter) => {
  try {
    const res = await axios.get(
      `/rtm/PrimaryCollection/GetPrimaryCollectionById?id=${id}`,
    );

    const values = res?.data[0]
    const data = {
      teritory: '',
      partner: {
        value:values?.businessPartnerId,
        label:values?.businessPartnerName,
      },
      amount: values?.amount?.toString() || "0",
      collectionData: _dateFormatter(values?.collectionDate) || "",
      comments: values?.remarks || '',
    };
    setter(data);
  } catch (err) {}
};

export const getSalesCollectionLandingData = async (
  accId,
  buId,
  fromDate,
  toDate,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/PrimaryCollection/GetPrimaryCollectionPasignation?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&IsReceived=false&viewOrder=desc&PageNo=0&PageSize=1000`,
    );

    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};

export const createSalesCollection = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/rtm/PrimaryCollection/CreatePrimaryCollection`,
      payload,
    );
    setLoading(false);
    Toast.show({
      text: res.data?.message || 'Created Successfull',
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

export const editSalesCollection = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/rtm/PrimaryCollection/EditPrimaryCollection`,
      payload,
    );
    setLoading(false);
    Toast.show({
      text: res?.data?.message || 'Edited Successfull',
      type: 'success',
      duration: 3000,
    });
  } catch (err) {
    setLoading(false);
    Toast.show({
      text: err.response.data.message,
      type: 'danger',
      duration: 3000,
    });
  }
};

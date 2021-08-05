/* eslint-disable no-alert */
import axios from 'axios';

export const getLandingData = async (
  accId,
  buId,
  rId,
  vId,
  channelId,
  date,
  setter,
  setLoading,
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/VeichleUnloading/GetVehicleUnLoadLandingPasignation?accountId=${accId}&businessUnitId=${buId}&routeId=${rId}&vehicleId=${vId}&ChannelId=${channelId}&unLoadingDate=${date}&pageNo=1&pageSize=15&vieworder=desc`,
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const getById = async (id, setter, setDisabled) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/rtm/VeichleUnloading/GetVehicleUnLoadingById?vehicleUnloadingId=${id}`,
    );
    if (res?.status === 200) {
      const payload = {
        quantity: res?.data?.objHeader?.value.toString(),
        collection: res?.data?.objHeader?.collection.toString(),
        received: res?.data?.objHeader?.received.toString(),
        row: res?.data?.objRow,
      };
      setter(payload);
      setDisabled(false);
    }
  } catch (err) {
    setDisabled(false);
    setter({row: []});
  }
};

export const getDistributorAndDistributorChannelNameDDL = async (
  accId,
  buId,
  tId,
  setFieldValue,
  setter,
) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetBusinessPartnerWithChannelInfo?AccountId=${accId}&BusinessUnitId=${buId}&TerrytoryId=${tId}`,
    );
    if (res?.status === 200) {
      setFieldValue('distributor', {
        value: res?.data?.distributorId,
        label: res?.data?.distributorName,
      });
      setFieldValue('distributorChannel', {
        value: res?.data?.distributionChannelId,
        label: res?.data?.distributionChannelName,
      });
      setter({
        value: res?.data?.distributorId,
        label: res?.data?.distributorName,
      });
    }
  } catch (err) {
    setFieldValue([]);
  }
};

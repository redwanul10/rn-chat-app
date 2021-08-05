/* eslint-disable prettier/prettier */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import axios from 'axios';
import {Toast} from 'native-base';

// export const getTerritoryDDL = async (accId, buId, empId, setter) => {
//   try {
//     const res = await axios.get(
//       `/rtm/RTMDDL/GetTerritotoryWithLevelByEmpDDL?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}LevelId=7&TerrioryId=39`,
//     );
//     setter(res?.data);
//   } catch (err) {
//     setter([]);
//   }
// };

/* For This API, You don't need to give the empLevelId
empTerritoryId parameter from Global State, Just pass null for emId  */
export const getTerritoryDDL = async (accId, buId, empId, setter) => {
  try {
    // Get Global Data from header's
    const {empLevelId, empTerritoryId} = axios.defaults.headers.common[
      'territoryInfo'
    ];
    if (empLevelId && empTerritoryId) {
      const res = await axios.get(
        `/rtm/RTMDDL/GetTerritotoryWithLevelByEmpDDLNew?accountId=${accId}&businessUnitId=${buId}&LevelId=${empLevelId}&TerrioryId=${empTerritoryId}`,
      );
      if (res?.status === 200) {
        setter(res?.data);
      }
    }
  } catch (err) {
    setter([]);
  }
};

export const getRouteDDL = async (accId, buId, territoryId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/RouteByTerritoryIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${territoryId}`,
    );
    setter(res?.data);
  } catch (err) {}
};

export const getAllRouteDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/RouteNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getBeatDDL = async (routeId, setter) => {
  try {
    const res = await axios.get(`/rtm/RTMDDL/BeatNameDDL?RouteId=${routeId}`);
    setter(res?.data);
  } catch (err) {}
};

export const getOutletNameDDL = async (accId, buId, roId, beatId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetOutletNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&RouteId=${roId}&BeatId=${beatId}`,
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getRouteDDLByTerritoryId = async (
  accId,
  buId,
  territoryId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/RouteByTerritoryIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${territoryId}`,
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getDistributorDDL = async (accId, buId, territoryId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetCustomerDDL_new?AccountId=${accId}&BusinessUnitId=${buId}&TerrytoryId=${territoryId}`,
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getVehicleDDLByDistributorId = async (
  accId,
  buId,
  distributorId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMVehicle/GetRTMVehicle?AccountId=${accId}&BusinessUnitId=${buId}&DistributorId=${distributorId}`,
    );
    setter(
      res?.data?.map((item) => {
        return {
          ...item,
          value: item?.vehicleId,
          label: item?.vehicleNo,
        };
      }),
    );
  } catch (err) {
    setter([]);
  }
};

export const getRouteListDDLByVehicleId = async (
  accId,
  buId,
  vehicleId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetRouteListByVehichle?AccountId=${accId}&BusinessUnitId=${buId}&VehicleId=${vehicleId}`,
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getDistributorAndDistributorChannelNameDDL = async (
  accId,
  buId,
  tId,
  setFieldValue,
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
    }
  } catch (err) {
    setFieldValue([]);
  }
};

export const getII_address = async (setter, lat, long) => {
  try {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyDdQsgjt7jnTZXA3DwgEwNavpbXjCixXlw`,
    );
    setter(res?.data?.results[1]?.formatted_address);
  } catch (err) {
    setter('Not Found');
  }
};

export const singleAttachmentAction = async (attachment) => {
  let formData = new FormData();
  formData.append('files', attachment);
  try {
    let {data} = await axios.post('/domain/Document/UploadFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    Toast.show({
      text: 'Upload Successfully',
      type: 'success',
      duration: 3000,
    });
    return data;
  } catch (error) {
    Toast.show({
      text: error?.response?.data?.message || 'Image not upload',
      type: 'warning',
      duration: 3000,
    });
  }
};

export const uploadBaseSixtyFourImage = (selectedFile, cb) => {
  if (!selectedFile?.base64) return;

  const imagePayload = [
    {
      data: selectedFile?.base64,
      fileName: selectedFile?.fileName,
    },
  ];

  axios
    .post('/domain/Document/UploadFileBaseSixtyFour', imagePayload)
    .then((res) => {
      cb(res?.data[0]?.id);
      // Toast.show({
      //   text: 'Image  Uploaded',
      //   type: 'success',
      //   duration: 3000,
      // });
    })
    .catch((err) => {
      Toast.show({
        text: 'Image not Uploaded',
        type: 'danger',
        duration: 3000,
      });
    });
};

// api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
const API_KEY = '0dda2b433573f2cbc9365830ccdbe194';

export const getWeatherInfo = async (lat, lon, setter) => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    );
    setter(res?.data);
  } catch (err) {
    // setter('Not Found');
  }
};

export const getDristributorChannel = async (accId, buId,setter) => {
  try {
    const res = await axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`,
    );
    setter(res?.data);
  } catch (err) {
    alert
  }
};

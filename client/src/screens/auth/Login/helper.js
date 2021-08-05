import axios from 'axios';
import {Toast} from 'native-base';
import {storeGlobalData} from '../../../common/functions/localStorage';

export const loginAction = (email, password, setLoading, cb) => {
  setLoading(true);
  axios
    .post(`/identity/TokenGenerate/IbosLogin`, {
      userName: email,
      password,
    })
    .then((res) => {
      const token = res?.data?.token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      getUserInformation(email, password, cb, token, setLoading);
    })
    .catch((err) => {
      setLoading(false);
      Toast.show({
        text: err?.response?.data?.message,
        type: 'danger',
        duration: 3000,
      });
    });
};

const getUserInformation = async (email, password, cb, token, setLoading) => {
  try {
    const req = await axios.get(
      `/domain/CreateUser/GetUserInformationByUserEmail?Email=${email}`,
    );
    setLoading(false);
    const res = req.data;

    const selectedBusinessUnit = {
      value: res[0]?.defaultBusinessUnit,
      label: res[0]?.businessUnitName,
    };

    const userInfo = {
      isAuthenticate: true,
      profileData: res[0],
      selectedBusinessUnit,
      password,
    };

    await storeGlobalData({...userInfo});

    cb(userInfo);
  } catch (err) {
    setLoading(false);
  }
};

export const getUserRoleInfo = async (accId, buId, empId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RtmsalesforceLabelInfo/GetSalesForceLabelById?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}`,
    );
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (err) {
    alert('Your permission is not defined');
  }
};

export const getEmployeeTerritoryInfo = async (accId, buId, empId) => {
  try {
    const res = await axios.get(
      `/rtm/RTMCommonProcess/GetEmployeeLoginInfo?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}`,
    );
    if (res.status === 200 && res.data) {
      // Set Territory info in axios headers
      axios.defaults.headers.common['territoryInfo'] = {
        empTerritoryId: res?.data?.empTerritoryId,
        empLevelId: res?.data?.empLevelId,
      };
      return res?.data;
    }
  } catch (err) {
    // console.log('object', JSON.stringify(err, null, 2));
    return [];
  }
};

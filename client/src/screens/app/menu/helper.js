import axios from 'axios';
import {storeGlobalData} from '../../../common/functions/localStorage';

export const logoutAction = async (data, pass) => {
  axios.defaults.headers.common['Authorization'] = '';

  await storeGlobalData({
    profileData: {
      emailAddress: data?.emailAddress,
    },
    password: pass,
  });

  // await storeGlobalData({
  //   isAuthenticate: false,
  //   profileData: '',
  //   selectedBusinessUnit: {},
  // });
};

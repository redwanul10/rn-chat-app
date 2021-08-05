import axios from 'axios';
import {Toast} from 'native-base';
import {storeGlobalData} from '../../../common/functions/localStorage';

export const changePassword = async (payload, data, setLoading, navigation) => {
  try {
    setLoading(true);

    const res = await axios.put(
      `/rtm/RTMCommonProcess/UpdatePassWord`,
      payload,
    );
    if (res?.status === 200) {
      logoutAction(data);
      navigation.navigate('Log in', {resetPassword: true});
    }
    setLoading(false);
    // updatedPassword = true;

    Toast.show({
      text: res?.data?.message || 'Created Successfull',
      //   buttonText: 'close',
      type: 'success',
      duration: 3000,
    });
  } catch (err) {
    setLoading(false);
    alert();
  }
};

export const logoutAction = async (data) => {
  axios.defaults.headers.common['Authorization'] = '';

  await storeGlobalData({
    profileData: {
      emailAddress: data?.emailAddress,
    },
    password: '',
  });
};

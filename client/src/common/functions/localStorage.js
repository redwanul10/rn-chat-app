import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeGlobalData = async (value, key = 'iBosApp') => {
  const jsonValue = JSON.stringify(value, null, 2);
  try {
    await AsyncStorage.setItem(key, jsonValue);
  } catch (err) {}
};

export const getGlobalData = async (setter, key = 'iBosApp') => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // return JSON.parse(value)
      setter(JSON.parse(value));
    }
  } catch (e) {}
};

export const removeData = async (value, key = 'iBosApp') => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    return false;
  }
};

// async removeItemValue(key) {
//   try {
//       await AsyncStorage.removeItem(key);
//       return true;
//   }
//   catch(exception) {
//       return false;
//   }
// }

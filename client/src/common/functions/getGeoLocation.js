
import {Alert, Linking, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export default async function requestLocationPermission(setter, setLoading) {
  try {
    
    // Check Permission Already Granted or Not
    let granted = await check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );

    // If Not Granted Then Request for Location permission
    if (granted !== RESULTS.GRANTED) {
      granted = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_ALWAYS
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
    }

    // Get Location If Permission is Granted
    if (granted === RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        (position) => {
          setter(position.coords);
        },
        (error) => {
          alert(error?.message)
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      Alert.alert(
        'Location Permission Denied',
        'Please trun on your location',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Open', onPress: () => Linking.openSettings()},
        ],
        {cancelable: true},
      );
    }
  } catch (err) {
    console.warn(err);
  }
}

import React, {useRef, useEffect} from 'react';
import {WebView} from 'react-native-webview';
import {View} from 'react-native';
import mapHtml from './MapContent';
import SoMapHtml from './SoMapContent';

const Map = (props) => {
  const {lat, long, location, userName, locations} = props;
  const mapRef = useRef();

  // useEffect(() => {
  //   if (location.latitude && location.latitude) {
  //     mapRef.current.postMessage(
  //       JSON.stringify({
  //         latitude: location.latitude,
  //         longitude: location.longitude,
  //       }),
  //     );
  //   }
  // }, [lat, long]);

  useEffect(() => {
    // if (locations?.length === 0) return

    let clone = locations?.filter((item) => {
      if (item?.isOrder || item?.isNoOrder) {
        return true;
      } else {
        return false;
      }
    });

    let polylineData = clone.map((item) => {
      var lat;
      var long;
      if (item?.notVisited) {
        lat = item?.outletLat;
        long = item?.outletLong;
      } else {
        lat = item?.latitude;
        long = item?.longitiud;
      }
      return [lat, long];
    });

    mapRef.current.postMessage(JSON.stringify({locations, polylineData}));
  }, [locations]);

  return (
    <View style={{width: '100%', height: "100%", marginBottom: 10}}>
      <WebView
        ref={mapRef}
        originWhitelist={['*']}
        // source={{html: props?.mapType === 'teamMap' ? SoMapHtml : mapHtml}}
        source={{html: props?.content}}
        style={{height: '100%'}}
        // onLoad={() =>
        //   mapRef.current.postMessage(
        //     JSON.stringify({
        //       userName,
        //       latitude: location.latitude,
        //       longitude: location.longitude,
        //     }),
        //   )
        // }
        scalesPageToFit={true}
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        // injectedJavaScript={'window.document.querySelector("body").style.backgroundColor = "transparent"'}
        // containerStyle={{ backgroundColor: "red" }}
      />
    </View>
  );
};

export default Map;

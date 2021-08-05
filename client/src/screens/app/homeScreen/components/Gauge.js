/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useEffect} from 'react';
import {WebView} from 'react-native-webview';
import {View} from 'react-native';
import gaugeHtml from './GaugeContent';

const Gauge = ({GaugeData}) => {
  const gaugeRef = useRef();

  useEffect(() => {
    if (GaugeData) {
      setTimeout(
        () => gaugeRef?.current?.postMessage(JSON.stringify({...GaugeData})),
        2000,
      );
    }
  }, [GaugeData]);

  return (
    <View
      style={{
        width: '100%',
        height: 160,
        marginBottom: 10,
      }}>
      <WebView
        ref={gaugeRef}
        source={{html: gaugeHtml || '<h1></h1>'}}
        // onLoad={() => {
        //   gaugeRef.current.postMessage(
        //     JSON.stringify({
        //       gaugeData: GaugeData?.achivementPercentage,
        //     }),
        //   );
        // }}
        // style={{alignItems: 'center'}}
        scalesPageToFit={true}
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Gauge;

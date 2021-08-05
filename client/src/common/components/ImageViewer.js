import React from 'react';
import {Image} from 'react-native';

export default function ImageViewer({width, height, image}) {
  return (
    <Image
      style={{width: width ? width : 50, height: height ? height : 50}}
      source={{
        uri: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${image}`,
      }}
    />
  );
}

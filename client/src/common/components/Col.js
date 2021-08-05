import React, {useContext} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {RowContext} from './Row';

const isLandscape = () => {
  const dim = Dimensions.get('screen');
  return dim.width >= dim.height;
};

const Col = (props) => {
  const rowContext = useContext(RowContext);
  const {width, LandscapeWidth,tabWidth} = props;
  const landScape = isLandscape();
  const screenWidth = Dimensions.get('screen').width
  let colWidth = width;
  

  // Col Width in Tablet
  if(screenWidth > 768 && tabWidth){
    colWidth = tabWidth
  }
 
  return (
    <View
      style={[
        {
          width: landScape ? LandscapeWidth : colWidth,
          paddingHorizontal: rowContext?.colGap || 0,
        },
        props?.style || {}
      ]}>
      {props?.children}
    </View>
  );
};

export default Col;

const style = StyleSheet.create({
  column: {paddingHorizontal: 10},
});

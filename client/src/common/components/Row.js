import React, {createContext} from 'react';
import {View, StyleSheet} from 'react-native';

export const RowContext = createContext('');

const Row = ({colGap, ...props}) => {
  return (
    <View
      style={[{
        flexDirection: 'row',
        marginHorizontal: colGap ? colGap * -1 : 0,
        flexWrap: 'wrap',
      },
      props?.style || {}
      ]}>
      {/* <Text>{width}</Text> */}
      <RowContext.Provider value={{colGap}}>
        {props.children}
      </RowContext.Provider>
    </View>
  );
};

export default Row;

const style = StyleSheet.create({

});

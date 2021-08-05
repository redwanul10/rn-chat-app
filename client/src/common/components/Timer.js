import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import useTimer from 'easytimer-react-hook';

const Timer = ({ arr }) => {

  const [oldTime, setOldTime] = useState([])
  const [timer] = useTimer({
    startValues: arr,
  });

  useEffect(() => {
    if (JSON.stringify(oldTime) === JSON.stringify(arr)) return;
    setOldTime(arr)
    timer.stop();
    timer.start({
      startValues: arr,
    });
  }, [arr]);

  useEffect(() => {
    timer.start();
  }, []);

  return (
    <>
      <View style={[styles.btnStyle, { backgroundColor: '#063197' }]}>
        <Text style={[styles.btnText]}>{timer.getTimeValues().toString()}</Text>
      </View>

      {/* <View style={{flex}}>
        <Text style={{textAlign: 'center', fontSize: 20}}>
         
        </Text>
      </View> */}
    </>
  );
};

const styles = StyleSheet.create({
  btnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnStyle: {
    width: '100%',
    borderRadius: 5,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Timer;


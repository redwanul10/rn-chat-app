import React, {useEffect} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import RootNavigation from './src/navigation/RootNavigation';
import {Root} from 'native-base';
import GlobalStateProvider from './src/GlobalStateProvider';
import axios from 'axios';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {SafeAreaView, Platform, StatusBar} from 'react-native';

dayjs.extend(localizedFormat);

axios.defaults.baseURL = 'https://erp.ibos.io';

export default function App() {
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await RNBootSplash.hide({fade: true});
    });

    //set bar style olny for ios
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', true);
    }
  }, []);

  return (
    <>
      <GlobalStateProvider>
        <Root>

          {/* set status bar color for ios */}
          <SafeAreaView style={{flex: 1, backgroundColor: '#063197'}}>
            <RootNavigation />
          </SafeAreaView>

          {/* Bottom Safe area */}
          <SafeAreaView style={{backgroundColor: 'transparent'}}></SafeAreaView>
        </Root>
      </GlobalStateProvider>
    </>
  );
}

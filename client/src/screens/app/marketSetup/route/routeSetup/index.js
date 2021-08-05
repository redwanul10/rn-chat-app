/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useContext} from 'react';
import {View} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {getRouteLandingData} from './helper';
import {GlobalState} from '../../../../../GlobalStateProvider';
import FabButton from '../../../../../common/components/FabButton';
import {FlatList} from 'react-native';
import {Spinner} from 'native-base';
import {useIsFocused} from '@react-navigation/native';
import ItemCard from './itemCard';

const title = 'Route Setup';

function RouteSetup({navigation}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [landingData, setRouteLandingData] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  const isFocused = useIsFocused();
  const [pageNo, setPageNo] = useState(0);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      // Initial Grid Data with Pagination
      getRouteLandingData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setIsLoading,
        landingData,
        setRouteLandingData,
        0,
        1, // Type For Pagination
      );
      setPageNo(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return (
    <>
      <FlatList
        ListHeaderComponent={() => (
          <>
            {/* top bar */}
            <CommonTopBar title={title} />

            {/* margin */}
            <View style={{marginTop: 25}} />

            {/* Card View */}
            <ItemCard />
          </>
        )}
        data={landingData?.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <ItemCard item={item} action="Edit" navigation={navigation} />
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          // Pagination Start when scrolling to bottom
          if (landingData?.data?.length < landingData?.totalCount) {
            setPageNo(pageNo + 1);
            getRouteLandingData(
              profileData?.accountId,
              selectedBusinessUnit?.value,
              setIsLoading,
              landingData,
              setRouteLandingData,
              pageNo + 1,
              2,
            );
          }
        }}
        ListFooterComponent={() => (
          <>{isLoading && <Spinner color="black" />}</>
        )}
      />

      <FabButton
        onPress={() => navigation.navigate('Create Route')}
        bgColor="#FFD34E"
      />
    </>
  );
}

export default RouteSetup;

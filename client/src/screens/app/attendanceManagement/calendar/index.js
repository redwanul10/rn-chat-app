import React, {useEffect, useState, useContext} from 'react';
import {View, FlatList, Text} from 'react-native';
import ICalender from './components/ICalender';
import ListCard from './components/listCard';
import {getAttendanceList, getEmployeeDDL} from './helper';
import {Spinner} from 'native-base';
import ColorDefine from './components/ColorDefine';

import Axios from 'axios';
import dayjs from 'dayjs';
import {GlobalState} from '../../../../GlobalStateProvider';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import ICustomPicker from '../../../../common/components/ICustomPicker';

let cancelToken;

const AttendanceCalendar = () => {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [attdList, setAttdList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState({});

  useEffect(() => {
    if (profileData?.employeeId) {
      getEmployeeDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.employeeId,
        setEmployeeDDL,
      );
    }
  }, [profileData]);

  const getAttandancelist_action = (employeeId) => {
    // Check if there are any previous pending requests
    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel('canceled request');
    }

    // Save the cancel token for the current request
    cancelToken = Axios.CancelToken.source();

    getAttendanceList(
      employeeId,
      currentDate?.month() + 1,
      currentDate?.year(),
      setIsLoading,
      setAttdList,
      cancelToken,
    );
  };

  useEffect(() => {
    if (selectedEmp?.value) {
      getAttandancelist_action(selectedEmp?.value);
    }
  }, [currentDate]);

  return (
    <>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <CommonTopBar />

        <View style={{paddingHorizontal: 10, marginTop: 10}}>
          <ICustomPicker
            value={selectedEmp}
            label="Select Employee"
            name="employee"
            options={employeeDDL}
            onChange={(selectionOption) => {
              setSelectedEmp(selectionOption);

              getAttandancelist_action(selectionOption?.value);
            }}
          />
        </View>

        <ICalender
          daysList={attdList}
          setAttdList={setAttdList}
          setIsLoading={setIsLoading}
          onMonthChange={(date) => setCurrentDate(date)}
        />

        {/* Daily History */}
        <FlatList
          ListHeaderComponent={() => (
            <>
              <ColorDefine />
              <Text style={{margin: 14, color: '#989898'}}>
                Attendance Details
              </Text>
              {isLoading && <Spinner color="black" />}
            </>
          )}
          data={attdList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <ListCard data={item} />}
        />
      </View>
    </>
  );
};

export default AttendanceCalendar;

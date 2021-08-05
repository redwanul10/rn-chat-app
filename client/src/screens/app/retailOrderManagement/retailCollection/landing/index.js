/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useContext} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  // Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import {useFormik} from 'formik';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {getRetailCollectionLandingData, getRouteDDL} from '../helper';
import {GlobalState} from '../../../../../GlobalStateProvider';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import * as Yup from 'yup';
import Text from '../../../../../common/components/IText';
import {globalStyles} from '../../../../../common/globalStyle/globalStyles';
import SearchForm from './searchForm';
import LandingCard from './landingCard';
import DemoLandingCard from './demoLandingCard';

const validationSchema = Yup.object({
  route: Yup.object().shape({
    label: Yup.string().required('Route is required'),
    value: Yup.string().required('Route is required'),
  }),
  territory: Yup.object().shape({
    label: Yup.string().required('Route is required'),
    value: Yup.string().required('Route is required'),
  }),
});

const initValues = {
  territory: '',
  route: '',
  reportType: '',
  fromDate: '',
  toDate: '',
};

function RetailCollection({navigation}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [landingData, setLandingData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: {...initValues},
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      viewHandler(values, () => {
        actions.resetForm();
      });
    },
  });

  const viewHandler = (values) => {
    getRetailCollectionLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.route?.value,
      2 || values?.reportType?.value,
      setLandingData,
      setLoading,
    );
  };

  return (
    <>
      <ScrollView
      contentContainerStyle={{backgroundColor: 'transparent' || '#F4F6FC'}}>
      <CommonTopBar />

      <SearchForm
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        territoryInfo={territoryInfo}
        formikprops={formikprops}
        loading={loading}
      />

      {landingData?.objdata?.map((item, index) => (
        <>
          <LandingCard key={index} navigation={navigation} item={item} />
        </>
      ))}

      {/* <FlatList
        data={landingData?.objdata}
        keyExtractor={(item, index) => index?.toString()}
        renderItem={({item, index}) => (
          <LandingCard key={index} navigation={navigation} item={item} />
        )}
      /> */}
      </ScrollView>
    </>
  );
}

export default RetailCollection;
const styles = StyleSheet.create({
  customerAmount: {
    fontWeight: 'bold',
    fontSize: 15,
  },

  cardStyle: {
    flexDirection: 'row',
  },
  teritoryText: {
    color: '#000000',
    paddingRight: 10,
    paddingVertical: 5,
    opacity: 0.75,
  },
  completeButton: {
    marginLeft: 10,
    backgroundColor: '#D1FFDF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#D2D2D2',
  },
  createButton: {
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,

    backgroundColor: '#00cdac',
    borderRadius: 7,
    alignItems: 'center',
  },
});

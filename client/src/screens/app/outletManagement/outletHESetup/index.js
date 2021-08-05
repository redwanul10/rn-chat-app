import React, {useEffect, useState, useContext} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import {GlobalState} from '../../../../GlobalStateProvider';
import {Formik} from 'formik';
import ICustomPicker from '../../../../common/components/ICustomPicker';
import CustomButton from '../../../../common/components/CustomButton';
import {getTerritoryDDL} from '../../../../common/actions/helper';
// import {getRouteDDL, getLandingData, approveOutlet} from './helper';
import ICheckbox from '../../../../common/components/ICheckbox';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import IDatePicker from '../../../../common/components/IDatePicker';
import {yearDDL} from '../../../../common/functions/yearDDL';
import DocumentPicker from 'react-native-document-picker';
import {Spinner} from 'native-base';
import {
  getDistributorChannel,
  getRegionDDL,
  getAreaDDL,
  getPointDDL,
  getTerritoryDDLforHeSetup,
  getSectionDDL,
  getMonthDDL,
  getGridData,
  getDateDDL,
} from './helper';
import FilePicker from '../../../../common/components/FilePicker';

const initValues = {
  month: '',
  year: '',
  channel: '',
};

const OutletHESetup = ({navigation, route: {params}}) => {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isdataLoading, setIsDataLoading] = useState(false);
  const [landingData, setLandingData] = useState([]);
  const [channelDDL, setChannelDDL] = useState([]);
  const [regionDDL, setRegionDDL] = useState([]);
  const [areaDDL, setAreaDDL] = useState([]);
  const [pointDDL, setPointDDL] = useState([]);
  const [sectionDDL, setSectionDDL] = useState([]);
  const [monthDDL, setMonthDDL] = useState([]);
  const [dateDDL, setDateDDL] = useState([]);

  //   DDL State
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);

  useEffect(() => {
    getDistributorChannel(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setChannelDDL,
    );

    getMonthDDL(setMonthDDL);
  }, []);

  const viewHandler = (values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.route?.value,
      0,
      setLandingData,
      setIsLoading,
    );
  };

  const saveHandler = (values) => {
    const approveItems = landingData?.data?.filter((item) => item?.isApprove);
    const payload = approveItems?.map((item) => ({
      intOutletId: item?.outletId,
    }));

    approveOutlet(payload, setIsLoading, async () => {
      await viewHandler(values);
    });
  };

  const rowDtoHandler = (name, value, sl, item) => {
    let data = [...landingData?.data];
    let _sl = data[sl];
    _sl[name] = value;
    setLandingData({...landingData, data});
  };

  const approveItems = landingData?.data?.filter((item) => item?.isApprove);

  return (
    <>
      <CommonTopBar />
      {/* {console.log('territory info', territoryInfo)} */}
      <ScrollView
        contentContainerStyle={{paddingHorizontal: 10, paddingTop: 10}}>
        <Formik
          enableReinitialize={true}
          initialValues={{...initValues}}
          onSubmit={(values, actions) => {
            viewHandler(values, () => {
              actions.resetForm();
            });
          }}>
          {(formikprops) => (
            <>
              <View>
                {/* <ScrollView> */}

                <Row colGap={6}>
                  <Col width="50%">
                    <ICustomPicker
                      label="Month"
                      name="month"
                      options={monthDDL}
                      formikProps={formikprops}
                    />
                  </Col>
                  {/* {console.log('monthddk', JSON.stringify(monthDDL, null, 2))} */}
                  <Col width="50%">
                    <ICustomPicker
                      label="Year"
                      name="year"
                      options={yearDDL()}
                      onChange={(item) => {
                        formikprops.setFieldValue('year', item);
                        getDateDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          formikprops?.values?.month?.value,
                          item?.value,

                          formikprops?.setFieldValue,
                        );
                      }}
                      formikProps={formikprops}
                    />
                  </Col>
                </Row>
                <Row colGap={6}>
                  <Col width="50%">
                    <IDatePicker
                      disabled={true}
                      label="From Date"
                      name="fromDate"
                      // value={_dateFor dateDDL?.startDate}
                      formikProps={formikprops}
                    />
                  </Col>
                  <Col width="50%">
                    <IDatePicker
                      disabled={true}
                      label="To Date"
                      name="toDate"
                      formikProps={formikprops}
                    />
                  </Col>
                </Row>

                <Row colGap={6}>
                  <Col width="50%">
                    <ICustomPicker
                      label="Channel"
                      name="channel"
                      options={channelDDL}
                      onChange={(item) => {
                        formikprops.setFieldValue('channel', item);
                        getRegionDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          item?.value,
                          setRegionDDL,
                        );
                      }}
                      formikProps={formikprops}
                    />
                  </Col>
                  <Col width="50%">
                    <ICustomPicker
                      label="Region"
                      name="region"
                      options={regionDDL}
                      wrapperStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: 5,
                      }}
                      onChange={(item) => {
                        formikprops.setFieldValue('region', item);
                        getAreaDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          formikprops?.values?.channel?.value,
                          item?.value,
                          setAreaDDL,
                        );
                      }}
                      formikProps={formikprops}
                    />
                  </Col>
                </Row>
                <Row colGap={6}>
                  <Col width="50%">
                    <ICustomPicker
                      label="Area"
                      name="area"
                      options={areaDDL}
                      wrapperStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: 5,
                      }}
                      onChange={(item) => {
                        formikprops.setFieldValue('area', item);
                        getTerritoryDDLforHeSetup(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          formikprops?.values?.channel?.value,
                          item?.value,
                          setTerritoryDDL,
                        );
                      }}
                      formikProps={formikprops}
                    />
                  </Col>
                  <Col width="50%">
                    <ICustomPicker
                      label="Territory"
                      name="territory"
                      options={territoryDDL}
                      wrapperStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: 5,
                      }}
                      onChange={(item) => {
                        formikprops.setFieldValue('territory', item);
                        getPointDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          formikprops?.values?.channel?.value,
                          item?.value,
                          setPointDDL,
                        );
                      }}
                      formikProps={formikprops}
                    />
                  </Col>
                </Row>
                <Row colGap={6}>
                  <Col width="50%">
                    <ICustomPicker
                      label="Point"
                      name="point"
                      options={pointDDL}
                      wrapperStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: 5,
                      }}
                      onChange={(item) => {
                        formikprops.setFieldValue('point', item);
                        getSectionDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          formikprops?.values?.channel?.value,
                          item?.value,
                          setSectionDDL,
                        );
                      }}
                      formikProps={formikprops}
                    />
                  </Col>
                  <Col width="50%">
                    <ICustomPicker
                      label="Section"
                      name="section"
                      options={sectionDDL}
                      wrapperStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: 5,
                      }}
                      onChange={(item) => {
                        formikprops.setFieldValue('section', item);
                        getGridData(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          item?.value,
                          formikprops?.values?.month?.value,
                          formikprops?.values?.year?.value,
                          setIsDataLoading,
                          setLandingData,
                        );
                      }}
                      formikProps={formikprops}
                    />
                  </Col>
                </Row>
                <Row colGap={6}>
                  <Col width="50%">
                    <CustomButton
                      disabled={
                        !formikprops?.values?.month?.value ||
                        !formikprops?.values?.year?.value ||
                        !formikprops?.values?.fromDate ||
                        !formikprops?.values?.toDate ||
                        !formikprops?.values?.channel?.value ||
                        !formikprops?.values?.region?.value ||
                        !formikprops?.values?.area?.value ||
                        !formikprops?.values?.territory?.value ||
                        !formikprops?.values?.point?.value ||
                        !formikprops?.values?.section?.value
                      }
                      onPress={(e) => {
                        navigation?.navigate('Create Outlet HE Setup', {
                          ...formikprops?.values,
                        });
                      }}
                      btnTxt="Create"
                    />
                  </Col>
                  <Col width="50%">
                    {isdataLoading && (
                      <Spinner
                        color="black"
                        style={{
                          transform: [{scaleX: 0.6}, {scaleY: 0.6}],
                        }}
                      />
                    )}
                  </Col>

                  {/* <Col width="50%">
                    <FilePicker
                     type={[DocumentPicker.types.xls,DocumentPicker.types.xlsx]}
                    />
                  </Col> */}
                </Row>

                {/* setRoute(item); */}

                <View
                  style={{
                    marginVertical: 10,
                    backgroundColor: '#ffffff',
                    padding: 7,
                    borderRadius: 5,
                  }}>
                  <View
                    style={[
                      styles.cardStyle,
                      {justifyContent: 'space-between'},
                    ]}>
                    <Text style={styles.customerAmount}>Territory Name</Text>

                    <Text style={[styles.customerAmount, {color: '#00B44A'}]}>
                      Outlet No
                    </Text>
                  </View>
                </View>

                {landingData?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.navigate('Edit Outlet HE Setup', {
                        // outletNo: item?.heoutletNo,
                        item,
                      })
                    }
                    style={{
                      marginVertical: 10,
                      backgroundColor: '#ffffff',
                      padding: 7,
                      borderRadius: 5,
                    }}>
                    <View
                      style={[
                        styles.cardStyle,
                        {justifyContent: 'space-between'},
                      ]}>
                      <Text style={styles.customerAmount}>
                        {item?.territoryName}
                      </Text>

                      <Text style={[styles.customerAmount, {color: '#00B44A'}]}>
                        {item?.heoutletNo}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
                {/* </ScrollView> */}
              </View>
            </>
          )}
        </Formik>
      </ScrollView>
    </>
  );
};

export default OutletHESetup;

const styles = StyleSheet.create({
  customerAmount: {
    fontWeight: 'bold',
    fontSize: 17,
  },

  cardStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teritoryText: {
    color: '#000000',
    paddingRight: 10,
    paddingVertical: 5,
    opacity: 0.75,
  },
  completeButton: {
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
  fabStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    top: '80%',

    right: 17,
    height: 60,
    backgroundColor: '#3A405A',
    borderRadius: 100,
  },
  createButton: {
    marginRight: 50,
    padding: 6,
    backgroundColor: '#007bff',
    borderRadius: 7,
    alignItems: 'center',
    width: 70,
  },
});

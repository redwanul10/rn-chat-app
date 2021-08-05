/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import IconThree from 'react-native-vector-icons/Entypo';
import CommonTopBar from '../../../../../common/components/CommonTopBar';

import {getLandingData} from './helper';
import {GlobalState} from '../../../../../GlobalStateProvider';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import CustomButton from '../../../../../common/components/CustomButton';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Col from '../../../../../common/components/Col';
import Row from '../../../../../common/components/Row';
import IRadioButton from '../../../../../common/components/IRadioButton';

const validationSchema = Yup.object().shape({
  approve: Yup.object().shape({
    label: Yup.string().required('Approval Status is required'),
    value: Yup.string().required('Approval Status is required'),
  }),
});

const title = 'Outlet Registration';
const initValues = {
  route: '',
  beat: '',
  territory: '',
  approve: '',
  check: 1,
  type: 1,
};

const statusDDL = [
  {value: 1, label: 'Approve', isStatus: true},
  {value: 2, label: 'Unapprove', isStatus: false},
];

function OutLetRegLanding({navigation}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );

  console.log(JSON.stringify(territoryInfo, null, 2));

  const [loading, setLoading] = useState(false);
  const [landingData, setLandingData] = useState([]);

  const viewHandler = (values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.approve?.isStatus,
      territoryInfo?.empTerritoryId,
      territoryInfo?.empChannelId,
      territoryInfo?.empLevelId,
      values?.type,
      setLoading,
      setLandingData,
    );
  };

  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: {...initValues, approve: statusDDL[0]},
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      viewHandler(values, () => {
        actions.resetForm();
      });
    },
  });

  return (
    <>
      <CommonTopBar title={title} />

      <ScrollView>
        <>
          {/* Landing Form */}

          <View style={{marginHorizontal: 10, marginTop: 20}}>
            <Row colGap={10} style={{alignItems: 'center'}}>
              <Col width={'100%'}>
                <ICustomPicker
                  label="Approval Status"
                  name="approve"
                  options={statusDDL}
                  onChange={(valueOption) => {
                    formikprops.setFieldValue('approve', valueOption);
                    setLandingData([]);
                  }}
                  formikProps={formikprops}
                />
              </Col>

              <Col width="100%">
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                  <Text style={{marginHorizontal: 10}}>Register</Text>
                  <IRadioButton
                    onPress={() => formikprops.setFieldValue('type', 1)}
                    selected={formikprops?.values?.type === 1}
                  />

                  <Text style={{marginHorizontal: 10}}>Assign</Text>
                  <IRadioButton
                    onPress={() => formikprops.setFieldValue('type', 2)}
                    selected={formikprops?.values?.type === 2}
                  />
                </View>
              </Col>
            </Row>

            <CustomButton
              onPress={formikprops.handleSubmit}
              isLoading={loading}
              btnTxt="View"
            />
          </View>

          {/* Outlet Card Demo */}

          {landingData?.data?.length > 0 && (
            <>
              <Row
                style={{
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  marginVertical: 10,
                  marginHorizontal: 10,
                  borderRadius: 5,
                  backgroundColor: '#ffffff',
                  alignItems:"center"
                }}
                colGap={5}>
                <Col style={{alignItems: 'flex-start'}} width="50%">
                  <Text style={[styles.customerAmount]}>Outlet Name</Text>
                  <Text style={[styles.teritoryText, {fontWeight: 'bold'}]}>
                    Code
                  </Text>
                  <Text style={[styles.teritoryText, {fontWeight: 'bold'}]}>
                    Thana Name
                  </Text>
                  <Text style={styles.teritoryText}>Outlet Address</Text>
                </Col>
                <Col style={{alignItems: 'flex-end'}} width="50%">
                  <Text
                    style={[
                      styles.customerAmount,
                      {color: 'green', textAlign: 'right'},
                    ]}>
                    Owner Name
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'black',
                    }}>
                    Mobile Number
                  </Text>

                  <View>
                    <Text
                      style={[
                        styles.editButton,
                        {marginTop: 5, textAlign: 'center'},
                      ]}>
                      Action
                    </Text>
                  </View>
                </Col>
              </Row>
            </>
          )}

          {/* Outlet Card List */}

          {landingData?.data?.map((item, index) => (
            <Row
              style={{
                paddingHorizontal: 5,
                paddingVertical: 10,
                marginBottom: 10,
                marginHorizontal: 10,
                borderRadius: 5,
                backgroundColor: '#ffffff',
                alignItems:"center"
              }}
              colGap={5}>
              <Col style={{alignItems: 'flex-start'}} width="50%">
                <Text style={[styles.customerAmount]}>{item?.outletName}</Text>
                <Text style={[styles.teritoryText, {fontWeight: 'bold'}]}>
                  {item?.outletCode}
                </Text>
                <Text style={[styles.teritoryText, {fontWeight: 'bold'}]}>
                  {item?.thanaName}
                </Text>
                <Text style={styles.teritoryText}>{item?.outletAddress}</Text>
              </Col>
              <Col style={{alignItems: 'flex-end'}} width="50%">
                <Text
                  style={[
                    styles.customerAmount,
                    {color: 'green', textAlign: 'right'},
                  ]}>
                  {item?.ownerName}
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                  }}>
                  {item?.mobileNumber}
                </Text>

                <View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Outlet Profile Reg Create', {
                        id: item?.outletId,
                      })
                    }>
                    <Text
                      style={[
                        styles.editButton,
                        {marginTop: 5, textAlign: 'center'},
                      ]}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </Col>
            </Row>
          ))}
        </>
      </ScrollView>

      {/* Fab / Create Button */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Outlet Profile Reg Create', {
            routeName: formikprops?.values?.route,
            beatName: formikprops?.values?.beat,
          })
        }
        style={styles.fabStyle}>
        <IconThree name="plus" size={40} color="#ffffff" />
      </TouchableOpacity>
    </>
  );
}

export default OutLetRegLanding;

const styles = StyleSheet.create({
  total: {color: '#919191'},
  cardColor: {color: '#57606F'},
  outLetName: {fontWeight: 'bold', fontSize: 16},
  edit: {
    height: 17,
    width: 17,
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#AEAEAE',
    marginVertical: 2,
  },
  infoSerial: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  fabStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: 55,
    right: 17,
    height: 60,
    backgroundColor: '#00cdac',
    borderRadius: 100,
  },
  customerAmount: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  cardStyle: {
    flexDirection: 'row',
  },
  teritoryText: {
    color: '#000000',
    opacity: 0.75,
  },
  editButton: {
    color: 'white',
    backgroundColor: '#00cdac',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 2,
  },
});

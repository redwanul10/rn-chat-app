/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  // Text,
  TouchableOpacity,
  Modal,
} from 'react-native';

import CommonTopBar from '../../../../common/components/CommonTopBar';
import {useFormik} from 'formik';
import {GlobalState} from '../../../../GlobalStateProvider';
import ICustomPicker from '../../../../common/components/ICustomPicker';
import CustomButton from '../../../../common/components/CustomButton';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import {
  getLandingData,
  editOutletAssetRequestApprovalList_api,
  reject_api,
} from './helper';
import IDatePicker from '../../../../common/components/IDatePicker';
import {_todayDate} from '../../../../common/functions/_todayDate';
import NoDataFoundGrid from '../../../../common/components/NoDataFoundGrid';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import ICheckbox from '../../../../common/components/ICheckbox';
import {useIsFocused} from '@react-navigation/native';
import Text from '../../../../common/components/IText';
import * as Yup from 'yup';

const initValues = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  status: {value: 1, label: 'Approved'},
  requestType: '',
};

const schemaValidation = Yup.object().shape({
  requestType: Yup.object().shape({
    label: Yup.string().required('Request Type is required'),
    value: Yup.string().required('Request Type is required'),
  }),
});

function SupervisorAssetApproval({navigation}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);

  const [landingData, setLandingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const [approval, Setapproval] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const isFocused = useIsFocused();

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: initValues,
    validationSchema: schemaValidation,
    onSubmit: (values, actions) => {
      viewHandler(values);
    },
  });

  // Modal State
  const [showModal, setShowModal] = useState(false);

  // useEffect(() => {
  //   getLandingData(
  //     profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     formikprops?.values?.requestType?.value,
  //     setLoading,
  //     setLandingData,
  //   );
  //   setCallback();
  // }, [isFocused]);

  const viewHandler = (values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.requestType?.value,
      setLoading,
      setLandingData,
    );
  };

  const setCallback = () => {
    setShowModal(false);
    setCheckBox(false);
    setIsRejected(false);
    Setapproval(true);
  };

  const rowDtoHandler = (name, value, sl) => {
    console.log(name, value, sl);
    let data = [...landingData];
    let _sl = data[sl];
    _sl[name] = value;
    setLandingData([...landingData]);
  };

  // All item select
  const allGridCheck = (value) => {
    const modifyData = landingData?.map((item) => ({
      ...item,
      approve: value,
    }));

    setLandingData(modifyData);
  };

  // Approve Hanlder
  const approvalHandler = (values) => {
    // filter selected Items
    const modifyFilterRowDto = landingData?.filter((itm) => itm?.approve);

    // Generate Paylaod
    const payload = modifyFilterRowDto?.map((itm) => ({
      requestId: itm?.requestId,
    }));

    editOutletAssetRequestApprovalList_api(
      formikprops?.values?.requestType?.value,
      payload,
      setLoading,
      () => {
        viewHandler(values);
        setCallback();
      },
    );
  };

  // Reject Hanlder
  const rejectHandler = (values) => {
    // filter selected Items
    const modifyFilterRowDto = landingData?.filter((itm) => itm?.approve);

    // Generate Paylaod
    const payload = modifyFilterRowDto?.map((itm) => ({
      requestId: itm?.requestId,
    }));

    reject_api(
      formikprops?.values?.requestType?.value,
      payload,
      setLoading,
      () => {
        viewHandler(values);
        setCallback();
      },
    );
  };

  const selectedItems = landingData?.filter((item) => item?.approve);
  return (
    <>
      <ScrollView>
        <CommonTopBar />

        <>
          <View style={{paddingHorizontal: 10, marginTop: 10}}>
            <ScrollView>
              <ICustomPicker
                label="Request Type"
                name="requestType"
                options={[
                  {label: 'Maintenance', value: 1},
                  {label: 'Pullout', value: 2},
                  {label: 'Transfer', value: 3},
                ]}
                onChange={(item) => {
                  formikprops.setFieldValue('requestType', item);
                  setLandingData([]);
                  // Setapproval(true);
                  if (checkBox) setCheckBox(false);
                }}
                formikProps={formikprops}
              />

              <Row colGap={5}>
                {selectedItems?.length === 0 ? (
                  <Col width="100%">
                    <CustomButton
                      onPress={formikprops.handleSubmit}
                      isLoading={loading}
                      btnTxt="View"
                    />
                  </Col>
                ) : (
                  <>
                    <Col width={'50%'}>
                      <CustomButton
                        onPress={() => setShowModal(true)}
                        isLoading={loading && !isRejected}
                        btnTxt="Approve"
                      />
                    </Col>
                    <Col width={'50%'}>
                      <CustomButton
                        onPress={() => {
                          setShowModal(true);
                          setIsRejected(true);
                        }}
                        isLoading={loading && isRejected}
                        btnTxt="Reject"
                      />
                    </Col>
                  </>
                )}
              </Row>

              {/* Header Part */}
              <Row
                style={{
                  marginVertical: 10,
                  padding: 10,
                  borderRadius: 5,
                  backgroundColor: '#ffffff',
                }}>
                <Col width="50%">
                  <Text style={styles.customerAmount}>Point</Text>
                  {/* <Text style={[styles.customerAmount, styles.fontSize]}>
                  section Name
                  </Text> */}
                  <Text style={[styles.customerAmount, styles.fontSize]}>
                    Route Name
                  </Text>

                  {/* {formikprops?.values?.status?.value === 2 ? ( */}
                  <View style={{flexDirection: 'row', marginTop: 4}}>
                    <ICheckbox
                      checked={checkBox}
                      onPress={(e) => {
                        setCheckBox(!checkBox);
                        allGridCheck(!checkBox);
                      }}
                    />
                    <Text>All</Text>
                  </View>
                  {/* ) : null} */}
                </Col>
                <Col width="50%">
                  <Text style={[styles.date, {fontSize: 15, color: 'green'}]}>
                    Outlet Name
                  </Text>
                  <Text style={styles.date}>Outlet Address</Text>
                  <Text
                    style={[
                      styles.customerAmount,
                      styles.fontSize,
                      {textAlign: 'right'},
                    ]}>
                    Asset Name + Qty
                  </Text>
                  {/* <Text style={styles.date}>Action</Text> */}
                </Col>
              </Row>

              {landingData?.map((item, index) => (
                <Row
                  style={{
                    marginBottom: 10,
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: '#ffffff',
                  }}>
                  <Col width="50%">
                    <Text style={[styles.customerAmount, styles.fontSize]}>
                      {item?.point}
                    </Text>
                    {/* <Text style={[styles.customerAmount, styles.fontSize]}>
                        {item?.section}
                      </Text> */}
                    <Text style={[styles.customerAmount, styles.fontSize]}>
                      {item?.route}
                    </Text>

                    {/* {formikprops?.values?.status?.value === 2 ? ( */}
                    <View style={{flexDirection: 'row', marginTop: 4}}>
                      <ICheckbox
                        checked={item?.approve}
                        onPress={() => {
                          rowDtoHandler('approve', !item?.approve, index);
                        }}
                      />
                    </View>
                    {/* ) : null} */}
                  </Col>
                  <Col width="50%">
                    <Text style={[styles.date, {fontSize: 15, color: 'green'}]}>
                      {item?.outletName}
                    </Text>
                    <Text style={styles.date}>{item?.address}</Text>
                    <Text
                      style={[
                        styles.customerAmount,
                        styles.fontSize,
                        {textAlign: 'right'},
                      ]}>
                      {item?.assetName} - {item?.quantity}
                    </Text>
                  </Col>
                </Row>
              ))}
            </ScrollView>
          </View>

          {landingData?.length === 0 && <NoDataFoundGrid />}

          <Modal animationType="fade" transparent visible={showModal}>
            <View style={styles.centeredView}>
              <View style={styles.modalStyle}>
                <Text style={styles.updateAvailable}>Are you sure?</Text>

                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <View style={styles.updateButtons}>
                    <TouchableOpacity
                      onPress={() => {
                        if (isRejected) {
                          rejectHandler(formikprops?.values);
                        } else {
                          approvalHandler(formikprops?.values);
                        }
                      }}
                      style={[
                        styles.updateButtonStyle,
                        {backgroundColor: '#063197'},
                      ]}>
                      <Text style={{color: 'white', textAlign: 'center'}}>
                        {isRejected ? 'Reject' : 'Approve'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.updateButtons}>
                    <TouchableOpacity
                      onPress={() => {
                        setShowModal(false);
                        setIsRejected(false);
                      }}
                      style={[
                        styles.updateButtonStyle,
                        {backgroundColor: 'tomato'},
                      ]}>
                      <Text style={{color: 'white', textAlign: 'center'}}>
                        Cencel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </>
      </ScrollView>
    </>
  );
}

export default SupervisorAssetApproval;

const styles = StyleSheet.create({
  customerAmount: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000',
  },
  date: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
  },
  editButton: {
    marginTop: 5,
    backgroundColor: '#00cdac',
    paddingHorizontal: 10,
    paddingVertical: 3,
    color: 'white',
    borderRadius: 5,
  },
  fontSize: {
    fontSize: 13,
  },
  address: {color: '#00B44A', fontWeight: 'bold', fontSize: 14},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121E4499',
  },
  modalStyle: {
    width: 340,
    height: 183,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  updateAvailable: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 27,
    fontSize: 20,
    color: '#063197',
    fontWeight: 'bold',
  },
  updateButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0,
  },
  updateButtonStyle: {
    width: 100,
    margin: 2,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 15,
  },
});

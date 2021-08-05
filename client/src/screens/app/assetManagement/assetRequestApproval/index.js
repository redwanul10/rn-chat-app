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

const initValues = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  status: {value: 1, label: 'Approved'},
};

function AssetRequestApproval({navigation}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);

  const [landingData, setLandingData] = useState();
  const [loading, setLoading] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const [approval, Setapproval] = useState(true);
  const [isRejected, setIsRejected] = useState(false);
  const isFocused = useIsFocused();

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: initValues,
    onSubmit: (values, actions) => {
      viewHandler(values);
    },
  });

  // Modal State
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      formikprops?.values?.status?.value,
      formikprops?.values?.fromDate,
      formikprops?.values?.toDate,
      1,
      1000,
      setLoading,
      setLandingData,
    );
    setCallback();
  }, [isFocused]);

  const viewHandler = (values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.status?.value,
      values?.fromDate,
      values?.toDate,
      1,
      1000,
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

  // Select Single Item
  const selectIndividualItem = (index) => {
    let newRowdata = [...landingData?.data];
    newRowdata[index].isSelect = !newRowdata[index].isSelect;
    setLandingData({
      currentPage: landingData?.currentPage,
      data: newRowdata,
      pageSize: landingData?.pageSize,
      totalCount: landingData?.totalCount,
    });
    const approval = newRowdata.some((itm) => itm.isSelect === true);
    if (approval) {
      Setapproval(false);
    } else {
      Setapproval(true);
    }
  };

  // All item select
  const allGridCheck = (value) => {
    let newRowdata = [...(landingData?.data || [])];
    const modifyGridData = newRowdata?.map((itm) => ({
      ...itm,
      isSelect: value,
    }));
    setLandingData({
      currentPage: landingData?.currentPage,
      data: modifyGridData,
      pageSize: landingData?.pageSize,
      totalCount: landingData?.totalCount,
    });
    const approval = modifyGridData.some((itm) => itm?.isSelect === true);
    if (approval) {
      Setapproval(false);
    } else {
      Setapproval(true);
    }
  };

  // Approve Hanlder
  const approvalHandler = (values) => {
    const modifyFilterRowDto = landingData?.data?.filter(
      (itm) => itm?.isSelect === true,
    );

    const payload = modifyFilterRowDto?.map((itm) => ({
      assetRequestId: itm?.assetRequestId,
      actionBy: profileData?.userId,
      isApproved: true,
    }));

    editOutletAssetRequestApprovalList_api(payload, setLoading, () => {
      viewHandler(values);
      setCallback();
    });
  };

  // Reject Hanlder
  const rejectHandler = (values) => {
    const modifyFilterRowDto = landingData?.data?.filter(
      (itm) => itm?.isSelect === true,
    );

    const payload = modifyFilterRowDto?.map((itm) => ({
      assetRequestId: itm?.assetRequestId,
      rejectedBy: profileData?.userId,
    }));

    reject_api(payload, setLoading, () => {
      viewHandler(values);
      setCallback();
    });
  };

  return (
    <>
      <ScrollView>
        <CommonTopBar title={'Outlet Asset Request Approval'} />

        <>
          <View style={{paddingHorizontal: 10, marginTop: 10}}>
            <ScrollView>
              <Row colGap={5}>
                <Col width="50%">
                  <IDatePicker
                    label="From Date"
                    name="fromDate"
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <IDatePicker
                    label="To Date"
                    name="toDate"
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    label="Status"
                    name="status"
                    options={[
                      {value: 1, label: 'Approved'},
                      {value: 2, label: 'Unapproved'},
                    ]}
                    onChange={(item) => {
                      formikprops.setFieldValue('status', item);
                      setLandingData();
                      Setapproval(true);
                    }}
                    formikProps={formikprops}
                  />
                </Col>
              </Row>

              <Row colGap={5}>
                {approval ? (
                  <Col width="100%">
                    <CustomButton
                      onPress={formikprops.handleSubmit}
                      isLoading={loading}
                      btnTxt="View"
                    />
                  </Col>
                ) : (
                  <>
                    <Col width={!approval ? '50%' : '100%'}>
                      <CustomButton
                        onPress={() => setShowModal(true)}
                        isLoading={loading}
                        btnTxt="Approve"
                      />
                    </Col>
                    <Col width={!approval ? '50%' : '100%'}>
                      <CustomButton
                        onPress={() => {
                          setShowModal(true);
                          setIsRejected(true);
                        }}
                        isLoading={loading}
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
                  <Text style={styles.customerAmount}>Territory Name</Text>
                  <Text style={[styles.customerAmount, styles.fontSize]}>
                    Route Name
                  </Text>
                  <Text style={[styles.customerAmount, styles.fontSize]}>
                    Market Name
                  </Text>

                  {formikprops?.values?.status?.value === 2 ? (
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
                  ) : null}
                </Col>
                <Col width="50%">
                  <Text style={[styles.date, {fontSize: 15, color: 'green'}]}>
                    Outlet Name
                  </Text>
                  <Text style={styles.date}>Outlet Address</Text>
                  <Text style={styles.date}>Required Date</Text>
                  <Text style={styles.date}>Action</Text>
                </Col>
              </Row>

              {landingData?.data?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (formikprops?.values?.status?.value === 2) {
                      selectIndividualItem(index);
                    }
                  }}>
                  <Row
                    style={{
                      marginBottom: 10,
                      padding: 10,
                      borderRadius: 5,
                      backgroundColor: '#ffffff',
                    }}>
                    <Col width="50%">
                      <Text style={[styles.customerAmount, styles.fontSize]}>
                        {item?.territoryName}
                      </Text>
                      <Text style={[styles.customerAmount, styles.fontSize]}>
                        {item?.routeName}
                      </Text>
                      <Text style={[styles.customerAmount, styles.fontSize]}>
                        {item?.marketName}
                      </Text>
                      {formikprops?.values?.status?.value === 2 ? (
                        <View style={{flexDirection: 'row', marginTop: 4}}>
                          <ICheckbox
                            checked={item?.isSelect}
                            onPress={() => {
                              selectIndividualItem(index);
                            }}
                          />
                        </View>
                      ) : null}
                    </Col>
                    <Col width="50%">
                      <Text
                        style={[styles.date, {fontSize: 15, color: 'green'}]}>
                        {item?.outletName}
                      </Text>
                      <Text style={styles.date}>{item?.outletAddress}</Text>
                      <Text style={styles.date}>
                        {_dateFormatter(item?.dteRequiredDate)}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                        }}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('assetRequestApprovalView', {
                              ...formikprops?.values,
                              id: item?.assetRequestId,
                            })
                          }>
                          <Text style={styles.editButton}>View</Text>
                        </TouchableOpacity>
                      </View>
                    </Col>
                  </Row>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {landingData?.data?.length === 0 && <NoDataFoundGrid />}

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

export default AssetRequestApproval;

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

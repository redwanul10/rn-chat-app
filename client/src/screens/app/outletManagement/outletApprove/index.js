import React, {useEffect, useState, useContext} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import {GlobalState} from '../../../../GlobalStateProvider';
import {useFormik} from 'formik';
import ICustomPicker from '../../../../common/components/ICustomPicker';
import CustomButton from '../../../../common/components/CustomButton';
import {getTerritoryDDL} from '../../../../common/actions/helper';
import {
  getRouteDDL,
  getLandingData,
  approveOutlet,
  rejectOutlet,
} from './helper';
import ICheckbox from '../../../../common/components/ICheckbox';
import * as Yup from 'yup';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import {routeSelectByDefault} from '../../../../common/functions/routeSelectedByDefault';

const schemaValidation = Yup.object({
  territory: Yup.object().shape({
    label: Yup.string().required('Territory Name is required'),
    value: Yup.string().required('Territory Name is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('Route Name is required'),
    value: Yup.string().required('Route Name is required'),
  }),
});

const initValues = {
  territory: '',
  route: '',
  beat: '',
};

const OutletApprove = ({navigation, route: {params}}) => {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [landingData, setLandingData] = useState([]);

  //   DDL State
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: {...initValues},
    validationSchema: schemaValidation,
    onSubmit: (values, actions) => {
      viewHandler(values, () => {
        actions.resetForm();
      });
    },
  });

  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setTerritoryDDL,
    );
  }, []);

  const viewHandler = (values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.route?.value,
      0,
      // values?.beat?.value,
      setLandingData,
      setIsLoading,
    );
  };

  // Approve Handler
  const saveHandler = (values) => {
    const approveItems = landingData?.data?.filter((item) => item?.isApprove);
    const payload = approveItems?.map((item) => ({
      intOutletId: item?.outletId,
    }));

    approveOutlet(payload, setIsLoading, async () => {
      await viewHandler(values);
      setShowModal(false);
      setIsRejected(false);
    });
  };

  // Reject Handler
  const rejectHandler = (values) => {
    const approveItems = landingData?.data?.filter((item) => item?.isApprove);
    const payload = approveItems?.map((item) => ({
      intOutletId: item?.outletId,
      rejectedBy: profileData?.userId,
    }));
    // console.log('reject payload', JSON.stringify(payload, null, 2));

    rejectOutlet(payload, setIsLoading, async () => {
      await viewHandler(values);
      setShowModal(false);
      setIsRejected(false);
    });
  };

  const rowDtoHandler = (name, value, sl, item) => {
    let data = [...landingData?.data];
    let _sl = data[sl];
    _sl[name] = value;
    setLandingData({...landingData, data});
  };

  const approveItems = landingData?.data?.filter((item) => item?.isApprove);

  // Last Added | By Default Route Selected | login info wise (territoryInfo?.todayRouteId)
  useEffect(() => {
    routeSelectByDefault(territoryInfo, routeDDL, (selectedRoute) => {
      formikprops?.setFieldValue('route', selectedRoute);
    });
  }, [routeDDL]);

  return (
    <>
      <CommonTopBar />

      <ScrollView
        contentContainerStyle={{paddingHorizontal: 10, paddingTop: 10}}>
        <>
          <View>
            <ScrollView>
              <Row colGap={5}>
                <Col width={'50%'}>
                  <ICustomPicker
                    label="Territory Name"
                    name="territory"
                    options={territoryDDL}
                    wrapperStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 5,
                    }}
                    onChange={(item) => {
                      formikprops.setFieldValue('territory', item);
                      formikprops.setFieldValue('route', '');

                      getRouteDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        item?.value,
                        setRouteDDL,
                      );
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width={'50%'}>
                  {/* setRoute(item); */}
                  <ICustomPicker
                    label="Route Name"
                    name="route"
                    options={routeDDL}
                    wrapperStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 5,
                    }}
                    onChange={(item) => {
                      formikprops.setFieldValue('route', item);
                    }}
                    formikProps={formikprops}
                  />
                </Col>
              </Row>

              {approveItems?.length > 0 ? (
                <Row colGap={5}>
                  <Col width="50%">
                    <CustomButton
                      onPress={() => setShowModal(true)}
                      // isLoading={isLoading}
                      btnTxt="Approve"
                    />
                  </Col>
                  <Col width="50%">
                    <CustomButton
                      onPress={() => {
                        setIsRejected(true);
                        setShowModal(true);
                      }}
                      // isLoading={isLoading}
                      btnTxt="Reject"
                    />
                  </Col>
                </Row>
              ) : (
                <CustomButton
                  onPress={formikprops.handleSubmit}
                  isLoading={isLoading}
                  btnTxt="View"
                />
              )}

              <Row
                style={{
                  marginVertical: 10,
                  backgroundColor: '#ffffff',
                  padding: 7,
                  borderRadius: 5,
                }}
                colGap={5}>
                <Col width={'50%'}>
                  <Text style={{fontWeight: 'bold'}}>SL</Text>
                  <Text style={styles.customerAmount}>Outlet Name</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.completeButton, {color: '#00B44A'}]}>
                      Select
                    </Text>
                  </View>
                </Col>
                <Col
                  style={{flexDirection: 'row', justifyContent: 'flex-end'}}
                  width={'50%'}>
                  <View>
                    <Text
                      style={{
                        textAlign: 'right',
                        color: 'black',
                        fontWeight: 'bold',
                      }}>
                      Owner Name
                    </Text>
                    <Text
                      style={[
                        styles.customerAmount,
                        {
                          color: '#00B44A',
                          fontSize: 15,
                          textAlign: 'right',
                        },
                      ]}>
                      Outlet Address
                    </Text>
                    <Text style={{textAlign: 'right'}}>Outlet Type Name</Text>
                  </View>
                </Col>
              </Row>

              {landingData?.data?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate('View Outlet Profile', {
                      id: item?.outletId,
                    })
                  }>
                  <Row
                    style={{
                      marginVertical: 10,
                      backgroundColor: '#ffffff',
                      padding: 7,
                      borderRadius: 5,
                    }}
                    colGap={5}>
                    <Col width={'50%'}>
                      <Text style={{fontWeight: 'bold'}}>{index + 1}</Text>
                      <Text style={styles.customerAmount}>
                        {item?.outletName}
                      </Text>
                      <View
                        style={[
                          {
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginLeft: -10,
                          },
                        ]}>
                        <ICheckbox
                          checked={item?.isApprove}
                          onPress={(e) => {
                            rowDtoHandler('isApprove', !item?.isApprove, index);
                          }}
                        />
                        <Text style={styles.teritoryText}></Text>
                      </View>
                    </Col>
                    <Col
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}
                      width={'50%'}>
                      <View>
                        <Text
                          style={{
                            textAlign: 'right',
                            color: 'black',
                            fontWeight: 'bold',
                          }}>
                          {item?.ownerName}
                        </Text>
                        <Text
                          style={[
                            styles.customerAmount,
                            {
                              color: '#00B44A',
                              textAlign: 'right',
                              fontSize: 15,
                            },
                          ]}>
                          {item?.outletAddress}
                        </Text>
                        <Text style={{textAlign: 'right'}}>
                          {item?.outletTypeName}
                        </Text>
                      </View>
                    </Col>
                  </Row>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Modal animationType="fade" transparent visible={showModal}>
            <View style={styles.centeredView}>
              <View style={styles.modalStyle}>
                <Text style={styles.updateAvailable}>Are you sure?</Text>

                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        if (isRejected) {
                          rejectHandler(formikprops?.values);
                        } else {
                          saveHandler(formikprops?.values);
                        }
                      }}
                      style={[
                        styles.updateButtonStyle,
                        {backgroundColor: '#063197', flexDirection: 'row'},
                      ]}>
                      <Text style={{color: 'white', textAlign: 'center'}}>
                        {isRejected ? 'Reject' : 'Approve'}
                      </Text>
                      {/* <View style={{flexDirection: 'row'}}>
                            {isLoading && (
                              <Spinner
                                color="white"
                                style={{
                                  transform: [{scaleX: 0.6}, {scaleY: 0.6}],
                                }}
                              />
                            )}
                          </View> */}
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
};

export default OutletApprove;

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

  // Modal Styles Start
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
    // width: 100,
    margin: 2,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginHorizontal: 15,

    justifyContent: 'center',
    alignItems: 'center',

    marginVertical: 5,
    borderRadius: 5,
  },
});

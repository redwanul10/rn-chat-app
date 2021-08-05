/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {useFormik} from 'formik';
import {GlobalState} from '../../../../../GlobalStateProvider';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';
import Icon from 'react-native-vector-icons/AntDesign';
import {Spinner} from 'native-base';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../common/components/TextInput';
import {
  getSurveyDDL,
  getRouteDDL,
  getSurveyById,
  createSurveyAnswer,
  getSurveyAnswerById,
} from '../helper';
import {useEffect} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import CustomButton from '../../../../../common/components/CustomButton';
import {
  getBeatDDL,
  getOutletNameDDL,
} from '../../../../../common/actions/helper';
import * as Yup from 'yup';
import {Toast} from 'native-base';
import {answermaker} from './helperFunc';
import {routeSelectByDefault} from '../../../../../common/functions/routeSelectedByDefault';
import getGeoLocation from '../../../../../common/functions/getGeoLocation';
import {getII_address} from '../../../../../common/actions/helper';

const schemaValidation = Yup.object({
  route: Yup.object().shape({
    label: Yup.string().required('Route Name is required'),
    value: Yup.string().required('Route Name is required'),
  }),
  market: Yup.object().shape({
    label: Yup.string().required('Market Name is required'),
    value: Yup.string().required('Market Name is required'),
  }),
  outlet: Yup.object().shape({
    label: Yup.string().required('Outlet Name is required'),
    value: Yup.string().required('Outlet Name is required'),
  }),
  survey: Yup.object().shape({
    label: Yup.string().required('Survey Name is required'),
    value: Yup.string().required('Survey Name is required'),
  }),
});

const initValues = {
  date: _todayDate(),
  survey: '',
  route: '',
  market: '',
  outlet: '',
  personName: '',
  contactNumber: '',
};

function CreateDataCollection({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState();

  const [rowData, setRowData] = useState();
  const [matchRowData, setMatchRowData] = useState([]);

  const [surveyDDL, setSurveyDDL] = useState([]);
  const [outletDDL, setOutletDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [marketDDL, setMarketDDL] = useState([]);

  // Location State
  const [location, setLocation] = useState();
  const [IIaddress, setIIaddress] = useState('');

  // Get Ueser Location (lat,lng)
  useEffect(() => {
    getGeoLocation(setLocation);
  }, []);

  // Get redable Address from (lat,lng)
  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      getII_address(setIIaddress, location?.latitude, location?.longitude);
    }
  }, [location]);

  // Formik Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: singleData || initValues,
    validationSchema: schemaValidation,
    onSubmit: (values, actions) => {
      saveHandler(values, () => {
        actions.resetForm();
        setRowData([]);
      });
    },
  });

  // Initially DDL Load
  useEffect(() => {
    getRouteDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setRouteDDL,
    );
    getSurveyDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSurveyDDL,
    );
  }, [profileData, selectedBusinessUnit]);

  // Single Data Get By Id
  useEffect(() => {
    if (params?.id) {
      getSurveyAnswerById(params?.id, setLoading, setSingleData);
    }
  }, [params?.id]);

  // When Single Data Come match Data set in state
  useEffect(() => {
    if (singleData?.survey?.value) {
      getSurveyById(singleData?.survey?.value, null, setMatchRowData);
    }
  }, [singleData?.survey?.value]);

  // Match Functionality For View
  useEffect(() => {
    let modifyRowDataForView = [];
    singleData?.row?.forEach((item) => {
      modifyRowDataForView = answermaker(
        item?.questionId,
        item?.answerName,
        item?.answerNumber,
        matchRowData,
      );
    });
    setRowData(modifyRowDataForView);
  }, [matchRowData]);

  // Save Handler
  const saveHandler = (values, cb) => {
    if (values && rowData?.length > 0) {
      let attributeList = [];
      rowData?.forEach((item) => {
        let list = item?.objAttributes?.filter((obj) => obj?.isSelect);
        if (list?.length > 0) {
          list?.forEach((selectedOption) => {
            attributeList = [
              ...attributeList,
              {
                questionId: item?.lineRowId,
                questionName: item?.surveyLineName,
                answerName: '',
                answerDate: _todayDate(),
                answerNumber: selectedOption?.linelistId,
              },
            ];
          });
        } else {
          attributeList = [
            ...attributeList,
            {
              questionId: item?.lineRowId,
              questionName: item?.surveyLineName,
              answerName: item?.answer,
              answerDate: _todayDate(),
            },
          ];
        }
      });
      let payload = {
        objHeader: {
          outletId: values?.outlet?.value || 0,
          outletName: values?.outlet?.label || '',
          territoryId: values?.outlet?.value === 0 ? 0 : values?.route?.level,
          territoryName:
            values?.outlet?.value === 0 ? 'Random' : values?.route?.name,
          routeId: values?.route?.value || 0,
          routeName: values?.route?.label || '',
          surveyId: values?.survey?.value,
          surveyName: values?.survey?.label,
          dataCollectionDate: _todayDate(),
          actionBy: profileData?.userId,

          // Last Added
          latitude: location?.latitude?.toString() || '',
          longitude: location?.longitude?.toString() || '',
          llAddress: IIaddress,
        },
        objRow: attributeList,
      };
      createSurveyAnswer(payload, setLoading, cb);
    } else {
      Toast.show({
        text: 'No Survey Found to Answer',
        type: 'warning',
        duration: 3000,
      });
    }
  };

  // Text & Number Onchange Handler
  const answerHandler = (value, index, type) => {
    const newRowData = [...rowData];
    if (type === 'number') {
      if (+value > 0) {
        newRowData[index].answer = +value;
      } else {
        newRowData[index].answer = '';
      }
    } else {
      newRowData[index].answer = value;
    }
    setRowData(newRowData);
  };

  // Multiple Option Handler
  const multipleOptionSelectHandler = (value, mainIndex, optionIndex) => {
    const newRowData = [...rowData];
    newRowData[mainIndex].objAttributes[optionIndex].isSelect = value;
    setRowData(newRowData);
  };

  // List Option Handler
  const listSelectHandler = (value, mainIndex, optionIndex) => {
    const newRowData = [...rowData];
    const listAttr = newRowData[mainIndex]?.objAttributes.map((item) => {
      return {
        ...item,
        isSelect: false,
      };
    });
    newRowData[mainIndex].objAttributes = listAttr;
    newRowData[mainIndex].objAttributes[optionIndex].isSelect = value;
    setRowData(newRowData);
  };

  // Last Added | By Default Route Selected | login info wise (territoryInfo?.todayRouteId)
  useEffect(() => {
    routeSelectByDefault(territoryInfo, routeDDL, (selectedRoute) => {
      formikprops?.setFieldValue('route', selectedRoute);
      getBeatDDL(selectedRoute?.value, setMarketDDL);
    });
  }, [routeDDL]);

  return (
    <>
      <ScrollView>
        <CommonTopBar title={`${params?.type} Data Collection`} />
        <>
          <View style={{paddingHorizontal: 10, marginTop: 10}}>
            <ScrollView>
              <Row colGap={5}>
                <Col width="50%">
                  <ICustomPicker
                    disabled={params?.type === 'View'}
                    label="Route Name"
                    name="route"
                    options={routeDDL}
                    onChange={(valueOption) => {
                      formikprops.setFieldValue('route', valueOption);
                      getBeatDDL(valueOption?.value, setMarketDDL);
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    disabled={params?.type === 'View'}
                    label="Market Name"
                    name="market"
                    options={[
                      {
                        value: 0,
                        label: 'Random',
                      },
                      ...marketDDL,
                    ]}
                    onChange={(valueOption) => {
                      formikprops.setFieldValue('market', valueOption);
                      getOutletNameDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        formikprops?.values?.route?.value,
                        valueOption?.value,
                        setOutletDDL,
                      );
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    disabled={params?.type === 'View'}
                    label="Outlet Name"
                    name="outlet"
                    options={[
                      {
                        value: 0,
                        label: 'Random',
                      },
                      ...outletDDL,
                    ]}
                    onChange={(valueOption) => {
                      formikprops.setFieldValue('outlet', valueOption);
                    }}
                    formikProps={formikprops}
                  />
                </Col>
                <Col width="50%">
                  <ICustomPicker
                    disabled={params?.type === 'View'}
                    label="Survey Name"
                    name="survey"
                    options={surveyDDL}
                    onChange={(valueOption) => {
                      formikprops.setFieldValue('survey', valueOption);
                      setRowData([]);
                      getSurveyById(valueOption?.value, setLoading, setRowData);
                    }}
                    formikProps={formikprops}
                  />
                </Col>

                {params?.type === 'Create' ? (
                  <Col style={{marginBottom: 10}} width="100%">
                    <CustomButton
                      onPress={formikprops.handleSubmit}
                      // bgColor="#105B63"
                      // isLoading={loading}
                      btnTxt="Save"
                    />
                  </Col>
                ) : null}
              </Row>

              {loading && <Spinner color="black" />}
              <>
                {rowData?.length > 0 &&
                  rowData?.map((question, index) => (
                    <View style={styles.cardWrapper} key={index}>
                      {question?.controlType === 'Text' && (
                        <View style={styles.singleQuestionWrapper}>
                          <View>
                            <Text style={styles.questionName}>
                              {`${index + 1}. `} {question?.surveyLineName}
                            </Text>
                            <View>
                              <FormInput
                                disabled={params?.type === 'View'}
                                value={question?.answer}
                                name="answer"
                                label="Answer:"
                                onChangeText={(e) =>
                                  answerHandler(e, index, 'text')
                                }
                                formikProps={formikprops}
                              />
                            </View>
                          </View>
                        </View>
                      )}
                      {question?.controlType === 'Number' && (
                        <View style={styles.singleQuestionWrapper}>
                          <View>
                            <Text style={styles.questionName}>
                              {`${index + 1}. `}
                              {question?.surveyLineName}
                            </Text>
                            <View>
                              <FormInput
                                disabled={params?.type === 'View'}
                                value={question?.answer.toString()}
                                label="Answer:"
                                name="answer"
                                onChangeText={(e) =>
                                  answerHandler(e, index, 'number')
                                }
                                keyboardType="numeric"
                                formikProps={formikprops}
                              />
                            </View>
                          </View>
                        </View>
                      )}

                      {question?.controlType === 'Multiple Option' && (
                        <View style={styles.singleQuestionWrapper}>
                          <Row>
                            <Col width="60%">
                              <View>
                                <Text style={styles.questionName}>
                                  {`${index + 1}. `}
                                  {question?.surveyLineName}
                                </Text>
                              </View>
                            </Col>
                            <Col
                              style={styles.questionTypeWithIconWrapper}
                              width="40%">
                              <View style={styles.questionTypeWithIcon}>
                                <Text style={{marginRight: 5}}>
                                  {question?.controlType}
                                </Text>
                                <Icon
                                  name="checkcircle"
                                  color="black"
                                  size={12}
                                />
                              </View>
                            </Col>
                          </Row>
                          <View style={styles.optionWrapper}>
                            {question?.objAttributes?.length > 0 &&
                              question?.objAttributes?.map((option, idx) => (
                                <TouchableWithoutFeedback
                                  key={idx}
                                  onPress={() => {
                                    if (params?.type === 'Create') {
                                      if (option?.isSelect) {
                                        multipleOptionSelectHandler(
                                          false,
                                          index,
                                          idx,
                                        );
                                      } else {
                                        multipleOptionSelectHandler(
                                          true,
                                          index,
                                          idx,
                                        );
                                      }
                                    }
                                  }}>
                                  <View
                                    style={styles.singleOption(
                                      option?.isSelect,
                                    )}>
                                    {option?.isSelect && (
                                      <Icon
                                        name="checkcircle"
                                        color="black"
                                        size={14}
                                      />
                                    )}
                                    <Text style={styles.singleOptionText}>
                                      {option?.questionAttribute}
                                    </Text>
                                  </View>
                                </TouchableWithoutFeedback>
                              ))}
                          </View>
                        </View>
                      )}

                      {question?.controlType === 'List' && (
                        <View style={styles.singleQuestionWrapper}>
                          <Row>
                            <Col width="60%">
                              <View>
                                <Text style={styles.questionName}>
                                  {`${index + 1}. `}
                                  {question?.surveyLineName}
                                </Text>
                              </View>
                            </Col>
                            <Col
                              style={styles.questionTypeWithIconWrapper}
                              width="40%">
                              <View style={styles.questionTypeWithIcon}>
                                <Text style={{marginRight: 5}}>
                                  {question?.controlType}
                                </Text>
                                <Icon
                                  name="checksquare"
                                  color="black"
                                  size={12}
                                />
                              </View>
                            </Col>
                          </Row>
                          <View style={styles.optionWrapper}>
                            {question?.objAttributes?.length > 0 &&
                              question?.objAttributes?.map((option, idx) => (
                                <TouchableWithoutFeedback
                                  key={idx}
                                  onPress={() => {
                                    if (params?.type === 'Create') {
                                      if (option?.isSelect) {
                                        listSelectHandler(false, index, idx);
                                      } else {
                                        listSelectHandler(true, index, idx);
                                      }
                                    }
                                  }}>
                                  <View
                                    style={styles.singleOption(
                                      option?.isSelect,
                                    )}>
                                    {option?.isSelect && (
                                      <Icon
                                        name="checksquare"
                                        color="black"
                                        size={14}
                                      />
                                    )}
                                    <Text style={styles.singleOptionText}>
                                      {option?.questionAttribute}
                                    </Text>
                                  </View>
                                </TouchableWithoutFeedback>
                              ))}
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
              </>
            </ScrollView>
          </View>
        </>
      </ScrollView>
    </>
  );
}

export default CreateDataCollection;

const styles = StyleSheet.create({
  cardWrapper: {
    // backgroundColor: '#ffffff',
    width: '100%',
  },
  singleQuestionWrapper: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 13,
  },
  questionName: {
    fontSize: 16,
  },
  questionTypeWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionTypeWithIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  optionWrapper: {
    backgroundColor: 'rgb(243, 244, 246)',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
  },
  singleOption: (isSelect) => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isSelect ? '#34d399' : 'white',
      marginVertical: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 3,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,

      elevation: 4,
    };
  },
  singleOptionText: {
    fontSize: 16,
    marginLeft: 5,
  },
});

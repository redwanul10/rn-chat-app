import React, {useEffect, useState, useContext} from 'react';
import {ScrollView, StyleSheet, View, Text, Image, Platform} from 'react-native';
import {Toast} from 'native-base';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import {Formik} from 'formik';
import {GlobalState} from '../../../../../GlobalStateProvider';
import {getOutletReasonDDL_api, createOutletReason} from './helper';

import {_todayDate} from '../../../../../common/functions/_todayDate';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import CustomButton from '../../../../../common/components/CustomButton';
import {launchCamera} from 'react-native-image-picker';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import axios from 'axios';

const NoOrderForm = ({navigation, route: {params}}) => {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [isLoading, setIsLoading] = useState(false);

  //   DDL State
  const [reasonDDL, setReasonDDL] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    getOutletReasonDDL_api(profileData?.accountId, setReasonDDL);
  }, []);

  const uploadCapturedImage = (cb) => {
    if (!selectedFile?.base64) return;

    const imagePayload = [
      {
        data: selectedFile?.base64,
        fileName: selectedFile?.fileName,
      },
    ];

    axios
      .post('/domain/Document/UploadFileBaseSixtyFour', imagePayload)
      .then((res) => {
        cb(res?.data[0]?.id);
      })
      .catch((err) => {
        Toast.show({
          text: 'Image not Uploaded',
          type: 'danger',
          duration: 3000,
        });
      });
  };

  const saveHandler = (values) => {
    if (!values?.reason) {
      Toast.show({
        text: 'Reason is Required',
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    if (
      (values?.reason?.isImgMandatory && !selectedFile) ||
      (params?.outlet?.cooler && !selectedFile)
    ) {
      Toast.show({
        text: 'Reason Image is Required',
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    let payload = {
      id: 0,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      territoryId: values?.territory?.value,
      routeId: values?.route?.value,
      marketId: values?.beat?.value,
      outletId: values?.outlet?.value,
      notOrderingReasonId: values?.reason?.value,
      notOrderingReason: values?.reason?.label,
      latitude: params?.location?.latitude?.toString() || '',
      longitude: params?.location?.longitude?.toString() || '',
      lladdress: params?.IIaddress,
      imgId: '',
      recordDate: _todayDate(),
      intActionBy: profileData?.userId,
    };

    if (values?.reason?.isImgMandatory && selectedFile) {
      uploadCapturedImage((imgId) => {
        payload = {
          ...payload,
          imgId,
        };

        createOutletReason(payload, setIsLoading, () => {
          navigation?.goBack();
        });
      });
    } else {
      createOutletReason(payload, setIsLoading, () => {
        navigation?.goBack();
      });
    }
  };

  const captureImageForIos = async () => {
    try {

      // Check Permission Already Granted or Not
      let granted = await check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );

      // If Not Granted Then Request for Location permission
      if (granted !== RESULTS.GRANTED) {
        granted = await request(
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
      }

      if (granted === RESULTS.GRANTED) {
        launchCamera(
          {
            includeBase64: true,
            saveToPhotos: false,
            maxWidth: 300,
            maxHeight: 300,
            quality: 0.5,
          },
          (res) => {
            console.log(res);
            if (res?.assets) {
              setSelectedFile(res?.assets[0]);
            }
          },
        );
      }
    } catch (error) {}
  };

  return (
    <>
      <CommonTopBar />
      <ScrollView showsVerticalScrollIndicator={false} style={style.container}>
        <Formik
          enableReinitialize={true}
          initialValues={{...params}}
          onSubmit={(values, actions) => {
            saveHandler(values, () => {
              actions.resetForm();
            });
          }}>
          {(formikprops) => (
            <View style={{paddingBottom: 20}}>
              <Row colGap={2}>
                <Col width="100%" style={{marginBottom: 10}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>
                    Cooler :
                    {params?.outlet?.cooler ? ' Available' : ' Not Available'}
                  </Text>
                </Col>

                <Col width="100%">
                  <ICustomPicker
                    label="Reason"
                    name="reason"
                    options={reasonDDL}
                    formikProps={formikprops}
                    onChange={(selectedOption) => {
                      formikprops.setFieldValue('reason', selectedOption);
                      setSelectedFile(null);
                    }}
                  />
                </Col>
              </Row>
              {(params?.outlet?.cooler ||
                formikprops?.values?.reason?.isImgMandatory) && (
                <>
                  <CustomButton
                    onPress={() => {

                      if (Platform.OS === 'ios') {
                        captureImageForIos()
                        return;
                      }

                      launchCamera(
                        {
                          includeBase64: true,
                          saveToPhotos: false,
                          maxWidth: 300,
                          maxHeight: 300,
                          quality: 0.5,
                        },
                        (res) => {
                          if (res?.assets) {
                            setSelectedFile(res?.assets[0]);
                          }
                        },
                      );
                    }}
                    btnTxt="Take Picture"
                    icon="camera"
                  />
                </>
              )}
              
              <CustomButton
                onPress={formikprops.handleSubmit}
                isLoading={isLoading}
                btnTxt="Save"
              />
              <Image
                style={{width: 100, height: 100}}
                source={{
                  uri: selectedFile?.uri,
                }}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </>
  );
};

export default NoOrderForm;

const style = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  greyColor: {
    color: '#989898',
  },
  btnText: {
    textTransform: 'uppercase',
    color: 'white',
  },
  spinner: {
    transform: [{scaleX: 0.6}, {scaleY: 0.6}],
  },
  time: {
    alignItems: 'flex-end',
    width: '100%',
    padding: 5,
    backgroundColor: '#FAFAFA',
    marginBottom: 5,
  },
  inputStyle: {
    borderWidth: 0,
    borderBottomWidth: 1,
    marginTop: 0,
    backgroundColor: 'transparent',
  },
  mediumSpinner: {
    marginTop: -10,
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
  },
  spinnerText: {justifyContent: 'center', alignItems: 'center'},
});

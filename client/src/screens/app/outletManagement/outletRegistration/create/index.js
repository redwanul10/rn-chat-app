/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {View, ScrollView, StyleSheet, Text, Image} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import * as Yup from 'yup';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../common/components/TextInput';

import {getOutletTypeInfoDDL, createOutletProfile, getBeatDDL} from './helper';

import {GlobalState} from '../../../../../GlobalStateProvider';
import CustomButton from '../../../../../common/components/CustomButton';
import getGeoLocation from '../../../../../common/functions/getGeoLocation';
import ICheckbox from '../../../../../common/components/ICheckbox';
import FilePicker from '../../../../../common/components/FilePicker';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import {singleAttachmentAction} from '../../../../../common/actions/helper';
import {launchCamera} from 'react-native-image-picker';
import axios from 'axios';

const title = 'Outlet Registration';

const schemaValidation = Yup.object({
  beat: Yup.object().shape({
    label: Yup.string().required('Market name is required'),
    value: Yup.string().required('Market name is required'),
  }),
  outlet_name: Yup.string()
    .min(4, 'Must be 4 character')
    .required('This field is required'),

  owner_name: Yup.string()
    .min(4, 'Must be 4 character')
    .required('This field is required'),
  outlet_address: Yup.string()
    .min(4, 'Must be 4 character')
    .required('This field is required'),
  mobile: Yup.number().required('Mobile number is required'),
  // Outlet Type Validation Added | Assign By HM Ikbal
  outlet: Yup.object().shape({
    label: Yup.string().required('Outlet Type is required'),
    value: Yup.string().required('Outlet Type is required'),
  }),
});

function OutletAdd({route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [loading, setLoading] = useState(false);
  const [outletTypeDDL, setOutletTypeInfoDDL] = useState([]);
  const [location, setLocation] = useState('');
  const [companyDDL, setCompanyDDL] = useState([]);
  const [beatDDL, setBeatDDL] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const initValues = {
    outlet_name: '',
    owner_name: '',
    outlet_address: '',
    route: params?.routeName,
    beat: params?.beatName,
    email: '',
    mobile: '',
    lattitude: '',
    longitude: '',
    isColler: false,
    isHvo: false,
    collerCompany: '',
    outlet: '',
    outletBanglaName: '',
  };

  useEffect(() => {
    getOutletTypeInfoDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setOutletTypeInfoDDL,
    );
    getBeatDDL(params?.routeName?.value, setBeatDDL);
  }, [profileData, selectedBusinessUnit]);

  // Get Location Lattitude Longitue
  useEffect(() => {
    setLocation(getGeoLocation(setLocation));
    setCompanyDDL([
      {value: 1, label: 'AFBL'},
      {value: 2, label: 'PEPSI'},
      {value: 3, label: 'COCA-COLA'},
      {value: 4, label: 'OTHERS'},
    ]);
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

  const saveHandler = (values, cb) => {
    let payload = {
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      routeId: values?.route?.value,
      routeName: values?.route?.label,
      outletName: values?.outlet_name,
      outletBanglaName: values?.outletBanglaName,
      ownerName: values?.owner_name,
      beatId: values?.beat?.value,
      beatName: values?.beat?.label,
      lattitude: values?.lattitude,
      longitude: values?.longitude,
      actionBy: profileData?.userId,
      mobileNumber: values?.mobile,
      isProfileComplete: true,
      isHvo: values?.isHvo,
      businessType: values?.outlet?.value,
      outletAddress: values.outlet_address,
      cooler: values?.isColler,
      coolerCompanyId: values?.collerCompany ? values?.collerCompany?.value : 0,
      coolerCompanyName: values?.collerCompany
        ? values?.collerCompany?.label
        : ' ',
      outletImage: '',
    };
    // console.log(JSON.stringify(payload,null,2))
    // try {
    //   if (values?.attachment?.uri) {
    //     // AttachmentLink Add | Single
    //     singleAttachmentAction(values?.attachment).then((data) => {
    //       // Upload Image Link
    //       const modifyPayload = {
    //         ...payload,
    //         outletImage: data[0]?.id || '',
    //       };
    //       // createOutletBillRequest(modifyPayload, setLoading);
    //       createOutletProfile(modifyPayload, setLoading, cb);
    //     });
    //   } else {
    //     // Payload Without Attachment
    //     createOutletProfile(payload, setLoading, cb);
    //   }
    // } catch (error) {}

    const customCB = () => {
      setSelectedFile(null), cb();
    };

    if (selectedFile) {
      uploadCapturedImage((imgId) => {
        payload = {
          ...payload,
          outletImage: imgId,
        };

        // createOutletReason(payload, setIsLoading, () => {
        //   navigation?.goBack();
        // });
        // console.log('pa', JSON.stringify(payload, null, 2));
        createOutletProfile(payload, setLoading, customCB);
      });
    } else {
      createOutletProfile(payload, setLoading, cb);
    }
  };

  return (
    <ScrollView>
      <CommonTopBar title={title} />
      <View style={{marginHorizontal: 10, marginTop: 10}}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initValues,
            lattitude: location?.latitude?.toString() || '',
            longitude: location?.longitude?.toString() || '',
          }}
          validationSchema={schemaValidation}
          onSubmit={(values, actions) => {
            saveHandler(values, () => {
              actions.resetForm();
            });
          }}>
          {(formikprops) => (
            <View>
              <ICustomPicker
                label="Route Name"
                name="route"
                disabled={true}
                formikProps={formikprops}
              />

              <ICustomPicker
                label="Market Name"
                name="beat"
                options={beatDDL}
                formikProps={formikprops}
              />

              <FormInput
                name="outlet_name"
                label="Outlet Name"
                placeholder="Enter outlet name"
                inputStyle={{
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  marginTop: 0,
                }}
                formikProps={formikprops}
              />

              <FormInput
                name="outletBanglaName"
                label="Outlet Bangle Name"
                placeholder="Enter Outlet Bangle Name"
                inputStyle={{
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  marginTop: 0,
                }}
                formikProps={formikprops}
              />

              <ICustomPicker
                label="Outlet Type"
                name="outlet"
                options={outletTypeDDL}
                formikProps={formikprops}
              />

              <FormInput
                name="outlet_address"
                label="Outlet Address"
                placeholder="Enter outlet address"
                inputStyle={{
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  marginTop: 0,
                }}
                formikProps={formikprops}
              />

              <FormInput
                name="owner_name"
                label="Owner Name"
                placeholder="Enter name"
                inputStyle={{
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  marginTop: 0,
                }}
                formikProps={formikprops}
              />

              <FormInput
                name="mobile"
                label="Mobile No"
                keyboardType="numeric"
                placeholder="Enter mobile number"
                inputStyle={{
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  marginTop: 0,
                }}
                formikProps={formikprops}
              />

              <FormInput
                name="lattitude"
                label="Lattitude"
                editable={false}
                formikProps={formikprops}
              />

              <FormInput
                name="longitude"
                label="Longitude"
                editable={false}
                formikProps={formikprops}
              />

              <View
                style={[
                  styles.cardStyle,
                  {
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginVertical: 10,
                  },
                ]}>
                <ICheckbox
                  checked={formikprops?.values?.isColler}
                  onPress={(e) => {
                    formikprops?.setFieldValue(
                      'isColler',
                      !formikprops?.values?.isColler,
                    );
                  }}
                />

                <Text style={styles.teritoryText}>Is Coller</Text>
              </View>

              <View
                style={[
                  styles.cardStyle,
                  {
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginVertical: 10,
                  },
                ]}>
                <ICheckbox
                  checked={formikprops?.values?.isHvo}
                  onPress={(e) => {
                    formikprops?.setFieldValue(
                      'isHvo',
                      !formikprops?.values?.isHvo,
                    );
                  }}
                />
                <Text style={styles.teritoryText}>Is HVO</Text>
              </View>

              {formikprops?.values?.isColler && (
                <ICustomPicker
                  label="Coller Company"
                  name="collerCompany"
                  options={companyDDL}
                  formikProps={formikprops}
                />
              )}
              <CustomButton
                onPress={() => {
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
              {selectedFile && (
                <Image
                  style={{width: 100, height: 100}}
                  source={{
                    uri: selectedFile?.uri,
                  }}
                />
              )}

              <CustomButton
                isLoading={loading}
                onPress={formikprops.handleSubmit}
                btnTxt="Register"
              />
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

export default OutletAdd;

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#AEAEAE',
    height: 1.5,
  },
  textError: {
    color: 'red',
  },
});

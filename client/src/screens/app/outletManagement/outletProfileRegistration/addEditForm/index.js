/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import * as Yup from 'yup';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../common/components/TextInput';

import {
  getFinishedItemsDDL,
  getOutletTypeInfoDDL,
  createOutletProfile,
  getBeatDDL,
  getThanaDDL,
  getOutletProfileById,
  editOutletProfile,
} from './helper';

import {GlobalState} from '../../../../../GlobalStateProvider';
import CustomButton from '../../../../../common/components/CustomButton';
import getGeoLocation from '../../../../../common/functions/getGeoLocation';
import ICheckbox from '../../../../../common/components/ICheckbox';
import FilePicker from '../../../../../common/components/FilePicker';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import {
  getII_address,
  singleAttachmentAction,
} from '../../../../../common/actions/helper';
import {launchCamera} from 'react-native-image-picker';
import axios from 'axios';
import IDatePicker from '../../../../../common/components/IDatePicker';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import ImageViewer from '../../../../../common/components/ImageViewer';
import ICustomDatePicker from '../../../../../common/components/IcustomDatePicker';

const title = 'Outlet Registration';

const schemaValidation = Yup.object({
  outletBanglaName: Yup.string().required('This field is required'),
  outletName: Yup.string().required('This field is required'),
  mobile: Yup.string()
    .max(11, 'Invalid mobile number')
    .min(11, 'Invalid mobile number')
    .required('This field is required'),
  thana: Yup.object().shape({
    label: Yup.string().required('Thana is required'),
    value: Yup.string().required('Thana is required'),
  }),
});

function OutletAdd({route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [loading, setLoading] = useState(false);
  const [outletTypeDDL, setOutletTypeInfoDDL] = useState([]);
  const [location, setLocation] = useState('');
  const [IIaddress, setIIaddress] = useState('');
  const [companyDDL, setCompanyDDL] = useState([]);
  const [thanaDDL, setThanaDDL] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [finishItemDDL, setFinishItemDDL] = useState([]);
  const [accordion, setAccordion] = useState('');
  const [singleData, setSingleData] = useState({});

  const initValues = {
    outletName: '',
    outletBanglaName: '',
    outletType: '',
    outletAddress: '',
    thana: '',
    lattitude: '',
    longitude: '',
    tradeLicenseNo: '',
    maxSalesItem: '',
    avarageAmount: '',
    collerCompany: '',
    ownerName: '',
    mobile: '',
    dateOfBirth: '',
    contactType: '',
    email: '',
    marriageStatus: '',
    marriageDate: '',
    ownerId: '',
  };

  useEffect(() => {
    getFinishedItemsDDL(profileData?.accountId, setFinishItemDDL);

    getOutletTypeInfoDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setOutletTypeInfoDDL,
    );

    getThanaDDL(setThanaDDL);
  }, [profileData, selectedBusinessUnit]);

  // Get redable Address from (lat,lng)
  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      getII_address(setIIaddress, location?.latitude, location?.longitude);
    }
  }, [location]);

  // Get Location Lattitude Longitue
  useEffect(() => {
    if (!params?.id) {
      setLocation(getGeoLocation(setLocation));
    }

    setCompanyDDL([
      {value: 1, label: 'AFBL'},
      {value: 2, label: 'PEPSI'},
      {value: 3, label: 'COCA-COLA'},
      {value: 4, label: 'OTHERS'},
    ]);
  }, []);

  useEffect(() => {
    if (params?.id) {
      getOutletProfileById(params?.id, setSingleData);
    }
  }, [params?.id]);

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
    if (params?.id) {
      let payload = {
        outletId: +params?.id,
        thanaId: values?.thana?.value || 0,
        thanaName: values?.thana?.label || '',
        // outletName: values?.outletName,
        outletBanglaName: values?.outletBanglaName,
        ownerName: values?.ownerName,
        mobileNumber: values?.mobile,

        businessType: values?.outletType?.value || 0,
        // outletAddress: values.outletAddress,
        dateOfBirth: values?.dateOfBirth || '',
        maritatualStatusId: values?.marriageStatus?.value || 0,
        maritatualStatus: values?.marriageStatus?.label || '',
        marriageDate: values?.marriageDate
          ? _dateFormatter(values?.marriageDate)
          : '',
        emailAddress: values?.email,
        // latitude: location?.latitude?.toString(),
        // longitude: location?.longitude?.toString(),
        // longLatAddress: IIaddress,
        outletImagePath: '',
        tradeLicenseNo: values?.tradeLicenseNo || '',
        ownerNidno: values?.ownerId,
        contactType: values?.contactType || '',
        monthlyAvgSales: 0,
        lastSalesAmount: 0,
        lastSalesDateTime: _todayDate(),
        currentSalesAmount: 0,
        currentSalesDateTime: _todayDate(),
        maxSalesItem: values?.maxSalesItem?.value,
        maxSalesItemName: values?.maxSalesItem?.label,
        isProfileComplete: true,
        isCooler: values?.isColler,
        coolerCompanyId: values?.collerCompany?.value || 0,
        coolerCompanyName: values?.collerCompany?.label || '',
        isHvo: values?.isHvo,
      };

      const customCB = () => {
        setSelectedFile(null), cb();
      };

      if (selectedFile) {
        uploadCapturedImage((imgId) => {
          payload = {
            ...payload,
            outletImagePath: imgId,
          };
          editOutletProfile(payload, setLoading, customCB);
        });
      } else {
        editOutletProfile(payload, setLoading, cb);
      }
    } else {
      let payload = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        thanaId: values?.thana?.value || 0,
        thanaName: values?.thana?.label || '',
        outletName: values?.outletName,
        outletBanglaName: values?.outletBanglaName,
        ownerName: values?.ownerName,
        mobileNumber: values?.mobile,

        businessType: values?.outletType?.value || 0,
        outletAddress: values.outletAddress,
        dateOfBirth: values?.dateOfBirth || '',
        maritatualStatusId: values?.marriageStatus?.value || 0,
        maritatualStatus: values?.marriageStatus?.label || '',
        marriageDate: values?.marriageDate
          ? _dateFormatter(values?.marriageDate)
          : '',
        emailAddress: values?.email,
        latitude: location?.latitude?.toString(),
        longitude: location?.longitude?.toString(),
        longLatAddress: IIaddress,
        outletImagePath: '',
        tradeLicenseNo: values?.tradeLicenseNo || '',
        ownerNidno: values?.ownerId,
        contactType: values?.contactType || '',
        monthlyAvgSales: 0,
        lastSalesAmount: 0,
        lastSalesDateTime: _todayDate(),
        currentSalesAmount: 0,
        currentSalesDateTime: _todayDate(),
        maxSalesItem: values?.maxSalesItem?.value,
        maxSalesItemName: values?.maxSalesItem?.label,
        isProfileComplete: true,
        isCooler: values?.isColler,
        coolerCompanyId: values?.collerCompany?.value || 0,
        coolerCompanyName: values?.collerCompany?.label || '',
        isHvo: values?.isHvo,
        actionBy: profileData?.userId,
        dteLastActionDateTime: _todayDate(),
      };

      const customCB = () => {
        setSelectedFile(null), cb();
      };

      if (selectedFile) {
        uploadCapturedImage((imgId) => {
          payload = {
            ...payload,
            outletImagePath: imgId,
          };
          createOutletProfile(payload, setLoading, customCB);
        });
      } else {
        createOutletProfile(payload, setLoading, cb);
      }
    }
  };

  return (
    <>
      <CommonTopBar
        title={
          !params?.id
            ? 'Outlet Profile Registration'
            : 'Edit Outlet Profile Registration'
        }
      />
      <ScrollView style={styles.container}>
        <View style={[{marginHorizontal: 10, marginTop: 10}]}>
          <Formik
            enableReinitialize={true}
            initialValues={
              params?.id
                ? {...singleData}
                : {
                    ...initValues,
                    lattitude: location?.latitude?.toString() || '',
                    longitude: location?.longitude?.toString() || '',
                  }
            }
            validationSchema={schemaValidation}
            onSubmit={(values, actions) => {
              saveHandler(values, () => {
                actions.resetForm();
              });
            }}>
            {(formikprops) => (
              <>
                {/* // Outlet Information Start */}
                <View>
                  <TouchableOpacity onPress={() => setAccordion('outletInfo')}>
                    <Text style={styles.sectionHeading}>
                      Outlet Information
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={[
                      // accordion === 'outletInfo' ? {} : {display: 'none'},
                      styles.sectionContainer,
                    ]}>
                    <FormInput
                      name="outletName"
                      label="Outlet Name"
                      placeholder="Enter outlet name"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                    />

                    <FormInput
                      name="outletBanglaName"
                      label="Outlet Bangle Name"
                      placeholder="Enter Outlet Bangle Name"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                    />

                    <ICustomPicker
                      label="Outlet Type"
                      name="outletType"
                      options={outletTypeDDL}
                      formikProps={formikprops}
                    />

                    <FormInput
                      name="outletAddress"
                      label="Outlet Address"
                      placeholder="Enter outlet address"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                    />

                    <ICustomPicker
                      label="Thana"
                      name="thana"
                      options={thanaDDL}
                      formikProps={formikprops}
                      onChange={(item) => {
                        formikprops.setFieldValue('thana', item);
                      }}
                    />

                    <FormInput
                      name="lattitude"
                      label="Lattitude"
                      disabled={true}
                      formikProps={formikprops}
                    />

                    <FormInput
                      name="longitude"
                      label="Longitude"
                      disabled={true}
                      formikProps={formikprops}
                    />

                    <FormInput
                      label="Trade License No"
                      name="tradeLicenseNo"
                      placeholder="Enter Trade License No"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                    />
                    <ICustomPicker
                      label="Max Sales Item"
                      name="maxSalesItem"
                      options={finishItemDDL}
                      formikProps={formikprops}
                    />
                    <FormInput
                      name="avarageAmount"
                      label="Avarage Amount"
                      placeholder="Enter Avarage Amount"
                      keyboardType="numeric"
                      inputStyle={styles.inputStyle}
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
                  </View>
                </View>
                {/* // Outlet Information End */}

                {/* Owner Information Start*/}

                <View>
                  {/* <Text style={styles.sectionHeading}>Owner Information</Text> */}
                  <TouchableOpacity onPress={() => setAccordion('OwnerInfo')}>
                    <Text style={styles.sectionHeading}>Owner Information</Text>
                  </TouchableOpacity>

                  <View
                    style={[
                      // accordion === 'OwnerInfo' ? {} : {display: 'none'},
                      styles.sectionContainer,
                    ]}>
                    <FormInput
                      name="ownerName"
                      label="Owner Name"
                      placeholder="Enter name"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                    />

                    <FormInput
                      name="mobile"
                      label="Mobile No"
                      keyboardType="numeric"
                      placeholder="Enter mobile number"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                    />

                    {/* <IDatePicker
                      label="Date of Birth"
                      name="dateOfBirth"
                      formikProps={formikprops}
                    /> */}

                    <ICustomDatePicker
                    label="Date of Birth"
                      name="dateOfBirth"
                      value={formikprops?.values?.dateOfBirth}
                      formikprops={formikprops}
                    />

                    <FormInput
                      name="contactType"
                      label="Contact Type"
                      placeholder="Contact Type"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                    />

                    <FormInput
                      name="email"
                      label="Email Address"
                      placeholder="Email Address"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                    />

                    <ICustomPicker
                      label="Marriage Status"
                      name="marriageStatus"
                      options={[
                        {label: 'Married', value: 1},
                        {label: 'Unmarried', value: 2},
                      ]}
                      formikProps={formikprops}
                    />

                    {formikprops?.values?.marriageStatus?.label ===
                    'Married' ? (
                      <IDatePicker
                        label="Marriage Date"
                        name="marriageDate"
                        formikProps={formikprops}
                      />
                    ) : null}

                    <FormInput
                      name="ownerId"
                      label="Owner NID"
                      placeholder="Owner NID"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                    />
                  </View>
                </View>
                {/* Owner Information End*/}

                {!selectedFile && (
                  <ImageViewer image={formikprops?.values?.outletImagePath} />
                )}

                {selectedFile && (
                  <Image
                    style={{width: 50, height: 50}}
                    source={{
                      uri: selectedFile?.uri,
                    }}
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

                <CustomButton
                  isLoading={loading}
                  onPress={formikprops.handleSubmit}
                  btnTxt={params?.id ? 'Update' : 'Register'}
                />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
  );
}

export default OutletAdd;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  divider: {
    backgroundColor: '#AEAEAE',
    height: 1.5,
  },
  textError: {
    color: 'red',
  },
  inputStyle: {
    borderWidth: 0,
    borderBottomWidth: 1,
    // marginTop: 0,
  },
  sectionContainer: {
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: '#F4F6FC',
  },
  sectionHeading: {
    marginVertical: 10,
    fontSize: 20,
    textAlign: 'center',
  },
});

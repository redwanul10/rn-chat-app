/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import CommonTopBar from '../../../../../../common/components/CommonTopBar';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import ICustomPicker from '../../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../../common/components/TextInput';
import {getFinishedItemsDDL} from '../helper';
import {getBeatDDL} from '../../../../../../common/actions/helper';
import getGeoLocation from '../../../../../../common/functions/getGeoLocation';

import {GlobalState} from '../../../../../../GlobalStateProvider';
import ICheckbox from '../../../../../../common/components/ICheckbox';
import CustomButton from '../../../../../../common/components/CustomButton';
import {launchCamera} from 'react-native-image-picker';
import ImageViewer from '../../../../../../common/components/ImageViewer';

const title = 'Outlet Information';

const initValues = {
  routeName: '',
  marketName: '',
  outletName: '',
  marketName: '',
  outletType: '',
  outletAddress: '',
  ownerName: '',
  ownerNumber: '',
  lattitude: '',
  longitude: '',
  maxSalesItem: '',
  avarageAmount: '',
  isUpdateLocation: false,
};

const schemaValidation = Yup.object({
  ownerName: Yup.string()
    .min(4, 'Must be 4 character')
    .required('This field is required'),
  outletAddress: Yup.string()
    .min(4, 'Must be 4 character')
    .required('This field is required'),
  ownerNumber: Yup.number().required('Mobile number is required'),
});

function OutletInfo({route: {params}, navigation}) {
  const {profileData} = useContext(GlobalState);
  const [finishItemDDL, setFinishItemDDL] = useState([]);
  const [companyDDL, setCompanyDDL] = useState([]);
  const [beatDDL, setBeatDDL] = useState([]);
  const [location, setLocation] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: params?.outletInfo || initValues,
    validationSchema: schemaValidation,
    onSubmit: (values, actions) => {
      params?.onUpdateHandler({outletInfo: {...values, selectedFile}});
      navigation?.goBack();
    },
  });

  useEffect(() => {
    getFinishedItemsDDL(profileData?.accountId, setFinishItemDDL);
    getBeatDDL(params?.outletInfo?.routeName?.value, setBeatDDL);
  }, []);

  useEffect(() => {
    setCompanyDDL([
      {value: 1, label: 'AFBL'},
      {value: 2, label: 'PEPSI'},
      {value: 3, label: 'COCA-COLA'},
      {value: 4, label: 'OTHERS'},
    ]);
  }, []);

  // New Location Update
  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      formikprops?.setFieldValue('lattitude', location?.latitude?.toString());
      formikprops?.setFieldValue('longitude', location?.longitude?.toString());
    }
  }, [location]);

  // Old Location Update When Uncheck
  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      formikprops?.setFieldValue('lattitude', params?.outletInfo?.lattitude);
      formikprops?.setFieldValue('longitude', params?.outletInfo?.longitude);
    }
  }, [formikprops?.values?.isUpdateLocation]);

  return (
    <ScrollView>
      <CommonTopBar title={title} />
      {/* <Text>{JSON.stringify(params, null, 2)}</Text> */}
      <View style={{marginHorizontal: 10, marginTop: 20}}>
        <>
          <FormInput
            name="outletName"
            label="Outlet Name"
            placeholder="Enter Outlet Name"
            inputStyle={style.inputStyle}
            formikProps={formikprops}
            // disabled={true}
          />

          <FormInput
            name="outletBanglaName"
            label="Outlet Bangla Name"
            placeholder="Enter Outlet Bangla Name"
            inputStyle={style.inputStyle}
            formikProps={formikprops}
          />
          <ICustomPicker
            label="Market Name"
            name="marketName"
            options={beatDDL}
            formikProps={formikprops}
          />

          <ICustomPicker
            label="Outlet Type"
            name="outletType"
            formikProps={formikprops}
            disabled={true}
          />

          <FormInput
            name="outletAddress"
            label="Outlet Address"
            placeholder="Enter Outlet Address"
            inputStyle={style.inputStyle}
            formikProps={formikprops}
          />

          <FormInput
            name="ownerName"
            label="Owner Name"
            placeholder="Enter Owner Name"
            inputStyle={style.inputStyle}
            formikProps={formikprops}
          />

          <FormInput
            name="ownerNumber"
            label="Owner Number"
            placeholder="Enter Owner Number"
            inputStyle={style.inputStyle}
            formikProps={formikprops}
          />

          <FormInput
            name="lattitude"
            label="Lattidute"
            placeholder="Enter Lattidute"
            inputStyle={style.inputStyle}
            formikProps={formikprops}
            disabled={true}
          />

          <FormInput
            name="longitude"
            label="Longitude"
            placeholder="Enter Longitude"
            inputStyle={style.inputStyle}
            formikProps={formikprops}
            disabled={true}
          />

          <FormInput
            label="Trade License No"
            name="tradeLicenseNo"
            placeholder="Enter Trade License No"
            inputStyle={style.inputStyle}
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
            inputStyle={style.inputStyle}
            formikProps={formikprops}
          />
          <View
            style={[
              style.cardStyle,
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
            <Text>Is Coller</Text>
          </View>

          <View
            style={[
              style.cardStyle,
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
            <Text>Is HVO</Text>
          </View>
          {/* Last Added | Assign By HM Ikbal */}
          <View
            style={[
              style.cardStyle,
              {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginVertical: 10,
              },
            ]}>
            <ICheckbox
              checked={formikprops?.values?.isUpdateLocation}
              onPress={(e) => {
                formikprops?.setFieldValue(
                  'isUpdateLocation',
                  !formikprops?.values?.isUpdateLocation,
                );
                if (!formikprops?.values?.isUpdateLocation) {
                  getGeoLocation(setLocation);
                }
              }}
            />
            <Text>Is Update Location?</Text>
          </View>

          {formikprops?.values?.isColler && (
            <ICustomPicker
              label="Coller Company"
              name="collerCompany"
              options={companyDDL}
              formikProps={formikprops}
            />
          )}
          {/* <Text>
            {JSON.stringify(formikprops?.values?.outletImagePath, null, 2)}
          </Text> */}

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
          <CustomButton onPress={formikprops.handleSubmit} btnTxt="Done" />
        </>
      </View>
    </ScrollView>
  );
}

export default OutletInfo;

const style = StyleSheet.create({
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
    marginTop: 0,
  },
});

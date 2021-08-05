import React, {useEffect, useState, useContext} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {GlobalState} from '../../../../../GlobalStateProvider';
import {Formik} from 'formik';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import CustomButton from '../../../../../common/components/CustomButton';
import {
  getSingleData,
  approveOutletRegistration,
  getFileListDDL,
} from '../helper';
import {
  getRouteDDL,
  getTerritoryDDL,
  getBeatDDL,
} from '../../../../../common/actions/helper';
import ICheckbox from '../../../../../common/components/ICheckbox';
import * as Yup from 'yup';
import FormInput from '../../../../../common/components/TextInput';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import ImageViewer from '../../../../../common/components/ImageViewer';
import MiniButton from '../../../../../common/components/MiniButton';

const schemaValidation = Yup.object({
  territory: Yup.object().shape({
    label: Yup.string().required('Territory Name is required'),
    value: Yup.string().required('Territory Name is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('Route Name is required'),
    value: Yup.string().required('Route Name is required'),
  }),
  beat: Yup.object().shape({
    label: Yup.string().required('Market Name is required'),
    value: Yup.string().required('Market Name is required'),
  }),
});

const initValues = {
  territory: '',
  route: '',
  beat: '',
};

const ApproveRegisterOutlet = ({navigation, route: {params}}) => {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [isLoading, setIsLoading] = useState(false);

  const [singleData, setSingleData] = useState([]);
  const [imageAttachment, setImageAttachment] = useState([]);

  //   DDL State
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [beatDDL, setBeatDDL] = useState([]);

  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setTerritoryDDL,
    );
    getFileListDDL(params?.id, setImageAttachment);
    getSingleData(params?.id, setSingleData);
  }, []);

  const saveHandler = (values) => {
    let payload = {
      beatId: values?.beat?.value,
      beatName: values?.beat?.label,
      outletId: params?.id,
      routeId: values?.route?.value,
      routeName: values?.route?.label,
      sectionId: values?.territory?.value,
      sectionName: values?.territory?.label,
    };
    approveOutletRegistration(payload, setIsLoading);
  };

  return (
    <>
      <CommonTopBar />

      <ScrollView contentContainerStyle={{paddingHorizontal: 10}}>
        <View style={{marginHorizontal: 10}}>
          <Formik
            enableReinitialize={true}
            initialValues={params?.id ? singleData : initValues}
            // validationSchema={schemaValidation}
            onSubmit={(values, actions) => {
              saveHandler(values, () => {
                actions.resetForm();
              });
            }}>
            {(formikprops) => (
              <>
                <Row colGap={6} style={{marginTop: 15}}>
                  <Col width="50%">
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
                        formikprops.setFieldValue('beat', '');

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

                  <Col width="50%">
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
                        getBeatDDL(item?.value, setBeatDDL);
                      }}
                      formikProps={formikprops}
                    />
                  </Col>
                  <Col width="50%">
                    <ICustomPicker
                      label="Market Name"
                      name="beat"
                      options={beatDDL}
                      wrapperStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: 5,
                      }}
                      formikProps={formikprops}
                    />
                  </Col>
                  <Col width="50%">
                    <CustomButton
                      disabled={
                        !formikprops?.values?.territory ||
                        !formikprops?.values?.route ||
                        !formikprops?.values?.beat
                      }
                      onPress={formikprops?.handleSubmit}
                      isLoading={isLoading}
                      style={{marginTop: 20}}
                      btnTxt="Approve"
                    />
                  </Col>
                </Row>

                <MiniButton
                  containerStyle={{justifyContent: 'flex-start'}}
                  disabled={true}
                  btnText={`Created By :  ${formikprops?.values?.registeredBy}`}
                />
                <Row colGap={6} style={{marginTop: 10}}>
                  <Col width="50%">
                    <FormInput
                      name="outletName"
                      label="Outlet Name"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                  <Col width="50%">
                    <FormInput
                      name="outletBanglaName"
                      label="Outlet Bangla Name"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                  <Col width="50%">
                    <ICustomPicker
                      label="Outlet Type"
                      name="outletType"
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                  <Col width="50%">
                    <FormInput
                      name="outletAddress"
                      label="Outlet Address"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                  <Col width="50%">
                    <ICustomPicker
                      label="Thana"
                      name="thana"
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                  <Col width="50%">
                    <FormInput
                      name="lattitude"
                      label="Lattidute"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                  <Col width="50%">
                    <FormInput
                      name="longitude"
                      label="Longitude"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>

                  <Col width="50%">
                    <FormInput
                      label="Trade License No"
                      name="tradeLicenseNo"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                  <Col width="50%">
                    <ICustomPicker
                      label="Max Sales Item"
                      name="maxSalesItem"
                      disabled={true}
                      formikProps={formikprops}
                    />
                  </Col>
                  <Col width="50%">
                    <FormInput
                      label="Monthly Average Sales"
                      name="monthlyAverageSales"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                  <Col width="50%">
                    <View
                      style={[
                        {
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          marginVertical: 10,
                        },
                      ]}>
                      <ICheckbox
                        disabled
                        checked={formikprops?.values?.isCooler}
                      />
                      <Text>Is Coller</Text>
                    </View>

                    <View
                      style={[
                        {
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          marginVertical: 10,
                        },
                      ]}>
                      <ICheckbox
                        disabled
                        checked={formikprops?.values?.isHvo}
                      />
                      <Text>Is HVO</Text>
                    </View>
                  </Col>
                  <Col width="50%">
                    <ICustomPicker
                      disabled={true}
                      label="Coller Company"
                      name="collerCompany"
                      formikProps={formikprops}
                    />
                  </Col>
                  {formikprops?.values?.outletImagePath ? (
                    <Col width="50%" style={{marginVertical: 20}}>
                      {/* <CustomButton
                     disabled={!formikprops?.values?.outletImagePath}
                     onPress={() => {}}
                     btnTxt="View"r
                   /> */}
                      <ImageViewer
                        width={100}
                        height={100}
                        image={formikprops?.values?.outletImagePath}
                      />
                    </Col>
                  ) : null}

                  {/* <Col width="50%" style={{marginTop: 5}}>
                    <FilePicker disabled={true} isIconBtn={true} />
                    <ImageViewer image={imageAttachment[0]?.fileId} />
                    {imageAttachment ? (
                      <Text>{imageAttachment[0]?.fileName}</Text>
                    ) : null}
                  </Col> */}
                </Row>

                <Row colGap={6}>
                  <Col width="50%">
                    <FormInput
                      name="ownerName"
                      label="Owner Name"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                  <Col width="50%">
                    <FormInput
                      name="mobile"
                      label="Mobile Number"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                  <Col width="50%">
                    <FormInput
                      name="contactType"
                      label="Contact Type"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                  <Col width="50%">
                    <FormInput
                      name="email"
                      label="Email Address"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                  <Col width="50%">
                    <FormInput
                      name="dateofBirth"
                      label="Date of Birth"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                  <Col width="50%">
                    <ICustomPicker
                      disabled={true}
                      label="Marriage Status"
                      name="marriageStatus"
                      formikProps={formikprops}
                    />
                  </Col>
                  <Col width="50%">
                    <FormInput
                      name="ownerNID"
                      label="Owner NID"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>

                  {/* <Col width="50%">
                    <FormInput
                      name="registeredBy"
                      label="Registered By"
                      inputStyle={styles.inputStyle}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col> */}
                </Row>
                {/* userName */}
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
  );
};

export default ApproveRegisterOutlet;

const styles = StyleSheet.create({
  inputStyle: {
    borderWidth: 0,
    borderBottomWidth: 1,
    marginTop: 0,
  },
});

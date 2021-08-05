import React, {useState, useEffect, useContext} from 'react';
import {View, ScrollView, StyleSheet, Text, Image} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import * as Yup from 'yup';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../common/components/TextInput';

import {
  getAssetDDL,
  getValuesAgainstAsset,
  createOutletBillRequest,
} from '../helper';
import {singleAttachmentAction} from '../../../../../common/actions/helper';

import {GlobalState} from '../../../../../GlobalStateProvider';
import CustomButton from '../../../../../common/components/CustomButton';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import FilePicker from '../../../../../common/components/FilePicker';
import Col from '../../../../../common/components/Col';
import Row from '../../../../../common/components/Row';

const schemaValidation = Yup.object({
  assetName: Yup.object().shape({
    label: Yup.string().required('Asset name is required'),
    value: Yup.string().required('Asset name is required'),
  }),
});

function CreateOutletBillRequest({route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [loading, setLoading] = useState(false);
  const [assetDDL, setAssetDDL] = useState([]);

  useEffect(() => {
    getAssetDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      params?.outlet?.value,
      setAssetDDL,
    );
  }, []);
  const saveHandler = (values, cb) => {
    let payload = {
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      territoryId: 0,
      routeId: params?.route?.value,
      beatId: params?.beat?.value,
      outletid: params?.outlet?.value,
      outletName: params?.outlet?.label,
      outletAddress: params?.outlet?.address,
      assetItemId: values?.assetName?.value,
      receiveQuantity: values?.receiveQuantity,
      assetReceiveId: 0,
      numOutletBillAmount: values?.billRequestAmount,
      strNarration: values?.commentsCreate,
      dteOutletBillDate: values?.billRequestDate,
      actionBy: profileData?.userId,
      approveBy: profileData?.userId,
    };
    try {
      if (values?.attachment?.uri) {
        // AttachmentLink Add | Single
        singleAttachmentAction(values?.attachment).then((data) => {
          // Upload Image Link
          const modifyPayload = {
            ...payload,
            fileName: data[0]?.id || '',
          };
          createOutletBillRequest(modifyPayload, setLoading);
        });
      } else {
        // Payload Without Attachment
        createOutletBillRequest(payload, setLoading);
      }
    } catch (error) {}
  };

  return (
    <ScrollView>
      {/* <Text>{JSON.stringify(valuesFromAsset[0], null, 2)}</Text> */}

      <CommonTopBar />

      <View style={{marginHorizontal: 10, marginTop: 10}}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            outletAddress: params?.outlet?.address,
            assetName: '',
            billRequestDate: _todayDate(),
          }}
          validationSchema={schemaValidation}
          onSubmit={(values, actions) => {
            saveHandler(values, () => {
              actions.resetForm();
            });
          }}>
          {(formikprops) => (
            <View>
              <FormInput
                label="Outlet Address"
                name="outletAddress"
                disabled={true}
                formikProps={formikprops}
              />
              <ICustomPicker
                label="Asset Name"
                name="assetName"
                options={assetDDL}
                onChange={(item) => {
                  formikprops?.setFieldValue('assetName', item);
                  getValuesAgainstAsset(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    params?.outlet?.value,
                    item?.value,
                    formikprops?.setFieldValue,
                  );
                }}
                formikProps={formikprops}
              />

              <FormInput
                label="Receive Quantity"
                name="receiveQuantity"
                disabled={true}
                formikProps={formikprops}
              />
              <FormInput
                label="Comments"
                name="comments"
                disabled={true}
                formikProps={formikprops}
              />
              <FormInput
                label="Bill Request Amount"
                name="billRequestAmount"
                disabled={true}
                formikProps={formikprops}
              />
              <FormInput
                label="Bill Request Date"
                name="billRequestDate"
                disabled={true}
                formikProps={formikprops}
              />

              <FormInput
                label="Comments"
                name="commentsCreate"
                formikProps={formikprops}
              />

              <Row>
                <Col style={{justifyContent: 'center'}}>
                  <FilePicker
                    onSelect={(e) => {
                      formikprops?.setFieldValue('attachment', e);
                    }}
                    isIconBtn={true}
                  />
                </Col>
                <Col
                  width="20%"
                  style={{marginLeft: 5, justifyContent: 'center'}}>
                  <Image
                    style={{width: '100%', height: 45}}
                    source={{uri: formikprops?.values?.attachment?.uri}}
                  />
                </Col>
              </Row>

              <CustomButton
                isLoading={loading}
                onPress={formikprops.handleSubmit}
                btnTxt="Save"
              />
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

export default CreateOutletBillRequest;

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#AEAEAE',
    height: 1.5,
  },
  textError: {
    color: 'red',
  },
});

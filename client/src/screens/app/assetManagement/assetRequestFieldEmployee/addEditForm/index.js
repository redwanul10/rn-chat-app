import React, {useState, useEffect, useContext} from 'react';
import * as Yup from 'yup';
import {ScrollView, View} from 'react-native';

import {useFormik} from 'formik';
import Row from '../../../../../common/components/Row';
import Col from '../../../../../common/components/Col';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import CustomButton from '../../../../../common/components/CustomButton';
import {GlobalState} from '../../../../../GlobalStateProvider';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';
import {_todayDate} from '../../../../../common/functions/_todayDate';
import {
  CreateAsssetMaintenanceRequest,
  CreateAssetPullOutRequest,
  CreateAssetTransferRequest,
} from '../helper';
import FormInput from '../../../../../common/components/TextInput';
import Text from '../../../../../common/components/IText';

const schemaValidation = Yup.object().shape({
  description: Yup.string().required('description is required'),
});

const initValues = {
  description: '',
};

function MaintenanceAssetRequest({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [loading, setLoading] = useState(false);

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: {...params, ...initValues, assetName: params?.name},
    validationSchema: schemaValidation,
    onSubmit: (values, actions) => {
      saveHandler(values, () => {
        actions.resetForm();
        setRowDto([]);
      });
    },
  });

  const saveHandler = (values) => {
    const payload = {
      transferRequestId: 0,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      requestBy: profileData?.userId,
      assetCode: params?.assetCode,
      assetName: params?.name,
      narration: values?.description,
      requestDate: _todayDate(),
      outletId: params?.outletid,
      outletName: params?.outletName,
      approvedBy: profileData?.userId,
      dteTransferDate: _todayDate(),
      transferStatus: '',
      transferTo: '',
      strHoremarks: '',
    };
    const payloadTwo = {
      requestMedia: 'Employee',
      requestStatus: '',
      maintenanceParty: '',
      isActive: true,
      horemarks: '',
      amount: 0,
      pointId: params?.point?.value,
      pointName: params?.point?.label,
      sectionId: params?.section?.value,
      sectionName: params?.section?.label,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      requestBy: profileData?.userId,
      assetCode: params?.assetCode,
      assetName: params?.name,
      narration: values?.description,
      requestDate: _todayDate(),
      outletId: params?.outletid,
      outletName: params?.outletName,
      approvedBy: profileData?.userId,
    };

    if (params.btnTypeId === 1) {
      CreateAsssetMaintenanceRequest(payloadTwo, setLoading);
    } else if (params.btnTypeId === 2) {
      CreateAssetPullOutRequest(payload, setLoading);
    } else if (params.btnTypeId === 3) {
      CreateAssetTransferRequest(payload, setLoading);
    }
  };
  const resetFormValue = () => {
    formikprops?.setFieldValue('description', '');
  };

  return (
    <>
      <ScrollView>
        <CommonTopBar />
        {/* <Text>{JSON.stringify(params, null, 2)}</Text> */}

        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <Row colGap={5}>
            <Col width="50%">
              <FormInput
                disabled={true}
                label="Asset Name"
                name="assetName"
                keyboardType="numeric"
                formikProps={formikprops}
              />
            </Col>

            <Col width="50%">
              <FormInput
                disabled={true}
                label="Asset Code"
                name="assetCode"
                formikProps={formikprops}
              />
            </Col>
            <Col width="100%">
              <FormInput
                label="Description"
                name="description"
                formikProps={formikprops}
              />
            </Col>

            <Col width="50%" style={{justifyContent: 'center'}}>
              <CustomButton
                onPress={(e) => {
                  formikprops.handleSubmit();
                }}
                isLoading={loading}
                btnTxt="Save"
              />
            </Col>
            <Col width="50%" style={{justifyContent: 'center'}}>
              <CustomButton
                onPress={() => {
                  resetFormValue();
                }}
                btnTxt="Reset"
              />
            </Col>
          </Row>
        </View>
      </ScrollView>
    </>
  );
}

export default MaintenanceAssetRequest;

/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import * as Yup from 'yup';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../common/components/TextInput';

import {createOutletSetup, editOutletSetup} from '../helper';

import {GlobalState} from '../../../../../GlobalStateProvider';
import CustomButton from '../../../../../common/components/CustomButton';
import {_dateFormatter} from '../../../../../common/functions/_dateFormatter';

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

function CreateOutletHeSetup({route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [loading, setLoading] = useState(false);

  const deleteHandler = (values) => {
    let payloadDelete = [
      {
        heid: params?.item?.heid,
        territoryId: params?.item?.territoryId,
        monthId: params?.item?.monthId,
        yearId: params?.item?.yearId,
        fromDate: _dateFormatter(params?.item?.fromDate),
        toDate: _dateFormatter(params?.item?.toDate),
        heoutletNo: values?.outletNo,
        isActive: false,
      },
    ];
    editOutletSetup(payloadDelete);
  };

  const saveHandler = (values, cb) => {
    let payload = [
      {
        actionBy: profileData?.userId,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        territoryId: params?.section?.value,
        monthId: params?.month?.value,
        yearId: params?.year?.value,
        fromDate: params?.fromDate,
        toDate: params?.toDate,
        heoutletNo: values?.outletNo,
      },
    ];

    let payloadEdit = [
      {
        heid: params?.item?.heid,
        territoryId: params?.item?.territoryId,
        monthId: params?.item?.monthId,
        yearId: params?.item?.yearId,
        fromDate: _dateFormatter(params?.item?.fromDate),
        toDate: _dateFormatter(params?.item?.toDate),
        heoutletNo: values?.outletNo,
        isActive: true,
      },
    ];

    if (params?.item) {
      editOutletSetup(payloadEdit, setLoading, cb);
    } else {
      createOutletSetup(payload, setLoading, cb);
    }
  };

  return (
    <ScrollView>
      <CommonTopBar />
      {/* <Text>{JSON.stringify(params, null, 2)}</Text> */}
      <View style={{marginHorizontal: 10, marginTop: 10}}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            section: params?.item
              ? {
                  value: params?.item?.territoryId,
                  label: params?.item?.territoryName,
                }
              : params?.section,
            outletNo: params?.item?.heoutletNo || 0,
          }}
          // validationSchema={schemaValidation}
          onSubmit={(values, actions) => {
            saveHandler(values, () => {
              actions.resetForm();
            });
          }}>
          {(formikprops) => (
            <View>
              <ICustomPicker
                label="Section Name"
                name="section"
                disabled={true}
                formikProps={formikprops}
              />

              <FormInput
                label="Outlet No"
                name="outletNo"
                keyboardType="numeric"
                formikProps={formikprops}
              />

              <CustomButton
                isLoading={loading}
                onPress={formikprops.handleSubmit}
                btnTxt="Save"
              />

              {params?.item && (
                <CustomButton
                  onPress={() => {
                    deleteHandler(formikprops?.values);
                  }}
                  style={{backgroundColor: 'red'}}
                  btnTxt="Delete"
                />
              )}
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

export default CreateOutletHeSetup;

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#AEAEAE',
    height: 1.5,
  },
  textError: {
    color: 'red',
  },
});

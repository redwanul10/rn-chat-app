import React, {useState, useEffect, useContext} from 'react';
import {View, ScrollView, TouchableOpacity, Text} from 'react-native';
import CommonTopBar from '../../../../../../common/components/CommonTopBar';
import {Formik} from 'formik';

import * as Yup from 'yup';

import ICustomPicker from '../../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../../common/components/TextInput';
import IDatePicker from '../../../../../../common/components/IDatePicker';
import {getOutletProfileTypeInfo} from '../helper';
import {GlobalState} from '../../../../../../GlobalStateProvider';

const title = 'Business Information';

function BusinessInfo({route: {params}, navigation}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [outletProfile, setOutletProfile] = useState([]);
  const [validation, setValidation] = useState([]);
  const [initData, setInitData] = useState([]);

  useEffect(() => {
    getOutletProfileTypeInfo(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setOutletProfile,
    );
  }, []);

  // For dynamic fields DDL
  const generateOptionsForDDL = (arr) => {
    return arr.map((item) => ({
      value: item?.attributeValueId,
      label: item?.outletAttributeValueName,
    }));
  };

  const renderFieldsBasedOnTypes = (inputField, formikprops) => {
    const {objAttribute, objAttributeValue} = inputField;

    switch (objAttribute?.uicontrolType) {
      case 'TextBox':
        return (
          <FormInput
            name={objAttribute?.outletAttributeName}
            label={objAttribute?.outletAttributeName}
            placeholder="Enter Beat Name"
            inputStyle={{
              borderWidth: 0,
              borderBottomWidth: 1,
              marginTop: 0,
            }}
            formikProps={formikprops}
          />
        );
      case 'Date':
        return (
          <IDatePicker
            name={objAttribute?.outletAttributeName}
            label={objAttribute?.outletAttributeName}
            formikProps={formikprops}
          />
        );

      case 'DDL':
        return (
          <ICustomPicker
            name={objAttribute?.outletAttributeName}
            label={objAttribute?.outletAttributeName}
            options={generateOptionsForDDL(objAttributeValue) || []}
            formikProps={formikprops}
          />
        );

      case 'Number':
        return (
          <FormInput
            name={objAttribute?.outletAttributeName}
            label={objAttribute?.outletAttributeName}
            placeholder="Enter Beat Name"
            keyboardType="numeric"
            inputStyle={{
              borderWidth: 0,
              borderBottomWidth: 1,
              marginTop: 0,
            }}
            formikProps={formikprops}
          />
        );

      default:
        break;
    }
  };

  useEffect(() => {
    // Generate Validations
    let dynamicValidations = {};
    outletProfile?.forEach((field) => {
      const {objAttribute} = field;
      dynamicValidations[objAttribute?.outletAttributeName] =
        Yup.string().required(
          `${objAttribute?.outletAttributeName} is Required`,
        ) || Yup.string().optional();
    });

    setValidation(dynamicValidations);

    // Generate Initial Values
    let init = {};
    outletProfile?.forEach((field) => {
      const {objAttribute} = field;
      init[objAttribute?.outletAttributeName] =
        objAttribute?.outletAttributeValueName;
    });

    setInitData(params?.businessInfo || init);
  }, [outletProfile]);

  return (
    <ScrollView>
      <CommonTopBar title={title} />
      <View style={{marginHorizontal: 10, marginTop: 20}}>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={Yup.object({
            // ...validation,
          })}
          onSubmit={(values, actions) => {
            params?.onUpdateHandler({businessInfo: values});
            navigation?.goBack();
          }}>
          {(formikprops) => (
            <View>
              {outletProfile?.map((inputField, index) => (
                <View key={index}>
                  {renderFieldsBasedOnTypes(inputField, formikprops)}
                </View>
              ))}
              <TouchableOpacity
                onPress={(e) => {
                  formikprops?.handleSubmit();
                }}
                style={{
                  height: 50,
                  backgroundColor: '#063197',
                  marginVertical: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                }}>
                <Text style={{color: '#ffffff'}}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

export default BusinessInfo;

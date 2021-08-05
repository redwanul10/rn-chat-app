import React, {useState, useEffect, useContext} from 'react';
import {View, ScrollView} from 'react-native';
import CommonTopBar from '../../../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import * as Yup from 'yup';
import ICustomPicker from '../../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../../common/components/TextInput';
import IDatePicker from '../../../../../../common/components/IDatePicker';
import {getOutletProfileTypeInfo} from '../helper';
import {GlobalState} from '../../../../../../GlobalStateProvider';

const title = 'Business Information';

function ViewBusinessInfo({route: {params}, navigation}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [outletProfile, setOutletProfile] = useState([]);
  const [validation, setValidation] = useState([]);
  const [initData, setInitData] = useState([]);

  useEffect(() => {
    getOutletProfileTypeInfo(
      2 || profileData?.accoundId,
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
            disabled={true}
          />
        );
      case 'Date':
        return (
          <IDatePicker
            name={objAttribute?.outletAttributeName}
            label={objAttribute?.outletAttributeName}
            formikProps={formikprops}
            disabled={true}
          />
        );

      case 'DDL':
        return (
          <ICustomPicker
            name={objAttribute?.outletAttributeName}
            label={objAttribute?.outletAttributeName}
            options={generateOptionsForDDL(objAttributeValue) || []}
            formikProps={formikprops}
            disabled={true}
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
            disabled={true}
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
            // params?.setIsBusinessInfoDone(true);
            params?.onUpdateHandler({businessInfo: values});
            navigation?.goBack();
          }}>
          {(formikprops) => (
            <View>
              {outletProfile?.map((inputField, index) => (
                <>
                  <View key={index}>
                    {renderFieldsBasedOnTypes(inputField, formikprops)}
                  </View>
                </>
              ))}
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

export default ViewBusinessInfo;

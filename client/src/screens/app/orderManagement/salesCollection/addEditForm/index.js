import React, {useState, useEffect, useContext} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {
  createSalesCollection,
  editSalesCollection,
  getTerritoryDDL,
  getPartnerDDL,
  getSalesCollectionById,
} from '../helper';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import {GlobalState} from '../../../../../GlobalStateProvider';
import CustomButton from '../../../../../common/components/CustomButton';
import IDatePicker from '../../../../../common/components/IDatePicker';
import FormInput from '../../../../../common/components/TextInput';

const title = 'Create Route';
const initValues = {
  teritory: '',
  partner: '',
  amount: '',
  collectionData: '',
  comments: '',
};
const schemaValidation = Yup.object({
  route_name: Yup.string().required('This field is required'),

  startOutlet: Yup.object()
    .shape({
      label: Yup.string().required('Start Outlet is required'),
      value: Yup.string().required('Start Outlet is required'),
    })
    .required('This field is required'),

  teritory: Yup.object()
    .shape({
      label: Yup.string().required('Incoterm is required'),
      value: Yup.string().required('Incoterm is required'),
    })
    .required('This field is required'),

  endOtlet: Yup.object()
    .shape({
      label: Yup.string().required('End Outlet is required'),
      value: Yup.string().required('End Outlet is required'),
    })
    .required('This field is required'),
});

function SalesCollAddEdit({route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [loading, setLoading] = useState(false);
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [partnerDDL, setPartnerDDL] = useState([]);
  const [singleData, setSingleData] = useState([]);

  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setTerritoryDDL,
    );

    getSalesCollectionById(params?.id, setSingleData);
  }, []);

  const saveHandler = (values, cb) => {
    if (!params?.id) {
      // Create
      let payload = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        businessPartnerId: values?.partner?.value,
        collectionDate: values?.collectionData || '',
        amount: Number(values?.amount) || 0,
        remarks: values?.comments || '',
        isReceived: false,
        actionBy: profileData?.userId,
        isActive: true,
      };

      createSalesCollection(payload, setLoading, cb);
    } else {
      // Edit
      let payload = {
        id: params?.id,
        businessPartnerId: values?.partner?.value,
        collectionDate: values?.collectionData || '',
        amount: Number(values?.amount) || 0,
        remarks: values?.comments || '',
        isReceived: false,
        actionBy: profileData?.userId,
        isActive: true,
      };

      editSalesCollection(payload, setLoading, cb);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={{backgroundColor: '#F4F6FC', flex: 1}}>
        <CommonTopBar />
        <View style={{marginHorizontal: 10, marginTop: 20}}>
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
              <View>
                {!params?.id && (
                  <ICustomPicker
                    label="Territory Name"
                    name="teritory"
                    options={territoryDDL}
                    onChange={(selectedOption) => {
                      formikprops?.setFieldValue('teritory', selectedOption);
                      getPartnerDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        selectedOption?.value,
                        setPartnerDDL,
                      );
                    }}
                    formikProps={formikprops}
                  />
                )}

                <ICustomPicker
                  label="Partner Name"
                  name="partner"
                  options={partnerDDL}
                  formikProps={formikprops}
                  disabled={params?.id ? true : false}
                />

                <FormInput
                  name="amount"
                  label="Amount"
                  placeholder="Enter Amount"
                  keyboardType="numeric"
                  inputStyle={styles.inputStyle}
                  formikProps={formikprops}
                />

                <IDatePicker
                  label="Collection Date"
                  name="collectionData"
                  formikProps={formikprops}
                />

                <FormInput
                  name="comments"
                  label="Comments"
                  placeholder="Enter Comments"
                  inputStyle={styles.inputStyle}
                  formikProps={formikprops}
                />

                <CustomButton
                  onPress={formikprops.handleSubmit}
                  isLoading={loading}
                  // bgColor="#105B63"
                  btnTxt={params?.id ? 'Edit' : 'Create'}
                />
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
  );
}

export default SalesCollAddEdit;

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#AEAEAE',
    height: 1.5,
  },
  textError: {
    color: 'red',
  },
  box: {
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#ffffff',

    // elevation: 5,
    // padding: 9,
    // paddingLeft: 12,
  },
  label: {
    fontSize: 14,
    // fontFamily: 'Rubik-Regular',
    color: '#636363',
  },
  inputStyle: {
    borderWidth: 0,
    borderBottomWidth: 1,
    marginTop: 0,
  },
});

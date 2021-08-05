import React, {useState, useContext} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import * as Yup from 'yup';
import {Formik} from 'formik';

import {createSecondaryDeliveryCollection} from '../helper';

import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {GlobalState} from '../../../../../GlobalStateProvider';
import CustomButton from '../../../../../common/components/CustomButton';
import FormInput from '../../../../../common/components/TextInput';


const initValues = {
  totalDeliveryAmount: '',
  totalOrderAmount: '',
  dueAmount: '',
  collectionAmount: '',
};
const schemaValidation = Yup.object({
  collectionAmount: Yup.string().required('Collection Amount is required'),

});

function RetailCollectionForm({route: {params}}) {
  
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [loading, setLoading] = useState(false);



  const saveHandler = (values, cb) => {
    let payload = {
      delivaryId: params?.deliveryId,
      recieveAmount: values?.collectionAmount,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
    };

    createSecondaryDeliveryCollection(payload, setLoading, cb);
  };

  return (
    <>
      <ScrollView contentContainerStyle={{backgroundColor: '#F4F6FC', flex: 1}}>
        <CommonTopBar />
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <Formik
            enableReinitialize={true}
            initialValues={{...params}}
            validationSchema={schemaValidation}
            onSubmit={(values, actions) => {
              saveHandler(values, () => {
                actions.resetForm();
              });
            }}>
            {(formikprops) => (
              <View>
                <FormInput
                  name="totalDeliveryAmount"
                  label="Total Delivery Amount"
                  placeholder="Enter Delivery Amount"
                  inputStyle={styles.inputStyle}
                  keyboardType="numeric"
                  disabled={true}
                  formikProps={formikprops}
                />

                <FormInput
                  name="totalOrderAmount"
                  label="Total Order Amount"
                  placeholder="Enter Order Amount"
                  inputStyle={styles.inputStyle}
                  keyboardType="numeric"
                  disabled={true}
                  formikProps={formikprops}
                />

                <FormInput
                  name="dueAmount"
                  label="Due Amount"
                  placeholder="Enter Due Amount"
                  inputStyle={styles.inputStyle}
                  keyboardType="numeric"
                  disabled={true}
                  formikProps={formikprops}
                />

                <FormInput
                  name="collectionAmount"
                  label="Collection Amount"
                  placeholder="Enter Collection Amount"
                  inputStyle={styles.inputStyle}
                  keyboardType="numeric"
                  formikProps={formikprops}
                />

                <CustomButton
                  onPress={formikprops.handleSubmit}
                  // bgColor="#105B63"
                  isLoading={loading}
                  btnTxt="Create"
                />
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
  );
}

export default RetailCollectionForm;

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

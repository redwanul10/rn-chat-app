import React from 'react';
import {View, TouchableOpacity, ScrollView, Text} from 'react-native';
import CommonTopBar from '../../../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import ICustomPicker from '../../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../../common/components/TextInput';
import IDatePicker from '../../../../../../common/components/IDatePicker';

const title = 'Owner Information';

const initValues = {
  contactType: '',
  email: '',
  dateOfBirth: '',
  marriageStatus: '',
  ownerNid: '',
  marriageDate: '',
};

function OwnerInfo({route: {params}, navigation}) {
  return (
    <ScrollView>
      <CommonTopBar title={title} />
      <View style={{marginHorizontal: 10, marginTop: 20}}>
        <Formik
          enableReinitialize={true}
          initialValues={params?.ownerInfo || initValues}
          onSubmit={(values, actions) => {
            params?.onUpdateHandler({ownerInfo: values});
            navigation?.goBack();
          }}>
          {(formikprops) => (
            <View>
              <FormInput
                name="contactType"
                label="Contact Type"
                placeholder="Enter contact type"
                inputStyle={{
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  marginTop: 0,
                }}
                formikProps={formikprops}
              />
              <FormInput
                name="email"
                label="Email"
                placeholder="Enter email"
                inputStyle={{
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  marginTop: 0,
                }}
                formikProps={formikprops}
              />
              <IDatePicker
                label="Date of Birth"
                name="dateOfBirth"
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

              {formikprops?.values?.marriageStatus?.label === 'Married' ? (
                <IDatePicker
                  label="Marriage Date"
                  name="marriageDate"
                  formikProps={formikprops}
                />
              ) : null}

              <FormInput
                name="ownerNid"
                label="Owner NID"
                keyboardType="numeric"
                inputStyle={{
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  marginTop: 0,
                }}
                formikProps={formikprops}
              />

              <TouchableOpacity
                onPress={formikprops?.handleSubmit}
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

export default OwnerInfo;

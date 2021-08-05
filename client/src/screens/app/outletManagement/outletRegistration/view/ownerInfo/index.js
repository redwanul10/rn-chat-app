import React from 'react';
import {View, ScrollView} from 'react-native';
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
};

function ViewOwnerInfo({route: {params}, navigation}) {
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
                disabled={true}
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
                disabled={true}
              />
              <IDatePicker
                label="Date of Birth"
                name="dateOfBirth"
                formikProps={formikprops}
                disabled={true}
              />

              <ICustomPicker
                label="Marriage Status"
                name="marriageStatus"
                options={[
                  {label: 'Married', value: 1},
                  {label: 'Unmarried', value: 2},
                ]}
                formikProps={formikprops}
                disabled={true}
              />
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
                disabled={true}
              />
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

export default ViewOwnerInfo;

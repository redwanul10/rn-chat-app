/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import CommonTopBar from '../../../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import ICustomPicker from '../../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../../common/components/TextInput';
import ICheckbox from '../../../../../../common/components/ICheckbox';

const title = 'Outlet Information';

const initValues = {
  routeName: '',
  marketName: '',
  outletName: '',
  outletType: '',
  outletAddress: '',
  ownerName: '',
  ownerNumber: '',
  lattitude: '',
  longitude: '',
  maxSalesItem: '',
  avarageAmount: '',
};

function ViewOutletInfo({route: {params}, navigation}) {
  return (
    <ScrollView>
      <CommonTopBar title={title} />
      <View style={{marginHorizontal: 10, marginTop: 20}}>
        <Formik
          enableReinitialize={true}
          initialValues={params?.outletInfo || initValues}
          onSubmit={(values, actions) => {
            params?.onUpdateHandler({outletInfo: values});
            navigation?.goBack();
          }}>
          {(formikprops) => (
            <>
              <FormInput
                name="outletName"
                label="Outlet Name"
                placeholder="Enter Outlet Name"
                inputStyle={style.inputStyle}
                formikProps={formikprops}
                disabled={true}
              />

              <FormInput
                name="outletBanglaName"
                label="Outlet Bangla Name"
                placeholder="Enter Bangla Outlet Name"
                inputStyle={style.inputStyle}
                formikProps={formikprops}
                disabled={true}
              />

              <ICustomPicker
                label="Outlet Type"
                name="outletType"
                formikProps={formikprops}
                disabled={true}
              />

              <FormInput
                name="outletAddress"
                label="Outlet Address"
                placeholder="Enter Outlet Address"
                inputStyle={style.inputStyle}
                formikProps={formikprops}
                disabled={true}
              />

              <FormInput
                name="ownerName"
                label="Owner Name"
                placeholder="Enter Owner Name"
                inputStyle={style.inputStyle}
                formikProps={formikprops}
                disabled={true}
              />

              <FormInput
                name="ownerNumber"
                label="Owner Number"
                placeholder="Enter Owner Number"
                inputStyle={style.inputStyle}
                formikProps={formikprops}
                disabled={true}
              />

              <FormInput
                name="lattitude"
                label="Lattidute"
                placeholder="Enter Lattidute"
                inputStyle={style.inputStyle}
                formikProps={formikprops}
                disabled={true}
              />

              <FormInput
                name="longitude"
                label="Longitude"
                placeholder="Enter Longitude"
                inputStyle={style.inputStyle}
                formikProps={formikprops}
                disabled={true}
              />

              <FormInput
                label="Trade License No"
                name="tradeLicenseNo"
                placeholder="Enter Trade License No"
                inputStyle={style.inputStyle}
                formikProps={formikprops}
                disabled={true}
              />
              <ICustomPicker
                label="Max Sales Item"
                name="maxSalesItem"
                options={[]}
                disabled={true}
                formikProps={formikprops}
              />
              <FormInput
                name="avarageAmount"
                label="Avarage Amount"
                placeholder="Enter Avarage Amount"
                keyboardType="numeric"
                inputStyle={style.inputStyle}
                formikProps={formikprops}
                disabled={true}
              />
              <View
                style={[
                  style.cardStyle,
                  {
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginVertical: 10,
                  },
                ]}>
                <ICheckbox
                  disabled
                  checked={formikprops?.values?.isColler}
                />
                <Text>Is Coller</Text>
              </View>

              <View
                style={[
                  style.cardStyle,
                  {
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginVertical: 10,
                  },
                ]}>
                <ICheckbox
                  checked={formikprops?.values?.isHvo}
                  onPress={(e) => {
                    formikprops?.setFieldValue(
                      'isHvo',
                      !formikprops?.values?.isHvo,
                    );
                  }}
                />
                <Text>Is HVO</Text>
              </View>

              {formikprops?.values?.isColler && (
                <ICustomPicker
                  disabled
                  label="Coller Company"
                  name="collerCompany"
                  options={[]}
                  formikProps={formikprops}
                />
              )}
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

export default ViewOutletInfo;

const style = StyleSheet.create({
  divider: {
    backgroundColor: '#AEAEAE',
    height: 1.5,
  },
  textError: {
    color: 'red',
  },
  inputStyle: {
    borderWidth: 0,
    borderBottomWidth: 1,
    marginTop: 0,
  },
});

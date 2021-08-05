import React, {useState, useContext} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Formik} from 'formik';
import FormInput from '../../../common/components/TextInput';
import CommonTopBar from '../../../common/components/CommonTopBar';
import CustomButton from '../../../common/components/CustomButton';
import {GlobalState} from '../../../GlobalStateProvider';
import {changePassword, logoutAction} from './helper';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password  is required'),

  newPassword: Yup.string().required('New password is required'),
});
const initValues = {
  oldPassword: '',
  newPassword: '',
};

function ChangePassword({navigation}) {
  const {profileData} = useContext(GlobalState);

  const [loading, setLoading] = useState(false);

  const saveHandler = (values) => {
    const payload = {
      loginId: profileData?.loginId,
      password: values?.oldPassword,
      newPassword: values?.newPassword,
    };
    changePassword(payload, profileData, setLoading, navigation);
  };
  return (
    <>
      <CommonTopBar />
      {/* <Text>{JSON.stringify(updatedPassword, null, 2)}</Text> */}
      <Formik
        enableReinitialize={true}
        initialValues={{...initValues}}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          saveHandler(values, () => {
            actions.resetForm();
          });
        }}>
        {(formikProps) => (
          <View style={{marginHorizontal: '2%', marginTop: 10}}>
            <FormInput
              name="oldPassword"
              label="Old Password"
              placeholder="Enter your password"
              //   containerStyle={{flex: 1, marginHorizontal: '2%'}}
              formikProps={formikProps}
            />

            <FormInput
              name="newPassword"
              label="New Password"
              placeholder="Enter new password"
              //   containerStyle={{flex: 1, marginHorizontal: '2%'}}
              formikProps={formikProps}
            />
            <CustomButton
              btnTxt="Change"
              isLoading={loading}
              onPress={formikProps.handleSubmit}
            />
          </View>
        )}
      </Formik>
    </>
  );
}

export default ChangePassword;

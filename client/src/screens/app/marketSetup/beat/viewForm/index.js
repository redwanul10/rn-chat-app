import React, {useState, useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import {getBeatById} from '../helper';
import FormInput from '../../../../../common/components/TextInput';

const initValues = {
  beatName: '',
  teritory: '',
  route: '',
};

function BeatView({route: {params}}) {
  const [singleData, setSingleData] = useState({});

  useEffect(() => {
    if (params?.id) getBeatById(params?.id, setSingleData);
  }, []);

  return (
    <>
      <ScrollView>
        <CommonTopBar />
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <Formik
            enableReinitialize={true}
            initialValues={params?.id ? singleData : initValues}
            onSubmit={(values, actions) => {
              actions.resetForm();
            }}>
            {(formikprops) => (
              <View>
                <FormInput
                  name="beatName"
                  label="Beat Name"
                  editable={false}
                  formikProps={formikprops}
                />
                <ICustomPicker
                  label="Territory Name"
                  name="teritory"
                  disabled={true}
                  formikProps={formikprops}
                />
                <ICustomPicker
                  label="Route Name"
                  name="route"
                  disabled={true}
                  formikProps={formikprops}
                />
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
  );
}

export default BeatView;

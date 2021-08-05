import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, Text, TextInput} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import {getRouteById} from '../helper';
import ICustomPicker from '../../../../../common/components/ICustomPicker';

const initValues = {
  route_name: '',
  startOutlet: '',
  endOtlet: '',
  teritory: '',
};

function RouteView({route: {params}}) {
  const [singleData, setSingleData] = useState([]);

  useEffect(() => {
    if (params?.id) getRouteById(params?.id, setSingleData);
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={{backgroundColor: '#ffffff', flex: 1}}>
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
                <Text>Route name</Text>
                <TextInput
                  value={formikprops.values.route_name}
                  editable={false}
                />
                <View style={[styles.cardCommon, styles.divider]} />
                <Text></Text>

                <ICustomPicker
                  label="Territory Name"
                  name="teritory"
                  disabled={true}
                  formikProps={formikprops}
                />

                <ICustomPicker
                  label="Start Outlet Name"
                  name="startOutlet"
                  disabled={true}
                  formikProps={formikprops}
                />

                <ICustomPicker
                  label="End Outlet Name"
                  name="endOtlet"
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

export default RouteView;

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
    fontFamily: 'Rubik-Regular',
    color: '#636363',
  },
});

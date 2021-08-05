import React, {useState, useEffect, useContext} from 'react';
import {ScrollView, StyleSheet, View, Text, TextInput} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {createRoute, editRoute, getOutlateDDL, getRouteById} from '../helper';
import {getTerritoryDDL} from '../../../../../common/actions/helper';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import {GlobalState} from '../../../../../GlobalStateProvider';
import CustomButton from '../../../../../common/components/CustomButton';

const initValues = {
  route_name: '',
  startOutlet: '',
  endOtlet: '',
  teritory: '',
};

const schemaValidation = Yup.object({
  route_name: Yup.string().required('This field is required'),
  startOutlet: Yup.object()
    .nullable()
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
    .nullable()
    .shape({
      label: Yup.string().required('End Outlet is required'),
      value: Yup.string().required('End Outlet is required'),
    })
    .required('This field is required'),
});

function RouteAddEdit({route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [loading, setLoading] = useState(false);
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [outletDDL, setOutletDDL] = useState([]);
  const [singleData, setSingleData] = useState([]);

  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setTerritoryDDL,
    );
    getOutlateDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setOutletDDL,
    );

    if (params?.id) getRouteById(params?.id, setSingleData);
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {
    let payload = {
      routeName: values?.route_name,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      territoryId: values?.teritory?.value,
      startOutletId: values?.startOutlet?.value,
      endOutletId: values?.endOtlet?.value,
      actionBy: profileData?.userId,
    };
    if (params?.id) {
      payload = {
        ...payload,
        routeId: params?.id,
      };
      editRoute(payload, setLoading);
    } else {
      createRoute(payload, setLoading, cb);
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
            validationSchema={schemaValidation}
            onSubmit={(values, actions) => {
              saveHandler(values, () => {
                actions.resetForm();
              });
            }}>
            {(formikprops) => (
              <View>
                <Text>Route name</Text>
                <TextInput
                  onChangeText={formikprops.handleChange('route_name')}
                  value={formikprops.values.route_name}
                  onBlur={formikprops.handleBlur('route_name')}
                />
                <View style={[styles.cardCommon, styles.divider]} />
                <Text style={styles.textError}>
                  {formikprops.touched.route_name &&
                    formikprops.errors.route_name}
                </Text>

                <ICustomPicker
                  label="Territory Name"
                  name="teritory"
                  options={territoryDDL}
                  formikProps={formikprops}
                />

                <ICustomPicker
                  label="Start Outlet Name"
                  name="startOutlet"
                  options={outletDDL}
                  formikProps={formikprops}
                />

                <ICustomPicker
                  label="End Outlet Name"
                  name="endOtlet"
                  options={outletDDL}
                  formikProps={formikprops}
                />
                <CustomButton
                  onPress={formikprops.handleSubmit}
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

export default RouteAddEdit;

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
});

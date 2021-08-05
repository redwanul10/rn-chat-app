import React, {useState, useEffect, useContext} from 'react';
import {ScrollView, View} from 'react-native';
import CommonTopBar from '../../../../../common/components/CommonTopBar';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import ICustomPicker from '../../../../../common/components/ICustomPicker';
import {getRouteDDL, createBeat, getBeatById, editBeat} from '../helper';
import {getTerritoryDDL} from '../../../../../common/actions/helper';
import {GlobalState} from '../../../../../GlobalStateProvider';
import FormInput from '../../../../../common/components/TextInput';
import CustomButton from '../../../../../common/components/CustomButton';
import {routeSelectByDefault} from '../../../../../common/functions/routeSelectedByDefault';

const initValues = {
  beatName: '',
  teritory: '',
  route: '',
};

const schemaValidation = Yup.object({
  beatName: Yup.string().required('Beat is required'),
  teritory: Yup.object()
    .shape({
      label: Yup.string().required('Teritory is required'),
      value: Yup.string().required('Teritory is required'),
    })
    .required('This field is required'),
  route: Yup.object()
    .shape({
      label: Yup.string().required('Route is required'),
      value: Yup.string().required('Route is required'),
    })
    .required('This field is required'),
});

function BeatAddEdit({route: {params}}) {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);

  // Formiks Setup
  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: params?.id ? singleData : initValues,
    validationSchema: schemaValidation,
    onSubmit: (values, actions) => {
      saveHandler(values, () => {
        actions.resetForm();
      });
    },
  });

  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,

      setTerritoryDDL,
    );

    if (params?.id) getBeatById(params?.id, setSingleData);
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (singleData?.teritory?.value) {
      getRouteDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        singleData?.teritory?.value,
        setRouteDDL,
      );
    }
  }, [singleData]);

  const saveHandler = (values, cb) => {
    let payload = {
      beatCode: '',
      beatName: values?.beatName,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      territoryId: values?.teritory?.value,
      routeId: values?.route?.value,
      actionBy: profileData?.userId,
    };

    if (params?.id) {
      payload = {
        ...payload,
        beatId: params?.id,
      };
      editBeat(payload, setLoading);
    } else {
      createBeat(payload, setLoading, cb);
    }
  };

  // Last Added | By Default Route Selected | login info wise (territoryInfo?.todayRouteId)
  useEffect(() => {
    routeSelectByDefault(territoryInfo, routeDDL, (selectedRoute) => {
      formikprops?.setFieldValue('route', selectedRoute);
    });
  }, [routeDDL]);

  return (
    <>
      <ScrollView style={{backgroundColor: '#F4F6FC'}}>
        <CommonTopBar />
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <View>
            <FormInput
              name="beatName"
              label="Beat Name"
              placeholder="Enter Beat Name"
              inputStyle={{
                borderWidth: 0,
                borderBottomWidth: 1,
                marginTop: 0,
              }}
              formikProps={formikprops}
            />
            <ICustomPicker
              label="Territory Name"
              name="teritory"
              options={territoryDDL}
              onChange={(item) => {
                formikprops.setFieldValue('teritory', item);
                formikprops.setFieldValue('route', '');
                getRouteDDL(
                  profileData?.accountId,
                  selectedBusinessUnit?.value,
                  item?.value,
                  setRouteDDL,
                );
              }}
              formikProps={formikprops}
            />

            <ICustomPicker
              label="Route Name"
              name="route"
              options={routeDDL}
              disabled={!formikprops.values?.teritory}
              formikProps={formikprops}
            />
            <CustomButton
              onPress={formikprops.handleSubmit}
              btnTxt={params?.id ? 'Edit' : 'Create'}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

export default BeatAddEdit;

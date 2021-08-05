import React, {useEffect, useState, useContext} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import CommonTopBar from '../../../../common/components/CommonTopBar';
import {GlobalState} from '../../../../GlobalStateProvider';
import {Formik} from 'formik';
import ICustomPicker from '../../../../common/components/ICustomPicker';
import CustomButton from '../../../../common/components/CustomButton';
import MiniButton from '../../../../common/components/MiniButton';
import Row from '../../../../common/components/Row';
import Col from '../../../../common/components/Col';
import {Spinner} from 'native-base';
import {getLandingData} from './helper';
import {useFormik} from 'formik';
import {
  getAllRouteDDL,
  getOutletNameDDL,
  getBeatDDL,
} from '../../../../common/actions/helper';
import * as Yup from 'yup';
import {globalStyles} from '../../../../common/globalStyle/globalStyles';
import {_dateFormatter} from '../../../../common/functions/_dateFormatter';
import {routeSelectByDefault} from '../../../../common/functions/routeSelectedByDefault';

const initValues = {
  route: '',
  beat: '',
  outlet: '',
};
const schemaValidation = Yup.object({
  route: Yup.object().shape({
    label: Yup.string().required('Route name is required'),
    value: Yup.string().required('Route name is required'),
  }),
  beat: Yup.object().shape({
    label: Yup.string().required('Market name is required'),
    value: Yup.string().required('Market name is required'),
  }),
  outlet: Yup.object().shape({
    label: Yup.string().required('Outlet is required'),
    value: Yup.string().required('Outlet is required'),
  }),
});

const OutletBillRequest = ({navigation, route: {params}}) => {
  const {profileData, selectedBusinessUnit, territoryInfo} = useContext(
    GlobalState,
  );

  //   DDL State
  const [beatDDL, setBeatDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [outletDDL, setOutletDDL] = useState([]);

  const [landingData, setLandingData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllRouteDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRouteDDL,
    );
  }, []);

  const viewHandler = (values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.outlet?.value,
      setLoading,
      setLandingData,
    );
  };

  const formikprops = useFormik({
    enableReinitialize: true,
    initialValues: {...initValues},
    validationSchema: schemaValidation,
    onSubmit: (values, actions) => {
      viewHandler(values, () => {
        actions.resetForm();
      });
    },
  });

  useEffect(() => {
    routeSelectByDefault(territoryInfo, routeDDL, (selectedRoute) => {
      formikprops?.setFieldValue('route', selectedRoute);
      getBeatDDL(selectedRoute?.value, setBeatDDL);
    });
  }, [routeDDL]);

  return (
    <>
      <CommonTopBar />

      <ScrollView
        contentContainerStyle={{paddingHorizontal: 10, paddingTop: 10}}>
        <>
          <View>
            <Row colGap={6}>
              <Col width="50%">
                <ICustomPicker
                  label="Route Name"
                  name="route"
                  options={routeDDL}
                  onChange={(item) => {
                    formikprops.setFieldValue('route', item);
                    getBeatDDL(item?.value, setBeatDDL);
                  }}
                  formikProps={formikprops}
                />
              </Col>
              <Col width="50%">
                <ICustomPicker
                  label="Market Name"
                  name="beat"
                  options={beatDDL}
                  onChange={(item) => {
                    formikprops.setFieldValue('beat', item);
                    getOutletNameDDL(
                      profileData?.accountId,
                      selectedBusinessUnit?.value,
                      formikprops?.values?.route?.value,
                      item?.value,
                      setOutletDDL,
                    );
                  }}
                  formikProps={formikprops}
                />
              </Col>
            </Row>
            <Row colGap={6}>
              <Col width="50%">
                <ICustomPicker
                  label="Outlet"
                  name="outlet"
                  options={outletDDL}
                  formikProps={formikprops}
                />
              </Col>
            </Row>
            <Row colGap={6}>
              <Col width="50%">
                <CustomButton
                  onPress={formikprops?.handleSubmit}
                  isloading={loading}
                  btnTxt="View"
                />
              </Col>
              <Col width="50%">
                <CustomButton
                  disabled={
                    !formikprops?.values?.route ||
                    !formikprops?.values?.beat ||
                    !formikprops?.values?.outlet
                  }
                  onPress={(e) => {
                    navigation?.navigate('Create Outlet Bill Request', {
                      ...formikprops?.values,
                    });
                  }}
                  btnTxt="Create"
                />
              </Col>
            </Row>

            <View style={[globalStyles.cardStyle]}>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <Text style={globalStyles.fontSizeLarge}>Item Name</Text>

                <Text style={[globalStyles.fontSizeLarge, {color: '#00B44A'}]}>
                  Receive Quantity
                </Text>
              </View>

              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <Text style={globalStyles.fontSizeMedium}>Amount</Text>

                <Text style={[globalStyles.fontSizeMedium, {color: '#00B44A'}]}>
                  Bill Request Date
                </Text>
              </View>
              <MiniButton disabled={true} btnText="Aciton" />
            </View>

            {landingData?.data?.map((item, index) => (
              <View style={[globalStyles.cardStyle]}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text style={globalStyles.fontSizeLarge}>
                    {item?.itemtName}
                  </Text>

                  <Text
                    style={[globalStyles.fontSizeLarge, {color: '#00B44A'}]}>
                    {item?.receiveQuantity}
                  </Text>
                </View>

                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text style={globalStyles.fontSizeMedium}>
                    {item?.numOutletBillAmount}
                  </Text>

                  <Text
                    style={[globalStyles.fontSizeMedium, {color: '#00B44A'}]}>
                    {_dateFormatter(item?.dteOutletBillDate)}
                  </Text>
                </View>
                <MiniButton
                  onPress={() => {
                    navigation.navigate('View Outlet Bill Request', {
                      outletBillId: item?.outletBillId,
                      itemId: item?.assetItemId,
                    });
                  }}
                  btnText="View"
                />
              </View>
            ))}
          </View>
        </>
      </ScrollView>
    </>
  );
};

export default OutletBillRequest;

const styles = StyleSheet.create({
  customerAmount: {
    fontWeight: 'bold',
    fontSize: 17,
  },
});

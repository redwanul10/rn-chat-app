import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import CommonTopBar from '../../../../../../common/components/CommonTopBar';
import { Formik } from 'formik';
import ICustomPicker from '../../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../../common/components/TextInput';
import {
  getStockAllocation_api,
} from '../helper';
import { GlobalState } from '../../../../../../GlobalStateProvider';
import * as Yup from 'yup';
import CustomButton from '../../../../../../common/components/CustomButton';
import { _todayDate } from '../../../../../../common/functions/_todayDate';
import IDatePicker from '../../../../../../common/components/IDatePicker';
import Row from '../../../../../../common/components/Row';
import Col from '../../../../../../common/components/Col';


const initValues = {
  outlet: '',
  outletAddress: '',
  allocationDate: _todayDate(),
};

const schemaValidation = Yup.object().shape({
  vehicle: Yup.object().shape({
    label: Yup.string().required('Vehicle is required'),
    value: Yup.string().required('Vehicle is required'),
  }),
});

function StockAlogationView({ route: { params } }) {
  const { profileData, selectedBusinessUnit } = useContext(GlobalState);
  const [itemInfo, setItemInfo] = useState([]);

  // useEffect(() => {
  //   getStockAllocation_api(
  //     profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     params?.route?.value,
  //     params?.beat?.value,
  //     params?.outlet?.value,
  //     _todayDate(),
  //     setItemInfo,
  //     // setValues,
  //     // values
  //   );
  // });

  const saveHandler = (values, cb) => { };

  return (
    <>
      <ScrollView>
        <CommonTopBar />

        <Formik
          enableReinitialize={true}
          initialValues={{ ...initValues, ...params }}
          validationSchema={schemaValidation}
          onSubmit={(values, actions) => {
            saveHandler(values, () => {
              actions.resetForm();
            });
          }}>
          {(formikprops) => (
            <View style={{ marginHorizontal: 10, marginTop: 20 }}>
              <ScrollView>
                <ICustomPicker
                  label="Outlet Name"
                  name="outlet"
                  // options={outletNameDDL}
                  formikProps={formikprops}
                  disabled={true}
                />

                <FormInput
                  label="Outlet Address"
                  name="outletAddress"
                  formikProps={formikprops}
                  disabled={true}
                />

                <IDatePicker
                  label="Allocationg Date"
                  name="allocationDate"
                  formikProps={formikprops}
                />

                <CustomButton
                  // onPress={formikprops.handleSubmit}
                  onPress={() => {
                    getStockAllocation_api(
                      profileData?.accountId,
                      selectedBusinessUnit?.value,
                      params?.route?.value,
                      params?.beat?.value,
                      params?.outlet?.value,
                      formikprops?.values?.allocationDate,
                      setItemInfo,
                      // setValues,
                      // values
                    );
                  }}
                  btnTxt="Details"
                // isLoading={loading}
                />

                {itemInfo?.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: '#ffffff',

                      borderRadius: 7,
                      marginVertical: 5,
                    }}>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        marginTop: 10,
                      }}>
                      <Row colGap={5}>
                        <Col width="50%">
                          <Text style={{ fontWeight: 'bold' }}>
                            {item?.itemName}
                          </Text>
                        </Col>
                        <Col width="50%">
                          <Text style={{ alignSelf: "flex-end", fontWeight: 'bold', color: '#818a88' }}>
                            Average Sales: {item?.averageSales}
                          </Text>
                          <Text style={{ alignSelf: "flex-end", fontWeight: 'bold', color: '#818a88' }}>
                            Safety Stock : {item?.safetyStock}
                          </Text>
                        </Col>
                      </Row>

                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </Formik>
      </ScrollView>
    </>
  );
}

export default StockAlogationView;

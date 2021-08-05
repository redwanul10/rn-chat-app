import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import CommonTopBar from '../../../../../../common/components/CommonTopBar';
import {Formik, yupToFormErrors} from 'formik';
import ICustomPicker from '../../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../../common/components/TextInput';
import {
  getRetailDelivery,
  createRetailOrderDelivery,
  getVehicleDDL,
} from '../../helper';
import {GlobalState} from '../../../../../../GlobalStateProvider';
import * as Yup from 'yup';
import CustomButton from '../../../../../../common/components/CustomButton';

const initValues = {
  territory: '',
  distributor: '',
  distributorChannel: '',
  route: '',
  vehicle: '',
  beat: '',
  outlet: '',
  orderNum: '',
  totalOrderAmount: 0,
  totalAdvanceAmount: 0,
  totalReceiveAmount: 0,
  dueAmount: 0,
  totalDeliveryAmount: 0,
  collectionAmount: 0,
};

const schemaValidation = Yup.object().shape({
  collectionAmount: Yup.string().required('Collection Amount is required'),
});

function CreateDelivery({route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [singleData, setSingleData] = useState({});
  const [deliveryItems, setdeliveryItems] = useState([]);
  const [vehicleDDL, setVehicleDDL] = useState([]);
  const [isLoading,setIsloading] = useState(false)

  useEffect(() => {
    if (params?.id) {
      getRetailDelivery(
        params?.id,
        params?.orderNo,
        setSingleData,
        setdeliveryItems,
      );
    }
  }, []);

  useEffect(() => {
    if (singleData?.distributor?.value) {
      getVehicleDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        singleData?.distributor?.value,
        setVehicleDDL,
      );
    }
  }, [singleData]);

  const saveHandler = (values, cb) => {
    let payload = {
      delivaryId: params?.id,
      recieveAmount: values?.collectionAmount,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
    };
    // console.log(JSON.stringify(payload,null,2))
    createRetailOrderDelivery(payload,setIsloading, cb);
  };
  return (
    <>
      <ScrollView>
        <CommonTopBar />
        {/* <Text>{JSON.stringify(singleData, null, 2)}</Text> */}
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
            <View style={{marginHorizontal: 10, marginTop: 20}}>
              <ScrollView>
                {/* <ICustomPicker
                  label="Territory Name"
                  name="territory"
                  formikProps={formikprops}
                  disabled={true}
                />
                <ICustomPicker
                  label="Distributor Name"
                  name="distributor"
                  disabled={true}
                  formikProps={formikprops}
                /> */}
                <ICustomPicker
                  label="Distributor Channel"
                  name="distributorChannel"
                  disabled={true}
                  formikProps={formikprops}
                />
                {/* <ICustomPicker
                  label="Route Name"
                  name="route"
                  disabled={true}
                  formikProps={formikprops}
                /> */}
                <ICustomPicker
                  label="Select Vehicle"
                  name="vehicle"
                  options={vehicleDDL}
                  // disabled={true}
                  formikProps={formikprops}
                />
                {/* <ICustomPicker
                  label="Market Name"
                  name="beat"
                  disabled={true}
                  formikProps={formikprops}
                /> */}
                <ICustomPicker
                  label="Outlet Name"
                  name="outlet"
                  disabled={true}
                  formikProps={formikprops}
                />
                <ICustomPicker
                  label="Order Number"
                  name="orderNum"
                  disabled={true}
                  formikProps={formikprops}
                />

                <FormInput
                  name="totalOrderAmount"
                  label="Total Order Amount"
                  formikProps={formikprops}
                  editable={false}
                />

                <FormInput
                  name="totalAdvanceAmount"
                  label="Total Advance Amount"
                  formikProps={formikprops}
                  editable={false}
                />
                <FormInput
                  name="totalReceiveAmount"
                  label="Total Receive Amount"
                  formikProps={formikprops}
                  editable={false}
                />
                <FormInput
                  name="dueAmount"
                  label="Due Amount"
                  formikProps={formikprops}
                  editable={false}
                />
                <FormInput
                  name="totalDeliveryAmount"
                  label="Total Delivery Amount"
                  formikProps={formikprops}
                  editable={false}
                />

                <FormInput
                  name="collectionAmount"
                  label="Collection Amount"
                  keyboardType="numeric"
                  inputStyle={{
                    borderWidth: 0,
                    borderBottomWidth: 1,
                    marginTop: 0,
                  }}
                  formikProps={formikprops}
                />
                {deliveryItems?.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: '#ffffff',
                      height: 70,
                      borderRadius: 7,
                      marginVertical: 5,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 10,
                      }}>
                      <View>
                        <Text style={{fontWeight: 'bold'}}>
                          Item Name:{item?.strProductName}
                        </Text>
                        <Text style={{fontWeight: 'bold'}}>
                          Rate:{item?.numPrice}
                        </Text>
                      </View>
                      <View>
                        <Text style={{fontWeight: 'bold'}}>
                          Quantity: {item?.totalDeliveryQuantity}
                        </Text>
                        <Text style={{fontWeight: 'bold'}}>
                          Amount: {item?.totalDeliveryAmount}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}

                {/* <TouchableOpacity
                  onPress={formikprops.handleSubmit}
                  style={{
                    backgroundColor: '#007bff',
                    alignItems: 'center',
                    padding: 10,
                    marginVertical: 10,
                    borderRadius: 7,
                  }}>
                  <Text style={{color: '#ffffff'}}>Save</Text>
                </TouchableOpacity> */}
                <CustomButton
                  onPress={formikprops.handleSubmit}
                  isLoading={isLoading}
                  btnTxt="Save"
                />
              </ScrollView>
            </View>
          )}
        </Formik>
      </ScrollView>
    </>
  );
}

export default CreateDelivery;

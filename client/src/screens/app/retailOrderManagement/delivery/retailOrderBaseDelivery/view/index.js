import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import CommonTopBar from '../../../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import ICustomPicker from '../../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../../common/components/TextInput';

import {
  getRetailDelivery,
} from '../../helper';

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
};

function ViewRetailOrderDelivery({route: {params}}) {
  const [singleData, setSingleData] = useState({});
  const [deliveryItems, setdeliveryItems] = useState([]);

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

  return (
    <>
      <ScrollView>
        <CommonTopBar />
        {/* <Text>{JSON.stringify(singleData, null, 2)}</Text> */}
        <Formik
          enableReinitialize={true}
          initialValues={params?.id ? singleData : initValues}
          onSubmit={(values, actions) => {
            actions.resetForm();
          }}>
          {(formikprops) => (
            <View style={{marginHorizontal: 10, marginTop: 20}}>
              <ScrollView>
                
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

                {deliveryItems?.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: '#ffffff',
                      height: 70,
                      borderRadius: 7,
                      marginBottom: 10,
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
              </ScrollView>
            </View>
          )}
        </Formik>
      </ScrollView>
    </>
  );
}

export default ViewRetailOrderDelivery;

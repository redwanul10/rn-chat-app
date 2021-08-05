import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  // Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import CommonTopBar from '../../../../../../common/components/CommonTopBar';
import {Formik} from 'formik';
import ICustomPicker from '../../../../../../common/components/ICustomPicker';
import FormInput from '../../../../../../common/components/TextInput';
import {
  getDistributorChannel,
  getItemInfoDDL,
  getDirectDeliveryById,
  getOutletNameDDL,
} from '../helper';

import {GlobalState} from '../../../../../../GlobalStateProvider';
import * as Yup from 'yup';
import {_todayDate} from '../../../../../../common/functions/_todayDate';
import Row from '../../../../../../common/components/Row';
import Col from '../../../../../../common/components/Col';
import Text from '../../../../../../common/components/IText';

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

const schemaValidation = Yup.object().shape({
  vehicle: Yup.object().shape({
    label: Yup.string().required('Vehicle is required'),
    value: Yup.string().required('Vehicle is required'),
  }),
});

function RetailOrderDirectDeliveryView({navigation, route: {params}}) {
  const {profileData, selectedBusinessUnit} = useContext(GlobalState);
  const [singleData, setSingleData] = useState({});
  const [distributorChannel, setDistributorChannel] = useState({});

  // DDL State
  const [vehicleDDL, setVehicleDDL] = useState([]);
  const [beatDDL, setBeatDDL] = useState([]);
  const [outletNameDDL, setOutletNameDDL] = useState([]);
  const [itemInfo, setItemInfo] = useState([]);

  useEffect(() => {
    if (params?.id) {
      getDirectDeliveryById(params?.id, setSingleData, setItemInfo);
    }
  }, []);


  useEffect(() => {
    if (params?.distributor?.value) {
      

      getDistributorChannel(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        params?.distributor?.value,
        setDistributorChannel,
      ).then((channel) => {
        if (!params?.id) {
          getItemInfoDDL(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            channel?.value,
            setItemInfo,
          );
        }
      });
    }
  }, [params]);


  const getTotalAmount = () => {
    let amount = 0;
    itemInfo.forEach((item) => {
      amount += item?.pendingDeliveryQuantity * item?.itemRate;
    });
    amount = amount?.toFixed(3) ? amount?.toFixed(3) : amount;
    return amount ? amount?.toString() : '0';
  };

  return (
    <>
      <ScrollView>
        <CommonTopBar title="View Outlet Direct Delivery" />

        <Formik
          enableReinitialize={true}
          initialValues={
            params?.id ? singleData : {...initValues, distributorChannel}
          }
          validationSchema={schemaValidation}
          onSubmit={(values, actions) => {
            
          }}>
          {(formikprops) => (
            <View style={{marginHorizontal: 10, marginTop: 20}}>
              <ScrollView>

                <ICustomPicker
                  label="Select Vehicle"
                  name="vehicle"
                  options={[{label: 'No Vehicle', value: 0}, ...vehicleDDL]}
                  formikProps={formikprops}
                  disabled={true}
                />

                <ICustomPicker
                  label="Market Name"
                  name="beat"
                  options={beatDDL}
                  onChange={(selectedOption) => {
                    formikprops?.setFieldValue('beat', selectedOption);
                    getOutletNameDDL(
                      profileData?.accountId,
                      selectedBusinessUnit?.value,
                      params?.route?.value,
                      selectedOption?.value,
                      setOutletNameDDL,
                    );
                  }}
                  formikProps={formikprops}
                  disabled={true}
                />

                <ICustomPicker
                  label="Outlet Name"
                  name="outlet"
                  options={outletNameDDL}
                  formikProps={formikprops}
                  disabled={true}
                />

                <Row colGap={5}>
                  <Col width="50%">
                    <FormInput
                      name="totalReceiveAmount"
                      label="Total Receive Amount"
                      keyboardType="numeric"
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                  <Col width="50%">
                    <FormInput
                      name="totalDeliveryAmount"
                      label="Total Delivery Amount"
                      value={getTotalAmount()}
                      formikProps={formikprops}
                      disabled={true}
                    />
                  </Col>
                </Row>

                <View style={styles.itemCardContainer}>
                  <Row style={{alignItems: 'center', marginLeft: 10}}>
                    <Col width="50%">
                      <Text style={{fontWeight: 'bold'}}>Product</Text>
                      <Text style={{fontWeight: 'bold'}}>Rate</Text>
                    </Col>

                    <Col width="50%">
                      <View style={{alignSelf: 'flex-end', marginRight: 10}}>
                        <Text style={{fontWeight: 'bold'}}>Pending Qty</Text>
                      </View>
                    </Col>
                  </Row>
                </View>

                {itemInfo?.map((item, index) => (
                  <View key={index} style={styles.itemCardContainer}>
                    <Row style={{alignItems: 'center', marginLeft: 10}}>
                      <Col width="50%">
                        <Text style={{fontWeight: 'bold'}}>
                          {item?.itemName}
                        </Text>
                        <Text style={{fontWeight: 'bold'}}>
                          Rate: {item?.itemRate}
                        </Text>
                      </Col>

                      <Col width="50%">
                        <View style={{alignSelf: 'flex-end', marginRight: 10}}>
                          <Text>{item?.pendingDeliveryQuantity}</Text>
                        </View>
                      </Col>
                    </Row>
                  </View>
                ))}

                {/* No Order Checkbox */}
                <View style={styles.checkBoxStyle}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Free Items', {
                        values: {
                          ...formikprops?.values,
                          distributorName: formikprops?.values?.distributor,
                        },
                        items: itemInfo,
                        id: params?.id,
                        // retailOrderBaseDelivery: true,
                      });
                    }}>
                    <Text style={styles.btnText}>Free Items</Text>
                  </TouchableOpacity>
                </View>

              </ScrollView>
            </View>
          )}
        </Formik>
      </ScrollView>
    </>
  );
}

export default RetailOrderDirectDeliveryView;

const styles = StyleSheet.create({
  itemCardContainer: {
    backgroundColor: '#ffffff',

    borderRadius: 7,
    marginVertical: 5,
    marginTop: 10,
    padding: 5,
  },
  checkBoxStyle: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  btnText: {
    borderRadius: 5,
    marginLeft: 10,
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#00cdac',
    // fontFamily: 'HelveticaNeue Light',
  },
});
